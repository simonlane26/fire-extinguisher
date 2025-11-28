import { Controller, Post, Get, Body, UseGuards, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser, CurrentUserData } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
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
}
