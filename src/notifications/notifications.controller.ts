import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TenantGuard } from '../auth/tenant.guard';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('notifications')
@UseGuards(TenantGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  // Get VAPID public key for frontend
  @Public()
  @Get('public-key')
  getPublicKey() {
    console.log('🔑 Controller: getPublicKey endpoint called');
    // Hardcoded temporarily to bypass caching issues
    return {
      publicKey: 'BOKJVJV5LimKLHRY1-fAV7YOAOAlE5ESQFqLrAAqYL579cl2EUXxJ7QdaFF0houss0vCUuXy99HeBttiGHNdmtE'
    };
  }

  // Subscribe to push notifications
  @Post('subscribe')
  async subscribe(
    @CurrentUser() user: CurrentUserData,
    @Body() body: {
      subscription: {
        endpoint: string;
        keys: {
          p256dh: string;
          auth: string;
        };
      };
      deviceName?: string;
    }
  ) {
    const result = await this.notificationsService.subscribe(
      user.id,
      user.tenantId,
      body.subscription,
      body.deviceName
    );

    return {
      success: true,
      message: 'Successfully subscribed to push notifications',
      subscription: result
    };
  }

  // Unsubscribe from push notifications
  @Delete('subscribe')
  async unsubscribe(@Body() body: { endpoint: string }) {
    await this.notificationsService.unsubscribe(body.endpoint);
    return {
      success: true,
      message: 'Successfully unsubscribed from push notifications'
    };
  }

  // Get user's subscriptions
  @Get('subscriptions')
  async getSubscriptions(@CurrentUser() user: CurrentUserData) {
    const subscriptions = await this.notificationsService.getUserSubscriptions(user.id);
    return {
      subscriptions: subscriptions.map(sub => ({
        id: sub.id,
        deviceName: sub.deviceName,
        createdAt: sub.createdAt,
        lastUsed: sub.lastUsed,
      }))
    };
  }

  // Send test notification
  @Post('test')
  async sendTest(@CurrentUser() user: CurrentUserData) {
    const result = await this.notificationsService.sendTestNotification(user.id);
    return {
      success: true,
      message: 'Test notification sent',
      ...result
    };
  }

  // Send custom notification (admin only)
  @Post('send')
  async sendNotification(
    @CurrentUser() user: CurrentUserData,
    @Body() body: {
      title: string;
      body: string;
      icon?: string;
      badge?: string;
      data?: any;
      tag?: string;
      requireInteraction?: boolean;
    }
  ) {
    const result = await this.notificationsService.sendToUser(user.id, body);
    return {
      success: true,
      message: 'Notification sent',
      ...result
    };
  }
}
