import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import cesium from 'vite-plugin-cesium';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: process.env.VITE_BASE_URL || env.VITE_BASE_URL || '/',
    plugins: [
      react(),
      tailwindcss(),
      cesium(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      allowedHosts: ['dev.pluxity.com', '.pluxity.com'],
      host: '0.0.0.0',
      port: 3000,
      open: true,
    },
  };
});
