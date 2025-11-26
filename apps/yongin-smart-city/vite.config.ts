import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import cesium from 'vite-plugin-cesium'; 

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: process.env.VITE_BASE_URL || env.VITE_BASE_URL || '/',
    plugins: [
      react(),
      tailwindcss(),
      cesium(),
    ],
    server: {
      port: 3000,
      open: true,
    },
  };
});
