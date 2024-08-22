import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
  //   VitePWA({
  //     registerType: 'autoUpdate',
  //     includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
  //     manifest: {
  //       name: 'My Vite PWA App',
  //       short_name: 'VitePWA',
  //       description: 'A PWA built with Vite and React',
  //       theme_color: '#ffffff',
  //       icons: [
  //         {
  //           src: 'pwa-192x192.png',
  //           sizes: '192x192',
  //           type: 'image/png'
  //         },
  //         {
  //           src: 'pwa-512x512.png',
  //           sizes: '512x512',
  //           type: 'image/png'
  //         }
  //       ]
  //     }
  //   })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

});
