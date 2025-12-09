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
    const hasS3Config = process.env.AWS_REGION && process.env.S3_BUCKET &&
                        process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

    if (hasS3Config) {
      try {
        this.s3 = new S3Client({
          region: process.env.AWS_REGION!,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
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

    try {
      // Try with ACL first
      try {
        await this.s3.send(new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
          ACL: 'public-read', // Make object publicly readable
        }));
      } catch (aclError: any) {
        // If ACL fails (disabled on bucket), upload without ACL
        this.logger.warn(`ACL failed, uploading without ACL: ${aclError.message}`);
        await this.s3.send(new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
        }));
      }

      // Return the public S3 URL
      const region = process.env.AWS_REGION;
      return `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`;
    } catch (error) {
      this.logger.error(`Failed to upload to S3: ${error.message}`);
      throw new Error(`S3 upload failed: ${error.message}`);
    }
  }

  // Alias for compatibility with existing code
  async upload(key: string, body: Buffer, contentType: string) {
    return this.uploadBuffer(key, body, contentType);
  }
}
