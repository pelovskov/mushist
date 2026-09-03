// Genereret af PWA · Bygger - 31.8.2026, 18.28.30
// Cache-navnet er nyt hver gang, så gamle udgaver ryddes automatisk væk hos brugerne.
const CACHE_NAME = 'guit-v202608311628';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './guitar-1.html',
  './guitar-2.html',
  './guitar-3.html',
  './guitar-4.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => key !== CACHE_NAME ? caches.delete(key) : null)
    ))
  );
  self.clients.claim();
});

// Cache-first med runtime caching
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const kopi = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, kopi));
        return networkResponse;
      }).catch(() => caches.match('./index.html'));
    })
  );
});