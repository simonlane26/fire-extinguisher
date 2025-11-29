// src/inspections/inspections.controller.ts
import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Param, BadRequestException, PayloadTooLargeException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../storage/s3.service';
import { VisionService } from '../vision/vision.service';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { TenantGuard } from '../auth/tenant.guard';

// File upload constraints
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

@Controller('inspections')
@UseGuards(TenantGuard)
export class InspectionsController {
  constructor(
    private readonly prisma: PrismaService,
    private s3: S3Service,
    private vision: VisionService,
  ) {}

  @Post('photos/:extinguisherId')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: MAX_FILE_SIZE,
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
  async uploadPhoto(
    @CurrentUser() user: CurrentUserData,
    @Param('extinguisherId') extinguisherId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Validate file was uploaded
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Double-check file size (belt and suspenders approach)
    if (file.size > MAX_FILE_SIZE) {
      throw new PayloadTooLargeException(
        `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`
      );
    }

    const tenantId = user.tenantId;

    // 1) store image
    const key = `tenants/${tenantId}/extinguishers/${extinguisherId}/${Date.now()}-${file.originalname}`;
    const url = await this.s3.uploadBuffer(key, file.buffer, file.mimetype);

    // 2) analyze
    const findings = await this.vision.analyze(url);

    // 3) save
    const record = await this.prisma.inspectionPhoto.create({
      data: {
        tenantId,
        extinguisherId,
        url,
        findings,
      },
    });

    // 4) return + flag if out-of-range
    const outOfRange = findings.gauge === 'low' || findings.gauge === 'high' || findings.pinMissing || findings.sealMissing || findings.hose !== 'ok' || findings.surface !== 'ok';
    return { photo: record, outOfRange };
  }
}
