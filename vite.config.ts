import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-icon.svg'],
      manifest: {
        name: 'Architrack 2.0',
        short_name: 'Architrack',
        description: 'Control de horas y gestión de proyectos para arquitectos.',
        theme_color: '#0f172a',
        background_color: '#020617',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
            {
                src: 'pwa-icon.svg',
                sizes: '192x192 512x512',
                type: 'image/svg+xml',
                purpose: 'any maskable'
            },
            {
                src: "windows11/SmallTile.scale-100.png",
                sizes: "71x71",
                type: "image/png"
            },
            {
                src: "windows11/SmallTile.scale-125.png",
                sizes: "89x89",
                type: "image/png"
            },
            {
                src: "windows11/SmallTile.scale-150.png",
                sizes: "107x107",
                type: "image/png"
            },
            {
                src: "windows11/SmallTile.scale-200.png",
                sizes: "142x142",
                type: "image/png"
            },
            {
                src: "windows11/SmallTile.scale-400.png",
                sizes: "284x284",
                type: "image/png"
            },
            {
                src: "windows11/Square150x150Logo.scale-100.png",
                sizes: "150x150",
                type: "image/png"
            },
            {
                src: "windows11/Square150x150Logo.scale-125.png",
                sizes: "188x188",
                type: "image/png"
            },
            {
                src: "windows11/Square150x150Logo.scale-150.png",
                sizes: "225x225",
                type: "image/png"
            },
            {
                src: "windows11/Square150x150Logo.scale-200.png",
                sizes: "300x300",
                type: "image/png"
            },
            {
                src: "windows11/Square150x150Logo.scale-400.png",
                sizes: "600x600",
                type: "image/png"
            },
            {
                src: "windows11/Wide310x150Logo.scale-100.png",
                sizes: "310x150",
                type: "image/png"
            },
            {
                src: "windows11/Wide310x150Logo.scale-125.png",
                sizes: "388x188",
                type: "image/png"
            },
            {
                src: "windows11/Wide310x150Logo.scale-150.png",
                sizes: "465x225",
                type: "image/png"
            },
            {
                src: "windows11/Wide310x150Logo.scale-200.png",
                sizes: "620x300",
                type: "image/png"
            },
            {
                src: "windows11/Wide310x150Logo.scale-400.png",
                sizes: "1240x600",
                type: "image/png"
            },
            {
                src: "windows11/LargeTile.scale-100.png",
                sizes: "310x310",
                type: "image/png"
            },
            {
                src: "windows11/LargeTile.scale-125.png",
                sizes: "388x388",
                type: "image/png"
            },
            {
                src: "windows11/LargeTile.scale-150.png",
                sizes: "465x465",
                type: "image/png"
            },
            {
                src: "windows11/LargeTile.scale-200.png",
                sizes: "620x620",
                type: "image/png"
            },
            {
                src: "windows11/LargeTile.scale-400.png",
                sizes: "1240x1240",
                type: "image/png"
            },
            {
                src: "windows11/Square44x44Logo.scale-100.png",
                sizes: "44x44",
                type: "image/png"
            },
            {
                src: "windows11/Square44x44Logo.scale-125.png",
                sizes: "55x55",
                type: "image/png"
            },
            {
                src: "windows11/Square44x44Logo.scale-150.png",
                sizes: "66x66",
                type: "image/png"
            },
            {
                src: "windows11/Square44x44Logo.scale-200.png",
                sizes: "88x88",
                type: "image/png"
            },
            {
                src: "windows11/Square44x44Logo.scale-400.png",
                sizes: "176x176",
                type: "image/png"
            },
            {
                src: "windows11/StoreLogo.scale-100.png",
                sizes: "50x50",
                type: "image/png"
            },
            {
                src: "windows11/StoreLogo.scale-125.png",
                sizes: "63x63",
                type: "image/png"
            },
            {
                src: "windows11/StoreLogo.scale-150.png",
                sizes: "75x75",
                type: "image/png"
            },
            {
                src: "windows11/StoreLogo.scale-200.png",
                sizes: "100x100",
                type: "image/png"
            },
            {
                src: "windows11/StoreLogo.scale-400.png",
                sizes: "200x200",
                type: "image/png"
            },
            {
                src: "windows11/SplashScreen.scale-100.png",
                sizes: "620x300",
                type: "image/png"
            },
            {
                src: "windows11/SplashScreen.scale-125.png",
                sizes: "775x375",
                type: "image/png"
            },
            {
                src: "windows11/SplashScreen.scale-150.png",
                sizes: "930x450",
                type: "image/png"
            },
            {
                src: "windows11/SplashScreen.scale-200.png",
                sizes: "1240x600",
                type: "image/png"
            },
            {
                src: "windows11/SplashScreen.scale-400.png",
                sizes: "2480x1200",
                type: "image/png"
            },
            {
                src: "android/android-launchericon-512-512.png",
                sizes: "512x512",
                type: "image/png"
            },
            {
                src: "android/android-launchericon-192-192.png",
                sizes: "192x192",
                type: "image/png"
            },
            {
                src: "android/android-launchericon-144-144.png",
                sizes: "144x144",
                type: "image/png"
            },
            {
                src: "android/android-launchericon-96-96.png",
                sizes: "96x96",
                type: "image/png"
            },
            {
                src: "android/android-launchericon-72-72.png",
                sizes: "72x72",
                type: "image/png"
            },
            {
                src: "android/android-launchericon-48-48.png",
                sizes: "48x48",
                type: "image/png"
            },
            {
                src: "ios/16.png",
                sizes: "16x16",
                type: "image/png"
            },
            {
                src: "ios/20.png",
                sizes: "20x20",
                type: "image/png"
            },
            {
                src: "ios/29.png",
                sizes: "29x29",
                type: "image/png"
            },
            {
                src: "ios/32.png",
                sizes: "32x32",
                type: "image/png"
            },
            {
                src: "ios/40.png",
                sizes: "40x40",
                type: "image/png"
            },
            {
                src: "ios/50.png",
                sizes: "50x50",
                type: "image/png"
            },
            {
                src: "ios/57.png",
                sizes: "57x57",
                type: "image/png"
            },
            {
                src: "ios/58.png",
                sizes: "58x58",
                type: "image/png"
            },
            {
                src: "ios/60.png",
                sizes: "60x60",
                type: "image/png"
            },
            {
                src: "ios/64.png",
                sizes: "64x64",
                type: "image/png"
            },
            {
                src: "ios/72.png",
                sizes: "72x72",
                type: "image/png"
            },
            {
                src: "ios/76.png",
                sizes: "76x76",
                type: "image/png"
            },
            {
                src: "ios/80.png",
                sizes: "80x80",
                type: "image/png"
            },
            {
                src: "ios/87.png",
                sizes: "87x87",
                type: "image/png"
            },
            {
                src: "ios/100.png",
                sizes: "100x100",
                type: "image/png"
            },
            {
                src: "ios/114.png",
                sizes: "114x114",
                type: "image/png"
            },
            {
                src: "ios/120.png",
                sizes: "120x120",
                type: "image/png"
            },
            {
                src: "ios/128.png",
                sizes: "128x128",
                type: "image/png"
            },
            {
                src: "ios/144.png",
                sizes: "144x144",
                type: "image/png"
            },
            {
                src: "ios/152.png",
                sizes: "152x152",
                type: "image/png"
            },
            {
                src: "ios/167.png",
                sizes: "167x167",
                type: "image/png"
            },
            {
                src: "ios/180.png",
                sizes: "180x180",
                type: "image/png"
            },
            {
                src: "ios/192.png",
                sizes: "192x192",
                type: "image/png"
            },
            {
                src: "ios/256.png",
                sizes: "256x256",
                type: "image/png"
            },
            {
                src: "ios/512.png",
                sizes: "512x512",
                type: "image/png"
            },
            {
                src: "ios/1024.png",
                sizes: "1024x1024",
                type: "image/png"
            }
        ]
      },
      workbox: {
        // Importante: Cachear el CDN de Tailwind para que la UI funcione offline
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.tailwindcss\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tailwind-cdn',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 año
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cachear fuentes de Google si se usaran
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 año
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});