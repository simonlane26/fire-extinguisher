import { Module } from '@nestjs/common';
import { ExtinguishersController } from './extinguishers.controller';
import { ExtinguishersService } from './extinguishers.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExtinguishersController],
  providers: [ExtinguishersService],
  exports: [ExtinguishersService],
})
export class ExtinguishersModule {}

