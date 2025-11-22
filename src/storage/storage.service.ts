import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class S3Service {
  private readonly s3: S3Client | null = null;
  private readonly bucket: string;
  private readonly useLocalStorage: boolean;
  private readonly localStoragePath: string;

  constructor() {
    // Check if S3 is configured
    const hasS3Config = process.env.S3_REGION && process.env.S3_BUCKET &&
                        process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY;

    if (hasS3Config) {
      // Use S3 storage
      this.useLocalStorage = false;
      this.bucket = process.env.S3_BUCKET!;
      try {
        this.s3 = new S3Client({
          region: process.env.S3_REGION!,
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY!,
            secretAccessKey: process.env.S3_SECRET_KEY!,
          },
        });
        console.log('✅ S3 storage configured');
      } catch (error) {
        console.warn('⚠️  Failed to initialize S3, falling back to local storage:', error.message);
        this.useLocalStorage = true;
        this.bucket = '';
        this.localStoragePath = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(this.localStoragePath)) {
          fs.mkdirSync(this.localStoragePath, { recursive: true });
        }
      }
    } else {
      // Use local file storage
      console.log('⚠️  S3 not configured. Using local file storage.');
      this.useLocalStorage = true;
      this.bucket = '';
      this.localStoragePath = path.join(process.cwd(), 'uploads');

      // Ensure uploads directory exists
      if (!fs.existsSync(this.localStoragePath)) {
        fs.mkdirSync(this.localStoragePath, { recursive: true });
      }
    }
  }

  async uploadBuffer(key: string, body: Buffer, contentType: string) {
    if (this.useLocalStorage) {
      // Local file storage
      const filePath = path.join(this.localStoragePath, key);
      const dir = path.dirname(filePath);

      // Ensure directory exists
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write file
      fs.writeFileSync(filePath, body);

      // Return local URL
      return `/uploads/${key}`;
    } else {
      // S3 storage
      await this.s3!.send(new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        ACL: 'public-read',
      }));
      return `https://${this.bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
    }
  }

  async delete(key: string) {
    if (this.useLocalStorage) {
      // Local file storage
      const filePath = path.join(this.localStoragePath, key);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } else {
      // S3 storage
      await this.s3!.send(new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }));
    }
  }
}
