import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
  "name": "쏠쏠한 팝업",
  "short_name": "SOL POP",
  "description": "쏠쏠한 팝업스토어 플랫폼을 즐겨보세요.",
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/",
  "icons": [
    {
      "src": "logo308.png",  // 아이콘 경로 설정
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "logo308.png",  // 동일 파일을 다른 크기로 사용
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshot1.png",
      "sizes": "540x720",
      "type": "image/png"
    }
  ]
}

    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    open: true,
  },
});
