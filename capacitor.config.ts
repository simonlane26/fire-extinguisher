import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.firexcheck.app',
  appName: 'FireXcheck',
  webDir: 'frontend/dist',
  // Load UI from Railway - offline features still work via native plugins
  server: {
    url: 'https://fire-extinguisher-production.up.railway.app',
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#ef4444'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#ef4444',
      showSpinner: false,
      splashImmersive: true,
      splashFullScreen: true,
    },
    Camera: {
      // For QR scanning and photo uploads
      permissions: ['camera', 'photos']
    },
    Filesystem: {
      // For offline photo storage
    },
    Network: {
      // To detect online/offline status
    }
  }
};

export default config;
