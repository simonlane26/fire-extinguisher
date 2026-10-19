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

  // ─── Photos ──────────────────────────────────────────────────────────────────

  @Post('doors/:id/photos')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
      const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return callback(new BadRequestException('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
      }
      const ext = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        return callback(new BadRequestException('Invalid file extension. Only .jpg, .jpeg, .png, and .webp files are allowed.'), false);
      }
      callback(null, true);
    },
  }))
  async uploadPhoto(
    @CurrentUser() user: CurrentUserData,
    @Param('id') doorId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('inspectionId') inspectionId?: string,
    @Body('caption') caption?: string,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.service.uploadPhoto(user.tenantId, user.id, doorId, file, inspectionId, caption);
  }

  @Get('doors/:id/photos')
  getPhotos(@CurrentUser() user: CurrentUserData, @Param('id') id: string) {
    return this.service.getPhotos(user.tenantId, id);
  }

  @Delete('photos/:photoId')
  deletePhoto(@CurrentUser() user: CurrentUserData, @Param('photoId') photoId: string) {
    return this.service.deletePhoto(user.tenantId, photoId);
  }
}
