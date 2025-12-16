import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname),
  base: '/',
  plugins: [react()],
  publicDir: 'public', // Copy public folder contents to dist during build
  build: {
    // Ensure proper source maps and no aggressive tree-shaking
    sourcemap: false,
    minify: 'esbuild',
    // Force clean build
    emptyOutDir: true,
    outDir: 'dist',
    assetsDir: 'assets', // Put all hashed assets in /assets/ folder
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

