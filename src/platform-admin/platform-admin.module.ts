import { Module } from '@nestjs/common';
import { PlatformAdminController } from './platform-admin.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PlatformAdminController],
})
export class PlatformAdminModule {}
