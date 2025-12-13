import { Controller, Post, Get, Body, UseGuards, Patch, Param, UseInterceptors, UploadedFile, BadRequestException, PayloadTooLargeException, ForbiddenException, Res, StreamableFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser, CurrentUserData } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../storage/s3.service';
import * as fs from 'fs';
import * as path from 'path';

const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: CurrentUserData) {
    return {
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

  // ==================== PUBLIC SIGNUP ====================

  @Public()
  @Post('signup')
  async signup(@Body() body: {
    companyName: string;
    email: string;
    password: string;
    name: string;
    subdomain?: string;
  }) {
    return this.authService.signup(body);
  }

  // ==================== EMAIL VERIFICATION ====================

  @Public()
  @Post('verify-email')
  async verifyEmail(@Body('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Public()
  @Post('resend-verification')
  async resendVerification(@Body('email') email: string) {
    return this.authService.resendVerificationEmail(email);
  }

  // ==================== PASSWORD RESET ====================

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  // ==================== USER & TENANT UPDATES ====================

  @Patch('update-role')
  @UseGuards(JwtAuthGuard)
  async updateRole(
    @CurrentUser() user: CurrentUserData,
    @Body('role') role: string,
  ) {
    // Update user's role in the database
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { role },
      include: { tenant: true },
    });

    return {
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        tenantId: updatedUser.tenantId,
        tenant: updatedUser.tenant,
      },
    };
  }

  @Patch('update-tenant')
  @UseGuards(JwtAuthGuard)
  async updateTenant(
    @CurrentUser() user: CurrentUserData,
    @Body() body: {
      companyName?: string;
      subdomain?: string;
      primaryColor?: string;
      secondaryColor?: string;
      logoUrl?: string;
    },
  ) {
    // Update tenant in the database
    const updatedTenant = await this.prisma.tenant.update({
      where: { id: user.tenantId },
      data: {
        ...(body.companyName !== undefined && { companyName: body.companyName }),
        ...(body.subdomain !== undefined && { subdomain: body.subdomain }),
        ...(body.primaryColor !== undefined && { primaryColor: body.primaryColor }),
        ...(body.secondaryColor !== undefined && { secondaryColor: body.secondaryColor }),
        ...(body.logoUrl !== undefined && { logoUrl: body.logoUrl }),
      },
    });

    // Get updated user with tenant
    const updatedUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { tenant: true },
    });

    return {
      success: true,
      tenant: updatedTenant,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        tenantId: updatedUser.tenantId,
        tenant: updatedUser.tenant,
      },
    };
  }

  @Post('upload-logo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: MAX_LOGO_SIZE,
    },
    fileFilter: (req, file, callback) => {
      // Validate MIME type
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return callback(
          new BadRequestException(
            `Invalid file type. Only ${ALLOWED_EXTENSIONS.join(', ')} files are allowed.`
          ),
          false
        );
      }

      // Validate file extension
      const ext = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return callback(
          new BadRequestException(
            `Invalid file extension. Only ${ALLOWED_EXTENSIONS.join(', ')} files are allowed.`
          ),
          false
        );
      }

      callback(null, true);
    },
  }))
  async uploadLogo(
    @CurrentUser() user: CurrentUserData,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Validate file was uploaded
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Double-check file size
    if (file.size > MAX_LOGO_SIZE) {
      throw new PayloadTooLargeException(
        `File size exceeds maximum allowed size of ${MAX_LOGO_SIZE / 1024 / 1024}MB`
      );
    }

    const tenantId = user.tenantId;

    // Try S3 upload first, fallback to local storage if S3 not configured
    try {
      // Upload to S3
      console.log('🚀 Attempting S3 upload...');
      const key = `logos/${tenantId}/${Date.now()}-${file.originalname}`;
      const url = await this.s3.upload(key, file.buffer, file.mimetype);
      console.log('✅ S3 upload successful:', url);

      return {
        success: true,
        url,
      };
    } catch (s3Error) {
      console.error('❌ S3 upload failed, using local storage:');
      console.error('Error:', s3Error);
      console.error('Message:', s3Error.message);
      // S3 not configured, fallback to local storage
      this.prisma['$log']?.warn?.(`S3 upload failed, using local storage: ${s3Error.message}`);

      // Save to local uploads directory
      const uploadsDir = path.join(process.cwd(), 'uploads', 'logos', tenantId);

      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      const filename = `${timestamp}${ext}`;
      const filepath = path.join(uploadsDir, filename);

      // Write file to disk
      fs.writeFileSync(filepath, file.buffer);

      // Construct URL for accessing the file
      // The URL will be served by the static assets middleware in main.ts
      const url = `/uploads/logos/${tenantId}/${filename}`;

      return {
        success: true,
        url,
      };
    }
  }

  @Post('users')
  @UseGuards(JwtAuthGuard)
  async createUser(
    @CurrentUser() currentUser: CurrentUserData,
    @Body() body: { name: string; email: string; role: string; status?: string },
  ) {
    // Only admins and super_admins can create users
    if (!['admin', 'super_admin'].includes(currentUser.role)) {
      throw new ForbiddenException('Only admins can create users');
    }

    const { name, email, role, status = 'active' } = body;

    // Validate the role
    const validRoles = ['super_admin', 'admin', 'manager', 'inspector', 'viewer'];
    if (!validRoles.includes(role)) {
      throw new BadRequestException('Invalid role');
    }

    // Admins cannot create super_admin users
    if (currentUser.role === 'admin' && role === 'super_admin') {
      throw new ForbiddenException('Admins cannot create super admin users');
    }

    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    // Create a temporary password (user should reset it via email)
    const tempPassword = Math.random().toString(36).slice(-12);
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    // Create the user
    const newUser = await this.prisma.user.create({
      data: {
        tenantId: currentUser.tenantId,
        name,
        email,
        passwordHash,
        role,
        status,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    // TODO: Send invitation email with password reset link
    // For now, we just create the user

    return newUser;
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  async getUsers(@CurrentUser() currentUser: CurrentUserData) {
    const whereClause: any = {
      tenantId: currentUser.tenantId,
    };

    // Admins cannot see super_admin users
    if (currentUser.role === 'admin') {
      whereClause.role = {
        not: 'super_admin',
      };
    }

    const users = await this.prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users;
  }

  @Patch('users/:userId/role')
  @UseGuards(JwtAuthGuard)
  async updateUserRole(
    @CurrentUser() currentUser: CurrentUserData,
    @Param('userId') userId: string,
    @Body('role') role: string,
  ) {
    // Only admins and super_admins can update roles
    if (!['admin', 'super_admin'].includes(currentUser.role)) {
      throw new ForbiddenException('Only admins can update user roles');
    }

    // Validate the role
    const validRoles = ['super_admin', 'admin', 'manager', 'inspector', 'viewer'];
    if (!validRoles.includes(role)) {
      throw new BadRequestException('Invalid role');
    }

    // First verify the user exists and is in the same tenant
    const userToUpdate = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, tenantId: true, role: true },
    });

    if (!userToUpdate) {
      throw new BadRequestException('User not found');
    }

    if (userToUpdate.tenantId !== currentUser.tenantId) {
      throw new ForbiddenException('Cannot update user from different tenant');
    }

    // Admins cannot edit super_admin users or assign super_admin role
    if (currentUser.role === 'admin') {
      if (userToUpdate.role === 'super_admin') {
        throw new ForbiddenException('Admins cannot modify super admin users');
      }
      if (role === 'super_admin') {
        throw new ForbiddenException('Admins cannot assign super admin role');
      }
    }

    // Update the user's role
    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      user: updatedUser,
    };
  }

  /**
   * Proxy endpoint to serve tenant logos with proper CORS headers
   * This bypasses S3 CORS issues for canvas operations
   */
  @Public()
  @Get('logo/:tenantId')
  async getLogoProxy(
    @Param('tenantId') tenantId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Fetch tenant logo URL from database
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { logoUrl: true },
    });

    if (!tenant?.logoUrl) {
      throw new BadRequestException('Logo not found');
    }

    try {
      // Fetch the logo from S3 or local storage
      const response = await fetch(tenant.logoUrl);
      if (!response.ok) {
        throw new BadRequestException('Failed to fetch logo');
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const contentType = response.headers.get('content-type') || 'image/png';

      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000');

      return new StreamableFile(buffer);
    } catch (error) {
      throw new BadRequestException(`Failed to load logo: ${error.message}`);
    }
  }
}
