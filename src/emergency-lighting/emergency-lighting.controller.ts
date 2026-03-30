import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards,
  UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { EmergencyLightingService } from './emergency-lighting.service';

@Controller('emergency-lighting')
@UseGuards(JwtAuthGuard)
export class EmergencyLightingController {
  constructor(private readonly service: EmergencyLightingService) {}

  // ─── Luminaires ──────────────────────────────────────────────────────────────

  @Get('luminaires')
  getLuminaires(@CurrentUser() user: CurrentUserData, @Query('siteId') siteId?: string) {
    return this.service.getLuminaires(user.tenantId, siteId);
  }

  @Post('luminaires')
  createLuminaire(@CurrentUser() user: CurrentUserData, @Body() body: any) {
    return this.service.createLuminaire(user.tenantId, body);
  }

  @Patch('luminaires/:id')
  updateLuminaire(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.service.updateLuminaire(user.tenantId, id, body);
  }

  @Delete('luminaires/:id')
  deleteLuminaire(@CurrentUser() user: CurrentUserData, @Param('id') id: string) {
    return this.service.deleteLuminaire(user.tenantId, id);
  }

  @Post('luminaires/import/csv')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.toLowerCase().endsWith('.csv')) {
        return callback(new BadRequestException('Only CSV files allowed'), false);
      }
      callback(null, true);
    },
  }))
  async importCsv(
    @CurrentUser() user: CurrentUserData,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.service.importFromCsv(user.tenantId, file.buffer.toString('utf-8'));
  }

  // ─── Tests ───────────────────────────────────────────────────────────────────

  @Get('luminaires/:id/tests')
  getTests(@CurrentUser() user: CurrentUserData, @Param('id') id: string) {
    return this.service.getTests(user.tenantId, id);
  }

  @Post('luminaires/:id/tests')
  createTest(
    @CurrentUser() user: CurrentUserData,
    @Param('id') luminaireId: string,
    @Body() body: any,
  ) {
    return this.service.createTest(user.tenantId, luminaireId, body);
  }

  @Delete('tests/:id')
  deleteTest(@CurrentUser() user: CurrentUserData, @Param('id') id: string) {
    return this.service.deleteTest(user.tenantId, id);
  }
}
