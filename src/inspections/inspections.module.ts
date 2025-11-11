import { Module } from '@nestjs/common';
import { InspectionsController } from './inspections.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from '../storage/storage.module';
import { VisionModule } from '../vision/vision.module';

@Module({
  imports: [PrismaModule, StorageModule, VisionModule],
  controllers: [InspectionsController],
})
export class InspectionsModule {}

