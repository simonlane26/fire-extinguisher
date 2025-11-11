// src/inspections/inspections.controller.ts
import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../storage/storage.service';
import { VisionService } from '../vision/vision.service';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { TenantGuard } from '../auth/tenant.guard';

@Controller('inspections')
@UseGuards(TenantGuard)
export class InspectionsController {
  constructor(
    private readonly prisma: PrismaService,
    private s3: S3Service,
    private vision: VisionService,
  ) {}

  @Post('photos/:extinguisherId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @CurrentUser() user: CurrentUserData,
    @Param('extinguisherId') extinguisherId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
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
