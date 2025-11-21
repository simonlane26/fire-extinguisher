import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as webpush from 'web-push';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private prisma: PrismaService) {
    // Configure web-push with VAPID keys
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
    const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:noreply@example.com';

    if (!vapidPublicKey || !vapidPrivateKey) {
      this.logger.warn('⚠️  VAPID keys not configured. Push notifications will not work.');
      return;
    }

    try {
      webpush.setVapidDetails(
        vapidSubject,
        vapidPublicKey,
        vapidPrivateKey
      );
      this.logger.log('✅ Push notifications configured');
    } catch (error) {
      this.logger.warn(`⚠️  Failed to configure VAPID: ${error.message}. Push notifications will not work.`);
    }
  }

  // ===== SUBSCRIPTION MANAGEMENT =====

  async subscribe(userId: string, tenantId: string, subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  }, deviceName?: string) {
    try {
      // Check if subscription already exists
      const existing = await this.prisma.pushSubscription.findUnique({
        where: { endpoint: subscription.endpoint }
      });

      if (existing) {
        // Update last used timestamp
        return this.prisma.pushSubscription.update({
          where: { endpoint: subscription.endpoint },
          data: { lastUsed: new Date() }
        });
      }

      // Create new subscription
      return this.prisma.pushSubscription.create({
        data: {
          userId,
          tenantId,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          deviceName,
        }
      });
    } catch (error) {
      this.logger.error(`Failed to save subscription: ${error.message}`);
      throw error;
    }
  }

  async unsubscribe(endpoint: string) {
    try {
      await this.prisma.pushSubscription.delete({
        where: { endpoint }
      });
      this.logger.log(`Unsubscribed: ${endpoint}`);
    } catch (error) {
      this.logger.error(`Failed to unsubscribe: ${error.message}`);
      throw error;
    }
  }

  async getUserSubscriptions(userId: string) {
    return this.prisma.pushSubscription.findMany({
      where: { userId },
      orderBy: { lastUsed: 'desc' }
    });
  }

  async getTenantSubscriptions(tenantId: string) {
    return this.prisma.pushSubscription.findMany({
      where: { tenantId }
    });
  }

  // ===== SEND NOTIFICATIONS =====

  async sendToUser(userId: string, notification: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    data?: any;
    tag?: string;
    requireInteraction?: boolean;
  }) {
    const subscriptions = await this.getUserSubscriptions(userId);

    if (subscriptions.length === 0) {
      this.logger.warn(`No subscriptions found for user ${userId}`);
      return { sent: 0, failed: 0 };
    }

    return this.sendNotifications(subscriptions, notification);
  }

  async sendToTenant(tenantId: string, notification: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    data?: any;
    tag?: string;
    requireInteraction?: boolean;
  }) {
    const subscriptions = await this.getTenantSubscriptions(tenantId);

    if (subscriptions.length === 0) {
      this.logger.warn(`No subscriptions found for tenant ${tenantId}`);
      return { sent: 0, failed: 0 };
    }

    return this.sendNotifications(subscriptions, notification);
  }

  private async sendNotifications(subscriptions: any[], notification: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    data?: any;
    tag?: string;
    requireInteraction?: boolean;
  }) {
    const payload = JSON.stringify({
      title: notification.title,
      body: notification.body,
      icon: notification.icon || '/icon-192x192.png',
      badge: notification.badge || '/badge-72x72.png',
      data: notification.data || {},
      tag: notification.tag,
      requireInteraction: notification.requireInteraction || false,
    });

    let sent = 0;
    let failed = 0;

    const sendPromises = subscriptions.map(async (sub) => {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          }
        };

        await webpush.sendNotification(pushSubscription, payload);

        // Update last used timestamp
        await this.prisma.pushSubscription.update({
          where: { id: sub.id },
          data: { lastUsed: new Date() }
        });

        sent++;
        this.logger.log(`✅ Notification sent to ${sub.endpoint.substring(0, 50)}...`);
      } catch (error) {
        failed++;

        // If subscription is no longer valid (410 Gone), delete it
        if (error.statusCode === 410) {
          this.logger.warn(`Subscription expired, removing: ${sub.endpoint}`);
          await this.prisma.pushSubscription.delete({
            where: { id: sub.id }
          });
        } else {
          this.logger.error(`Failed to send notification: ${error.message}`);
        }
      }
    });

    await Promise.all(sendPromises);

    this.logger.log(`📊 Notifications: ${sent} sent, ${failed} failed`);
    return { sent, failed };
  }

  // ===== SPECIFIC NOTIFICATION TYPES =====

  async sendInspectionReminder(userId: string, extinguisher: {
    id: string;
    location: string;
    building: string;
    nextInspection: Date;
  }) {
    const daysUntil = Math.ceil(
      (extinguisher.nextInspection.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    return this.sendToUser(userId, {
      title: '🔥 Inspection Reminder',
      body: `${extinguisher.building} - ${extinguisher.location} inspection due in ${daysUntil} days`,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      data: {
        type: 'inspection_reminder',
        extinguisherId: extinguisher.id,
        url: `/extinguishers/${extinguisher.id}`
      },
      tag: `inspection-${extinguisher.id}`,
      requireInteraction: true,
    });
  }

  async sendMaintenanceAlert(userId: string, extinguisher: {
    id: string;
    location: string;
    building: string;
    nextMaintenance: Date;
  }) {
    const daysUntil = Math.ceil(
      (extinguisher.nextMaintenance.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    return this.sendToUser(userId, {
      title: '🔧 Maintenance Due',
      body: `${extinguisher.building} - ${extinguisher.location} maintenance due in ${daysUntil} days`,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      data: {
        type: 'maintenance_alert',
        extinguisherId: extinguisher.id,
        url: `/extinguishers/${extinguisher.id}`
      },
      tag: `maintenance-${extinguisher.id}`,
      requireInteraction: true,
    });
  }

  async sendLowStockAlert(tenantId: string, item: {
    partName: string;
    quantityInStock: number;
    minStockLevel: number;
  }) {
    return this.sendToTenant(tenantId, {
      title: '📦 Low Stock Alert',
      body: `${item.partName}: ${item.quantityInStock} units remaining (min: ${item.minStockLevel})`,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      data: {
        type: 'low_stock_alert',
        partName: item.partName,
        url: '/inventory'
      },
      tag: 'low-stock',
      requireInteraction: false,
    });
  }

  async sendSubscriptionAlert(userId: string, message: string, type: 'warning' | 'error' | 'info') {
    const icons = {
      warning: '⚠️',
      error: '❌',
      info: 'ℹ️'
    };

    return this.sendToUser(userId, {
      title: `${icons[type]} Subscription Alert`,
      body: message,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      data: {
        type: 'subscription_alert',
        url: '/billing'
      },
      tag: 'subscription',
      requireInteraction: type !== 'info',
    });
  }

  // ===== TESTING =====

  async sendTestNotification(userId: string) {
    return this.sendToUser(userId, {
      title: '🔔 Test Notification',
      body: 'Push notifications are working correctly!',
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      data: {
        type: 'test',
        timestamp: new Date().toISOString()
      },
      tag: 'test',
      requireInteraction: false,
    });
  }

  // Get public VAPID key for frontend
  getPublicKey(): string {
    return process.env.VAPID_PUBLIC_KEY || '';
  }
}
