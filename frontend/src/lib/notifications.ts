// Push Notifications Service for Frontend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

class NotificationService {
  private swRegistration: ServiceWorkerRegistration | null = null;
  private publicKey: string | null = null;

  /**
   * Initialize push notifications
   * - Registers service worker
   * - Requests notification permission
   * - Gets VAPID public key from backend
   */
  async initialize(): Promise<boolean> {
    try {
      // Check if service workers are supported
      if (!('serviceWorker' in navigator)) {
        console.warn('Service workers are not supported');
        return false;
      }

      // Check if push notifications are supported
      if (!('PushManager' in window)) {
        console.warn('Push notifications are not supported');
        return false;
      }

      // Register service worker
      this.swRegistration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('✅ Service Worker registered:', this.swRegistration);

      // Get VAPID public key from backend
      await this.fetchPublicKey();

      return true;
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
      return false;
    }
  }

  /**
   * Fetch VAPID public key from backend
   */
  private async fetchPublicKey(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/notifications/public-key`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch public key');
      }

      const data = await response.json();
      this.publicKey = data.publicKey;
      console.log('✅ VAPID public key fetched');
    } catch (error) {
      console.error('Failed to fetch public key:', error);
      throw error;
    }
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Notifications are not supported');
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    return permission;
  }

  /**
   * Check if notifications are currently supported and permitted
   */
  isSupported(): boolean {
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }

  /**
   * Get current notification permission status
   */
  getPermissionStatus(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe(deviceName?: string): Promise<boolean> {
    try {
      if (!this.swRegistration) {
        await this.initialize();
      }

      if (!this.swRegistration) {
        throw new Error('Service worker not registered');
      }

      if (!this.publicKey) {
        throw new Error('VAPID public key not available');
      }

      // Request permission if not already granted
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission not granted');
        return false;
      }

      // Subscribe to push notifications
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.publicKey),
      });

      console.log('✅ Push subscription created:', subscription);

      // Send subscription to backend
      await this.sendSubscriptionToBackend(subscription, deviceName);

      return true;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return false;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    try {
      if (!this.swRegistration) {
        return false;
      }

      const subscription = await this.swRegistration.pushManager.getSubscription();

      if (!subscription) {
        console.log('No active subscription found');
        return true;
      }

      // Unsubscribe from push manager
      const success = await subscription.unsubscribe();

      if (success) {
        // Remove from backend
        await this.removeSubscriptionFromBackend(subscription.endpoint);
        console.log('✅ Unsubscribed from push notifications');
      }

      return success;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  /**
   * Check if user is currently subscribed
   */
  async isSubscribed(): Promise<boolean> {
    try {
      if (!this.swRegistration) {
        await this.initialize();
      }

      if (!this.swRegistration) {
        return false;
      }

      const subscription = await this.swRegistration.pushManager.getSubscription();
      return subscription !== null;
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      return false;
    }
  }

  /**
   * Get current subscription
   */
  async getSubscription(): Promise<PushSubscription | null> {
    try {
      if (!this.swRegistration) {
        await this.initialize();
      }

      if (!this.swRegistration) {
        return null;
      }

      return await this.swRegistration.pushManager.getSubscription();
    } catch (error) {
      console.error('Failed to get subscription:', error);
      return null;
    }
  }

  /**
   * Send test notification
   */
  async sendTestNotification(): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/notifications/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to send test notification');
      }

      const data = await response.json();
      console.log('✅ Test notification sent:', data);
      return true;
    } catch (error) {
      console.error('Failed to send test notification:', error);
      return false;
    }
  }

  /**
   * Send subscription to backend
   */
  private async sendSubscriptionToBackend(
    subscription: PushSubscription,
    deviceName?: string
  ): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const subscriptionData = subscription.toJSON();

      const response = await fetch(`${API_BASE_URL}/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subscription: subscriptionData,
          deviceName: deviceName || this.getDeviceName(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save subscription to backend');
      }

      console.log('✅ Subscription saved to backend');
    } catch (error) {
      console.error('Failed to send subscription to backend:', error);
      throw error;
    }
  }

  /**
   * Remove subscription from backend
   */
  private async removeSubscriptionFromBackend(endpoint: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/notifications/subscribe`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ endpoint }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove subscription from backend');
      }

      console.log('✅ Subscription removed from backend');
    } catch (error) {
      console.error('Failed to remove subscription from backend:', error);
      throw error;
    }
  }

  /**
   * Convert VAPID public key to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  /**
   * Get device/browser name for identification
   */
  private getDeviceName(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown Browser';
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
