// src/storage/s3.service.ts
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private s3 = new S3Client({ region: process.env.S3_REGION, credentials: { accessKeyId: process.env.S3_ACCESS_KEY!, secretAccessKey: process.env.S3_SECRET_KEY! }});
  private bucket = process.env.S3_BUCKET!;

  async uploadBuffer(key: string, body: Buffer, contentType: string) {
    await this.s3.send(new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: body, ContentType: contentType, ACL: 'public-read' }));
    return `https://${this.bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
  }
}
