import { Module } from '@nestjs/common';
import { EmergencyLightingController } from './emergency-lighting.controller';
import { EmergencyLightingService } from './emergency-lighting.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EmergencyLightingController],
  providers: [EmergencyLightingService],
})
export class EmergencyLightingModule {}
