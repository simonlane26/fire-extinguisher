import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtPayload } from './jwt.strategy';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, tenantId, role } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Verify tenant exists
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        tenantId,
        role,
        status: 'active',
      },
      include: {
        tenant: true,
      },
    });

    // Generate JWT
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
        tenant: user.tenant,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user with tenant
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { tenant: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (user.status !== 'active') {
      throw new UnauthorizedException('User account is not active');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
        tenant: user.tenant,
      },
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { tenant: true },
    });

    if (!user || user.status !== 'active') {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
      tenant: user.tenant,
    };
  }

  // ==================== PUBLIC SIGNUP ====================

  async signup(data: {
    companyName: string;
    email: string;
    password: string;
    name: string;
    subdomain?: string;
  }) {
    const { email, password, name, companyName, subdomain } = data;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Generate subdomain if not provided
    const tenantSubdomain = subdomain || companyName.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Check if subdomain is available
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { subdomain: tenantSubdomain },
    });

    if (existingTenant) {
      throw new ConflictException('Company subdomain already taken');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create tenant and user in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create tenant
      const tenant = await tx.tenant.create({
        data: {
          companyName,
          subdomain: tenantSubdomain,
          subscriptionPlan: 'trial',
          subscriptionStatus: 'trial',
        },
      });

      // Create user (first user is admin)
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
          tenantId: tenant.id,
          role: 'admin',
          status: 'active',
          emailVerified: false,
        },
        include: {
          tenant: true,
        },
      });

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      await tx.verificationToken.create({
        data: {
          userId: user.id,
          token: verificationToken,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });

      return { user, verificationToken };
    });

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(
        result.user.email,
        result.user.name,
        result.verificationToken
      );
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't fail signup if email fails
    }

    // Generate JWT
    const payload: JwtPayload = {
      sub: result.user.id,
      email: result.user.email,
      tenantId: result.user.tenantId,
      role: result.user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        tenantId: result.user.tenantId,
        tenant: result.user.tenant,
        emailVerified: result.user.emailVerified,
      },
      message: 'Account created successfully. Please check your email to verify your account.',
    };
  }

  // ==================== EMAIL VERIFICATION ====================

  async verifyEmail(token: string) {
    const verificationToken = await this.prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken) {
      throw new BadRequestException('Invalid verification token');
    }

    if (verificationToken.expiresAt < new Date()) {
      throw new BadRequestException('Verification token has expired');
    }

    // Mark email as verified
    await this.prisma.user.update({
      where: { id: verificationToken.userId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    // Delete used token
    await this.prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return { message: 'Email verified successfully' };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Delete any existing tokens
    await this.prisma.verificationToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate new token
    const token = crypto.randomBytes(32).toString('hex');
    await this.prisma.verificationToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Send email
    await this.emailService.sendVerificationEmail(user.email, user.name, token);

    return { message: 'Verification email sent' };
  }

  // ==================== PASSWORD RESET ====================

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return { message: 'If your email is in our system, you will receive a password reset link.' };
    }

    // Delete any existing unused tokens
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id, used: false },
    });

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Send email
    try {
      await this.emailService.sendPasswordResetEmail(user.email, user.name, token);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }

    return { message: 'If your email is in our system, you will receive a password reset link.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken || resetToken.used) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update password and mark token as used
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    return { message: 'Password reset successfully' };
  }
}
