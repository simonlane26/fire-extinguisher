import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../storage/s3.service';
import sharp from 'sharp';

interface UploadPhotoParams {
  tenantId: string;
  userId: string;
  file: Express.Multer.File;
  extinguisherId: string;
  inspectionId?: string;
  caption?: string;
}

@Injectable()
export class PhotosService {
  private readonly logger = new Logger(PhotosService.name);

  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  async uploadPhoto(params: UploadPhotoParams) {
    const { tenantId, userId, file, extinguisherId, inspectionId, caption } = params;

    // Verify extinguisher exists and belongs to tenant
    const extinguisher = await this.prisma.extinguisher.findFirst({
      where: { id: extinguisherId, tenantId },
    });

    if (!extinguisher) {
      throw new NotFoundException('Extinguisher not found');
    }

    // Compress and optimize image
    const compressedBuffer = await this.compressImage(file.buffer, file.mimetype);

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const ext = file.mimetype === 'image/png' ? 'png' : 'jpg';
    const key = `photos/${tenantId}/${extinguisherId}/${timestamp}-${randomString}.${ext}`;

    // Upload to S3
    const imageUrl = await this.s3Service.upload(key, compressedBuffer, `image/${ext}`);
    this.logger.log(`Photo uploaded to S3: ${imageUrl}`);

    // Get user for uploadedBy
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    // Create database record
    const photo = await this.prisma.inspectionPhoto.create({
      data: {
        tenantId,
        extinguisherId,
        inspectionId: inspectionId || null,
        url: imageUrl,
        caption: caption || null,
        uploadedBy: user?.name || user?.email || 'Unknown',
      },
    });

    this.logger.log(`Photo record created: ${photo.id} with URL: ${photo.url}`);
    return photo;
  }

  async getExtinguisherPhotos(tenantId: string, extinguisherId: string) {
    // Verify extinguisher exists and belongs to tenant
    const extinguisher = await this.prisma.extinguisher.findFirst({
      where: { id: extinguisherId, tenantId },
    });

    if (!extinguisher) {
      throw new NotFoundException('Extinguisher not found');
    }

    return this.prisma.inspectionPhoto.findMany({
      where: { tenantId, extinguisherId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deletePhoto(tenantId: string, photoId: string) {
    // Verify photo exists and belongs to tenant
    const photo = await this.prisma.inspectionPhoto.findFirst({
      where: { id: photoId, tenantId },
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    // Delete from database (S3 deletion could be added here if needed)
    await this.prisma.inspectionPhoto.delete({
      where: { id: photoId },
    });

    return { success: true, message: 'Photo deleted successfully' };
  }

  /**
   * Compress and optimize image for web/storage
   */
  private async compressImage(buffer: Buffer, mimeType: string): Promise<Buffer> {
    try {
      let image = sharp(buffer);

      // Get image metadata
      const metadata = await image.metadata();

      // Resize if image is too large (max 1920px width)
      if (metadata.width && metadata.width > 1920) {
        image = image.resize(1920, null, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      // Compress based on format
      if (mimeType === 'image/png') {
        return image
          .png({ quality: 80, compressionLevel: 9 })
          .toBuffer();
      } else {
        // Convert to JPEG for better compression
        return image
          .jpeg({ quality: 85, progressive: true })
          .toBuffer();
      }
    } catch (error) {
      this.logger.error(`Image compression failed: ${error.message}`);
      // Return original buffer if compression fails
      return buffer;
    }
  }
}
