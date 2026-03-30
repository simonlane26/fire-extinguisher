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
import { SitesModule } from './sites/sites.module';
import { InventoryModule } from './inventory/inventory.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PublicModule } from './public/public.module';
import { PhotosModule } from './photos/photos.module';
import { UsersModule } from './users/users.module';
import { QuotesModule } from './quotes/quotes.module';
import { PlatformAdminModule } from './platform-admin/platform-admin.module';
import { FireAlarmModule } from './fire-alarm/fire-alarm.module';
import { PATTestingModule } from './pat-testing/pat-testing.module';
import { EmergencyLightingModule } from './emergency-lighting/emergency-lighting.module';

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
    SitesModule,
    InventoryModule,
    NotificationsModule,
    PublicModule,
    PhotosModule,
    UsersModule,
    QuotesModule,
    PlatformAdminModule,
    FireAlarmModule,
    PATTestingModule,
    EmergencyLightingModule,
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

