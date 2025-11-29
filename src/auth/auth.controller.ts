import { Controller, Post, Get, Body, UseGuards, Patch, UseInterceptors, UploadedFile, BadRequestException, PayloadTooLargeException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
      const key = `logos/${tenantId}/${Date.now()}-${file.originalname}`;
      const url = await this.s3.upload(key, file.buffer, file.mimetype);

      return {
        success: true,
        url,
      };
    } catch (s3Error) {
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
}
