import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // if your backend runs on 3000:
      // '/api': 'http://localhost:3000'
    }
  }
});

