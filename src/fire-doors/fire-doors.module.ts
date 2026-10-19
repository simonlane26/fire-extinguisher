import { Module } from '@nestjs/common';
import { FireDoorsController } from './fire-doors.controller';
import { FireDoorsService } from './fire-doors.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FireDoorsController],
  providers: [FireDoorsService],
})
export class FireDoorsModule {}
