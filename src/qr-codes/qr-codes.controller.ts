import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Res,
  StreamableFile,
  BadRequestException
} from '@nestjs/common';
import { Response } from 'express';
import { QrCodesService } from './qr-codes.service';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { TenantGuard } from '../auth/tenant.guard';
import { GenerateQrDto, GenerateBulkQrDto } from './dto/generate-qr.dto';

@Controller('qr-codes')
@UseGuards(TenantGuard)
export class QrCodesController {
  constructor(private readonly service: QrCodesService) {}

  @Post('generate')
  async generateSingle(@CurrentUser() user: CurrentUserData, @Body() dto: GenerateQrDto) {
    return this.service.generateQrCode(dto);
  }

  @Post('generate-bulk')
  async generateBulk(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: GenerateBulkQrDto,
    @Res() res: Response
  ) {
    const zipBuffer = await this.service.generateBulkQrCodes(user.tenantId, dto);

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="qr-codes-${Date.now()}.zip"`,
      'Content-Length': zipBuffer.length,
    });

    res.send(zipBuffer);
  }

  @Get('extinguisher/:id')
  async getExtinguisherQr(
    @CurrentUser() user: CurrentUserData,
    @Res() res: Response,
    @Body() extinguisherId: string
  ) {
    const qrBuffer = await this.service.generateExtinguisherQr(user.tenantId, extinguisherId);

    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `inline; filename="qr-${extinguisherId}.png"`,
    });

    res.send(qrBuffer);
  }
}
