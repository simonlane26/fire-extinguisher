// src/storage/s3.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private s3: S3Client | null = null;
  private bucket: string = '';
  private isConfigured = false;

  constructor() {
    // Support both AWS_* and S3_* naming conventions
    const region = process.env.AWS_REGION || process.env.S3_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.S3_SECRET_KEY;
    const bucket = process.env.S3_BUCKET;

    const hasS3Config = region && bucket && accessKeyId && secretAccessKey;

    if (hasS3Config) {
      try {
        this.s3 = new S3Client({
          region,
          credentials: { accessKeyId, secretAccessKey }
        });
        this.bucket = bucket;
        this.isConfigured = true;
        this.logger.log('✅ S3 storage configured');
      } catch (error) {
        this.logger.warn(`⚠️  Failed to configure S3: ${error.message}`);
      }
    } else {
      this.logger.warn('⚠️  S3 not configured. S3Service will not be available.');
    }
  }

  /**
   * Upload a buffer to S3
   *
   * IMPORTANT: For images used in canvas operations (like QR code generation),
   * ensure your S3 bucket has CORS configured to allow cross-origin access:
   *
   * [
   *   {
   *     "AllowedHeaders": ["*"],
   *     "AllowedMethods": ["GET", "HEAD"],
   *     "AllowedOrigins": ["*"],
   *     "ExposeHeaders": []
   *   }
   * ]
   */
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
          CacheControl: 'public, max-age=31536000', // Cache for 1 year
        }));
      } catch (aclError: any) {
        // If ACL fails (disabled on bucket), upload without ACL
        this.logger.warn(`ACL failed, uploading without ACL: ${aclError.message}`);
        await this.s3.send(new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
          CacheControl: 'public, max-age=31536000', // Cache for 1 year
        }));
      }

      // Return the public S3 URL
      const region = process.env.AWS_REGION || process.env.S3_REGION;
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

  /**
   * Generate a pre-signed URL for a private S3 object.
   * Works regardless of bucket ACL / public-access settings.
   * Default expiry: 1 hour (3600 seconds).
   */
  async presign(key: string, expiresIn = 3600): Promise<string> {
    if (!this.isConfigured || !this.s3) {
      throw new Error('S3 service is not configured');
    }
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.s3, command, { expiresIn });
  }

  /**
   * Extract the S3 object key from a stored URL.
   * Stored format: https://{bucket}.s3.{region}.amazonaws.com/{key}
   */
  extractKey(url: string): string | null {
    try {
      const parsed = new URL(url);
      // pathname starts with '/' — drop it to get the key
      return parsed.pathname.slice(1);
    } catch {
      return null;
    }
  }

  get configured(): boolean {
    return this.isConfigured;
  }
}
