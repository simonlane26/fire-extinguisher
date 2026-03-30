import { Module } from '@nestjs/common';
import { PATTestingController } from './pat-testing.controller';
import { PATTestingService } from './pat-testing.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PATTestingController],
  providers: [PATTestingService],
})
export class PATTestingModule {}
