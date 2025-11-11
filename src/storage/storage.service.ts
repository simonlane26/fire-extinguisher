import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor() {
    if (!process.env.S3_REGION || !process.env.S3_BUCKET || !process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_KEY) {
      throw new Error('S3 env vars missing: S3_REGION, S3_BUCKET, S3_ACCESS_KEY, S3_SECRET_KEY');
    }

    this.bucket = process.env.S3_BUCKET!;
    this.s3 = new S3Client({
      region: process.env.S3_REGION!,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!,
      },
    });
  }

  async uploadBuffer(key: string, body: Buffer, contentType: string) {
    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: 'public-read', // remove if you don’t want public files
    }));
    // public URL pattern (adjust if you use a CDN or different domain)
    return `https://${this.bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
  }

  async delete(key: string) {
    await this.s3.send(new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    }));
  }
}
