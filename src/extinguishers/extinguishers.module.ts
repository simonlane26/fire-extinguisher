import { Module } from '@nestjs/common';
import { ExtinguishersController } from './extinguishers.controller';
import { ExtinguishersPublicController } from './extinguishers-public.controller';
import { ExtinguishersService } from './extinguishers.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StripeModule } from '../stripe/stripe.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, StripeModule, NotificationsModule],
  controllers: [ExtinguishersController, ExtinguishersPublicController],
  providers: [ExtinguishersService],
  exports: [ExtinguishersService],
})
export class ExtinguishersModule {}

