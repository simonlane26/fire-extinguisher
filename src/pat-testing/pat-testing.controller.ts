import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards,
  UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { PATTestingService } from './pat-testing.service';

@Controller('pat-testing')
@UseGuards(JwtAuthGuard)
export class PATTestingController {
  constructor(private readonly service: PATTestingService) {}

  // ─── Appliances ───────────────────────────────────────────────────────────

  @Get('appliances')
  getAppliances(@CurrentUser() user: CurrentUserData, @Query('siteId') siteId?: string) {
    return this.service.getAppliances(user.tenantId, siteId);
  }

  @Post('appliances')
  createAppliance(@CurrentUser() user: CurrentUserData, @Body() body: any) {
    return this.service.createAppliance(user.tenantId, body);
  }

  @Patch('appliances/:id')
  updateAppliance(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.service.updateAppliance(user.tenantId, id, body);
  }

  @Delete('appliances/:id')
  deleteAppliance(@CurrentUser() user: CurrentUserData, @Param('id') id: string) {
    return this.service.deleteAppliance(user.tenantId, id);
  }

  @Post('appliances/import/csv')
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

  // ─── Tests ─────────────────────────────────────────────────────────────────

  @Get('appliances/:id/tests')
  getTests(@CurrentUser() user: CurrentUserData, @Param('id') id: string) {
    return this.service.getTests(user.tenantId, id);
  }

  @Post('appliances/:id/tests')
  createTest(
    @CurrentUser() user: CurrentUserData,
    @Param('id') applianceId: string,
    @Body() body: any,
  ) {
    return this.service.createTest(user.tenantId, applianceId, body);
  }

  @Delete('tests/:id')
  deleteTest(@CurrentUser() user: CurrentUserData, @Param('id') id: string) {
    return this.service.deleteTest(user.tenantId, id);
  }
}
