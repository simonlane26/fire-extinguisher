// src/app.module.ts
import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ExtinguishersModule } from './extinguishers/extinguishers.module';
import { InspectionsModule } from './inspections/inspections.module';
import { AssistantModule } from './assistant/assistant.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ReportsModule } from './reports/reports.module';
import { StorageModule } from './storage/storage.module';
import { VisionModule } from './vision/vision.module';
import { AuthModule } from './auth/auth.module';
import { QrCodesModule } from './qr-codes/qr-codes.module';
import { StripeModule } from './stripe/stripe.module';
import { EmailModule } from './email/email.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    // Rate Limiting - 100 requests per 60 seconds per IP
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // Time to live (1 minute)
        limit: 100, // Max requests per TTL
      },
    ]),
    PrismaModule,
    AuthModule,
    VisionModule,
    ExtinguishersModule,
    InspectionsModule,
    AssistantModule,
    ReportsModule,
    StorageModule,
    QrCodesModule,
    StripeModule,
    EmailModule,
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Apply rate limiting globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

