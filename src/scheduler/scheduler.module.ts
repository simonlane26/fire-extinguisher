// src/scheduler/scheduler.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ReminderScheduler } from './reminder.scheduler';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, EmailModule],
  providers: [ReminderScheduler],
})
export class SchedulerModule {}
