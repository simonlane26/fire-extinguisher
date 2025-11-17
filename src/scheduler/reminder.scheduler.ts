// src/scheduler/reminder.scheduler.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReminderScheduler {
  private readonly logger = new Logger(ReminderScheduler.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private notificationsService: NotificationsService,
  ) {}

  /**
   * Runs every day at 9:00 AM to check for upcoming inspections and maintenance
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkInspectionReminders() {
    this.logger.log('🔍 Checking for inspection reminders...');

    const emailStatus = this.emailService.getConfigurationStatus();
    if (!emailStatus.configured) {
      this.logger.warn(`⚠️  Skipping reminders: ${emailStatus.message}`);
      return;
    }

    try {
      const today = new Date();
      const in30Days = new Date(today);
      in30Days.setDate(today.getDate() + 30);

      // Find extinguishers with inspections due in the next 30 days
      const extinguishers = await this.prisma.extinguisher.findMany({
        where: {
          nextInspection: {
            gte: today,
            lte: in30Days,
          },
          status: 'Active',
        },
        include: {
          tenant: {
            include: {
              users: {
                where: {
                  status: 'active',
                  role: {
                    in: ['admin', 'manager'],
                  },
                },
              },
            },
          },
        },
      });

      this.logger.log(`📋 Found ${extinguishers.length} extinguishers with upcoming inspections`);

      let emailsSent = 0;

      for (const ext of extinguishers) {
        const nextInspection = new Date(ext.nextInspection);
        const daysUntilDue = Math.ceil((nextInspection.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        // Send reminders at 30, 14, and 7 days before
        const shouldSendReminder = daysUntilDue === 30 || daysUntilDue === 14 || daysUntilDue === 7 || daysUntilDue === 1;

        if (shouldSendReminder && ext.tenant.users.length > 0) {
          for (const user of ext.tenant.users) {
            // Send email reminder
            const sent = await this.emailService.sendInspectionReminder({
              extinguisherId: ext.id,
              extinguisherLocation: ext.location,
              building: ext.building,
              nextInspection,
              daysUntilDue,
              recipientEmail: user.email,
              recipientName: user.name,
              companyName: ext.tenant.companyName,
            });

            if (sent) {
              emailsSent++;
            }

            // Send push notification
            try {
              await this.notificationsService.sendInspectionReminder(user.id, {
                id: ext.id,
                location: ext.location,
                building: ext.building,
                nextInspection,
              });
            } catch (error) {
              this.logger.warn(`Failed to send push notification to user ${user.id}: ${error.message}`);
            }
          }

          this.logger.log(
            `📧 Sent inspection reminder for ${ext.id} (${ext.location}) - ${daysUntilDue} days until due`,
          );
        }
      }

      this.logger.log(`✅ Inspection reminder check complete. Sent ${emailsSent} emails.`);
    } catch (error) {
      this.logger.error('❌ Error checking inspection reminders:', error);
    }
  }

  /**
   * Runs every day at 9:30 AM to check for upcoming maintenance
   */
  @Cron('30 9 * * *')
  async checkMaintenanceReminders() {
    this.logger.log('🔧 Checking for maintenance reminders...');

    const emailStatus = this.emailService.getConfigurationStatus();
    if (!emailStatus.configured) {
      this.logger.warn(`⚠️  Skipping reminders: ${emailStatus.message}`);
      return;
    }

    try {
      const today = new Date();
      const in60Days = new Date(today);
      in60Days.setDate(today.getDate() + 60);

      // Find extinguishers with maintenance due in the next 60 days
      const extinguishers = await this.prisma.extinguisher.findMany({
        where: {
          nextMaintenance: {
            gte: today,
            lte: in60Days,
          },
          status: 'Active',
        },
        include: {
          tenant: {
            include: {
              users: {
                where: {
                  status: 'active',
                  role: {
                    in: ['admin', 'manager'],
                  },
                },
              },
            },
          },
        },
      });

      this.logger.log(`🛠️  Found ${extinguishers.length} extinguishers with upcoming maintenance`);

      let emailsSent = 0;

      for (const ext of extinguishers) {
        const nextMaintenance = new Date(ext.nextMaintenance);
        const daysUntilDue = Math.ceil((nextMaintenance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        // Send reminders at 60, 30, 14, and 7 days before
        const shouldSendReminder = daysUntilDue === 60 || daysUntilDue === 30 || daysUntilDue === 14 || daysUntilDue === 7;

        if (shouldSendReminder && ext.tenant.users.length > 0) {
          for (const user of ext.tenant.users) {
            // Send email reminder
            const sent = await this.emailService.sendMaintenanceReminder({
              extinguisherId: ext.id,
              extinguisherLocation: ext.location,
              building: ext.building,
              nextMaintenance,
              daysUntilDue,
              recipientEmail: user.email,
              recipientName: user.name,
              companyName: ext.tenant.companyName,
            });

            if (sent) {
              emailsSent++;
            }

            // Send push notification
            try {
              await this.notificationsService.sendMaintenanceAlert(user.id, {
                id: ext.id,
                location: ext.location,
                building: ext.building,
                nextMaintenance,
              });
            } catch (error) {
              this.logger.warn(`Failed to send push notification to user ${user.id}: ${error.message}`);
            }
          }

          this.logger.log(
            `📧 Sent maintenance reminder for ${ext.id} (${ext.location}) - ${daysUntilDue} days until due`,
          );
        }
      }

      this.logger.log(`✅ Maintenance reminder check complete. Sent ${emailsSent} emails.`);
    } catch (error) {
      this.logger.error('❌ Error checking maintenance reminders:', error);
    }
  }

  /**
   * Manual trigger for testing (can be called via API endpoint)
   */
  async triggerInspectionRemindersNow() {
    this.logger.log('🧪 Manually triggered inspection reminder check');
    await this.checkInspectionReminders();
  }

  async triggerMaintenanceRemindersNow() {
    this.logger.log('🧪 Manually triggered maintenance reminder check');
    await this.checkMaintenanceReminders();
  }
}
