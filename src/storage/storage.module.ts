import { Module } from '@nestjs/common';
import { S3Service } from './storage.service';

@Module({
  providers: [S3Service],
  exports: [S3Service], // allow other modules to inject it
})
export class StorageModule {}
