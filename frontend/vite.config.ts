import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [react()],
  build: {
    // Ensure proper source maps and no aggressive tree-shaking
    sourcemap: false,
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

