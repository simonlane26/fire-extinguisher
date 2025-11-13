import { Module } from '@nestjs/common';
import { ExtinguishersController } from './extinguishers.controller';
import { ExtinguishersService } from './extinguishers.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [PrismaModule, StripeModule],
  controllers: [ExtinguishersController],
  providers: [ExtinguishersService],
  exports: [ExtinguishersService],
})
export class ExtinguishersModule {}

