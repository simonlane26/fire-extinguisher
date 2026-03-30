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
   * Runs every day at 9:15 AM to check for overdue fire alarm tests
   */
  @Cron('15 9 * * *')
  async checkFireAlarmOverdueAlerts() {
    this.logger.log('🔔 Checking for overdue fire alarm tests...');

    const emailStatus = this.emailService.getConfigurationStatus();
    if (!emailStatus.configured) {
      this.logger.warn(`⚠️  Skipping fire alarm alerts: ${emailStatus.message}`);
      return;
    }

    try {
      const today = new Date();

      // Fields and their human-readable labels
      const testTypes: { field: string; label: string }[] = [
        { field: 'nextWeeklyDue', label: 'weekly' },
        { field: 'nextMonthlyDue', label: 'monthly' },
        { field: 'nextQuarterlyDue', label: 'quarterly' },
        { field: 'nextSixMonthlyDue', label: 'six_monthly' },
        { field: 'nextAnnualDue', label: 'annual' },
      ];

      let alertsSent = 0;

      for (const { field, label } of testTypes) {
        const overdueSystems = await (this.prisma.fireAlarmSystem as any).findMany({
          where: {
            [field]: { lt: today },
            tenant: { fireAlarmEnabled: true },
          },
          include: {
            site: { select: { name: true } },
            tenant: {
              include: {
                users: {
                  where: { status: 'active', role: { in: ['admin', 'manager'] } },
                },
              },
            },
          },
        });

        this.logger.log(`🔔 [${label}] Found ${overdueSystems.length} overdue fire alarm system(s)`);

        for (const system of overdueSystems) {
          const dueDate: Date = system[field];
          const daysOverdue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

          // Only alert on day 1, 3, 7 overdue to avoid flooding
          if (![1, 3, 7].includes(daysOverdue)) continue;

          const users = system.tenant?.users ?? [];
          for (const user of users) {
            // Email
            const sent = await this.emailService.sendFireAlarmOverdueAlert({
              siteName: system.site?.name ?? 'Unknown Site',
              systemRef: system.systemRef,
              systemName: system.name,
              panelMake: system.panelMake,
              panelModel: system.panelModel,
              testType: label,
              overdueSince: dueDate,
              daysOverdue,
              recipientEmail: user.email,
              recipientName: user.name,
              companyName: system.tenant.companyName,
            });
            if (sent) alertsSent++;

            // Push notification
            try {
              const typeLabel = label.replace(/_/g, '-').replace(/\b\w/g, (c: string) => c.toUpperCase());
              await this.notificationsService.sendToUser(user.id, {
                title: `🔔 Fire Alarm ${typeLabel} Test Overdue`,
                body: `Site: ${system.site?.name ?? 'Unknown'} — Panel: ${[system.panelMake, system.panelModel].filter(Boolean).join(' ') || system.systemRef} (${daysOverdue}d overdue)`,
                icon: '/icon-192x192.png',
                tag: `fa-overdue-${system.id}-${label}`,
              });
            } catch (err) {
              this.logger.warn(`Failed to send push to user ${user.id}: ${err.message}`);
            }
          }

          this.logger.log(`📧 Fire alarm ${label} overdue alert sent for system ${system.systemRef} (${daysOverdue}d overdue)`);
        }
      }

      this.logger.log(`✅ Fire alarm overdue check complete. Sent ${alertsSent} emails.`);
    } catch (error) {
      this.logger.error('❌ Error checking fire alarm overdue alerts:', error);
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

  async triggerFireAlarmOverdueAlertsNow() {
    this.logger.log('🧪 Manually triggered fire alarm overdue check');
    await this.checkFireAlarmOverdueAlerts();
  }

  /**
   * Runs every day at 9:45 AM to check for overdue PAT tests
   */
  @Cron('45 9 * * *')
  async checkPATTestOverdueAlerts() {
    this.logger.log('🔌 Checking for overdue PAT tests...');

    const emailStatus = this.emailService.getConfigurationStatus();
    if (!emailStatus.configured) {
      this.logger.warn(`⚠️  Skipping PAT alerts: ${emailStatus.message}`);
      return;
    }

    try {
      const today = new Date();

      const overdueAppliances = await (this.prisma.pATAppliance as any).findMany({
        where: {
          nextTestDue: { lt: today },
          tenant: { patTestingEnabled: true },
        },
        include: {
          site: { select: { name: true } },
          tenant: {
            include: {
              users: {
                where: { status: 'active', role: { in: ['admin', 'manager'] } },
              },
            },
          },
        },
      });

      this.logger.log(`🔌 Found ${overdueAppliances.length} overdue PAT appliance(s)`);

      let alertsSent = 0;

      for (const appliance of overdueAppliances) {
        const dueDate: Date = appliance.nextTestDue;
        const daysOverdue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

        if (![1, 3, 7].includes(daysOverdue)) continue;

        const users = appliance.tenant?.users ?? [];
        for (const user of users) {
          const sent = await this.emailService.sendPATTestOverdueAlert({
            siteName: appliance.site?.name ?? 'Unknown Site',
            applianceRef: appliance.applianceRef,
            description: appliance.description,
            location: appliance.location,
            daysOverdue,
            nextTestDue: dueDate,
            recipientEmail: user.email,
            recipientName: user.name,
            companyName: appliance.tenant.companyName,
          });
          if (sent) alertsSent++;

          try {
            await this.notificationsService.sendToUser(user.id, {
              title: `🔌 PAT Test Overdue`,
              body: `${appliance.applianceRef} — ${appliance.description} at ${appliance.site?.name ?? 'Unknown'} (${daysOverdue}d overdue)`,
              icon: '/icon-192x192.png',
              tag: `pat-overdue-${appliance.id}`,
            });
          } catch (err) {
            this.logger.warn(`Failed to send push to user ${user.id}: ${err.message}`);
          }
        }

        this.logger.log(`📧 PAT overdue alert sent for ${appliance.applianceRef} (${daysOverdue}d overdue)`);
      }

      this.logger.log(`✅ PAT test overdue check complete. Sent ${alertsSent} emails.`);
    } catch (error) {
      this.logger.error('❌ Error checking PAT test overdue alerts:', error);
    }
  }

  async triggerPATTestOverdueAlertsNow() {
    this.logger.log('🧪 Manually triggered PAT test overdue check');
    await this.checkPATTestOverdueAlerts();
  }

  /**
   * Runs every day at 10:00 AM to check for overdue emergency lighting tests
   */
  @Cron('0 10 * * *')
  async checkEmergencyLightingOverdueAlerts() {
    this.logger.log('💡 Checking for overdue emergency lighting tests...');

    const emailStatus = this.emailService.getConfigurationStatus();
    if (!emailStatus.configured) {
      this.logger.warn(`⚠️  Skipping emergency lighting alerts: ${emailStatus.message}`);
      return;
    }

    try {
      const today = new Date();

      const testTypes: { field: string; label: string }[] = [
        { field: 'nextMonthlyDue',     label: 'monthly' },
        { field: 'nextAnnualDue',      label: 'annual' },
        { field: 'nextThreeYearlyDue', label: 'three_yearly' },
      ];

      let alertsSent = 0;

      for (const { field, label } of testTypes) {
        const overdueLuminaires = await (this.prisma.emergencyLuminaire as any).findMany({
          where: {
            [field]: { lt: today },
            tenant: { emergencyLightingEnabled: true },
          },
          include: {
            site: { select: { name: true } },
            tenant: {
              include: {
                users: {
                  where: { status: 'active', role: { in: ['admin', 'manager'] } },
                },
              },
            },
          },
        });

        this.logger.log(`💡 [${label}] Found ${overdueLuminaires.length} overdue emergency luminaire(s)`);

        for (const luminaire of overdueLuminaires) {
          const dueDate: Date = luminaire[field];
          const daysOverdue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

          if (![1, 3, 7].includes(daysOverdue)) continue;

          const users = luminaire.tenant?.users ?? [];
          for (const user of users) {
            const sent = await this.emailService.sendEmergencyLightingOverdueAlert({
              siteName: luminaire.site?.name ?? 'Unknown Site',
              luminaireRef: luminaire.luminaireRef,
              description: luminaire.description,
              location: luminaire.location,
              testType: label,
              daysOverdue,
              overdueSince: dueDate,
              recipientEmail: user.email,
              recipientName: user.name,
              companyName: luminaire.tenant.companyName,
            });
            if (sent) alertsSent++;

            try {
              const testLabel = label === 'three_yearly' ? '3-Yearly' : label.charAt(0).toUpperCase() + label.slice(1);
              await this.notificationsService.sendToUser(user.id, {
                title: `💡 Emergency Lighting ${testLabel} Test Overdue`,
                body: `${luminaire.luminaireRef} — ${luminaire.description} at ${luminaire.site?.name ?? 'Unknown'} (${daysOverdue}d overdue)`,
                icon: '/icon-192x192.png',
                tag: `el-overdue-${luminaire.id}-${label}`,
              });
            } catch (err) {
              this.logger.warn(`Failed to send push to user ${user.id}: ${err.message}`);
            }
          }

          this.logger.log(`📧 EL ${label} overdue alert sent for ${luminaire.luminaireRef} (${daysOverdue}d overdue)`);
        }
      }

      this.logger.log(`✅ Emergency lighting overdue check complete. Sent ${alertsSent} emails.`);
    } catch (error) {
      this.logger.error('❌ Error checking emergency lighting overdue alerts:', error);
    }
  }

  async triggerEmergencyLightingOverdueAlertsNow() {
    this.logger.log('🧪 Manually triggered emergency lighting overdue check');
    await this.checkEmergencyLightingOverdueAlerts();
  }
}
