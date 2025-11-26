const CACHE_NAME = 'architrack-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Strategy: Cache First for CDNs (Tailwind, Picsum)
  if (url.hostname === 'cdn.tailwindcss.com' || url.hostname === 'picsum.photos') {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        });
      })
    );
    return;
  }

  // Strategy: Stale While Revalidate for App Shell
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
                 const responseToCache = networkResponse.clone();
                 caches.open(CACHE_NAME).then((cache) => {
                     cache.put(event.request, responseToCache);
                 });
            }
            return networkResponse;
        }).catch(() => {
             // Offline fallback if needed
        });
        return cachedResponse || fetchPromise;
      })
    );
  }
});