import { Module } from '@nestjs/common';
import { FireAlarmController } from './fire-alarm.controller';
import { FireAlarmService } from './fire-alarm.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FireAlarmController],
  providers: [FireAlarmService],
})
export class FireAlarmModule {}
