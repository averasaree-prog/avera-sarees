import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import crypto from 'node:crypto';

// Polyfill webcrypto for Node 16 environments
if (!globalThis.crypto) {
  globalThis.crypto = crypto.webcrypto;
}
if (!globalThis.crypto?.getRandomValues) {
  globalThis.crypto = {
    ...globalThis.crypto,
    getRandomValues: (arr) => crypto.randomFillSync(arr),
  };
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
