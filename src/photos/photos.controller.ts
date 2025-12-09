import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotosService } from './photos.service';
import { TenantGuard } from '../auth/tenant.guard';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';

@Controller('photos')
@UseGuards(TenantGuard)
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
      },
      fileFilter: (req, file, callback) => {
        // Validate MIME type for images
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'),
            false
          );
        }

        // Validate file extension
        const ext = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
        if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
          return callback(
            new BadRequestException('Invalid file extension. Only .jpg, .jpeg, .png, and .webp files are allowed.'),
            false
          );
        }

        callback(null, true);
      },
    })
  )
  async uploadPhoto(
    @CurrentUser() user: CurrentUserData,
    @UploadedFile() file: Express.Multer.File,
    @Body('extinguisherId') extinguisherId: string,
    @Body('inspectionId') inspectionId?: string,
    @Body('caption') caption?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!extinguisherId) {
      throw new BadRequestException('extinguisherId is required');
    }

    return this.photosService.uploadPhoto({
      tenantId: user.tenantId,
      userId: user.id,
      file,
      extinguisherId,
      inspectionId,
      caption,
    });
  }

  @Get('extinguisher/:extinguisherId')
  async getExtinguisherPhotos(
    @CurrentUser() user: CurrentUserData,
    @Param('extinguisherId') extinguisherId: string,
  ) {
    return this.photosService.getExtinguisherPhotos(user.tenantId, extinguisherId);
  }

  @Delete(':photoId')
  async deletePhoto(
    @CurrentUser() user: CurrentUserData,
    @Param('photoId') photoId: string,
  ) {
    return this.photosService.deletePhoto(user.tenantId, photoId);
  }
}
