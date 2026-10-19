import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards,
  UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { FireDoorsService } from './fire-doors.service';

@Controller('fire-doors')
@UseGuards(JwtAuthGuard)
export class FireDoorsController {
  constructor(private readonly service: FireDoorsService) {}

  // ─── Doors ───────────────────────────────────────────────────────────────────

  @Get('doors')
  getDoors(@CurrentUser() user: CurrentUserData, @Query('siteId') siteId?: string) {
    return this.service.getDoors(user.tenantId, siteId);
  }

  @Post('doors')
  createDoor(@CurrentUser() user: CurrentUserData, @Body() body: any) {
    return this.service.createDoor(user.tenantId, body);
  }

  @Patch('doors/:id')
  updateDoor(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.service.updateDoor(user.tenantId, id, body);
  }

  @Delete('doors/:id')
  deleteDoor(@CurrentUser() user: CurrentUserData, @Param('id') id: string) {
    return this.service.deleteDoor(user.tenantId, id);
  }

  @Post('doors/import/csv')
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

  // ─── Inspections ─────────────────────────────────────────────────────────────

  @Get('doors/:id/inspections')
  getInspections(@CurrentUser() user: CurrentUserData, @Param('id') id: string) {
    return this.service.getInspections(user.tenantId, id);
  }

  @Post('doors/:id/inspections')
  createInspection(
    @CurrentUser() user: CurrentUserData,
    @Param('id') doorId: string,
    @Body() body: any,
  ) {
    return this.service.createInspection(user.tenantId, doorId, body);
  }

  @Delete('inspections/:id')
  deleteInspection(@CurrentUser() user: CurrentUserData, @Param('id') id: string) {
    return this.service.deleteInspection(user.tenantId, id);
  }
}
