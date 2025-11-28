import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [react()],
  build: {
    // Disable module preload polyfill and optimize chunks
    modulePreload: false,
    // Force rebuild by using timestamp in manifest
    manifest: true,
    // Ensure no caching
    minify: 'esbuild',
  },
  server: {
    port: 5173,
    host: '0.0.0.0', // Listen on all network interfaces
    proxy: {
      // if your backend runs on 3000:
      // '/api': 'http://localhost:3000'
    }
  }
});

