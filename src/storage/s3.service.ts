// src/storage/s3.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private s3: S3Client | null = null;
  private bucket: string = '';
  private isConfigured = false;

  constructor() {
    const hasS3Config = process.env.S3_REGION && process.env.S3_BUCKET &&
                        process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY;

    if (hasS3Config) {
      try {
        this.s3 = new S3Client({
          region: process.env.S3_REGION!,
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY!,
            secretAccessKey: process.env.S3_SECRET_KEY!
          }
        });
        this.bucket = process.env.S3_BUCKET!;
        this.isConfigured = true;
        this.logger.log('✅ S3 storage configured');
      } catch (error) {
        this.logger.warn(`⚠️  Failed to configure S3: ${error.message}`);
      }
    } else {
      this.logger.warn('⚠️  S3 not configured. S3Service will not be available.');
    }
  }

  async uploadBuffer(key: string, body: Buffer, contentType: string) {
    if (!this.isConfigured || !this.s3) {
      throw new Error('S3 service is not configured');
    }

    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: 'public-read'
    }));
    return `https://${this.bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
  }
}
