import { Module } from '@nestjs/common';
import { FireDoorsController } from './fire-doors.controller';
import { FireDoorsService } from './fire-doors.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [FireDoorsController],
  providers: [FireDoorsService],
})
export class FireDoorsModule {}
