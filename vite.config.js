import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
      '/assets': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
      '/fonts': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
      '/outputs': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  }
});
