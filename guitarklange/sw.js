const CACHE = 'musikpakke-1gyaujh';
const SKAL = ['./','index.html','manifest.json','ikon-192.png','ikon-512.png','data/playlists.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SKAL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(svar => svar || fetch(e.request).then(net => {
      if (net && net.status === 200 && net.type === 'basic') {
        const kopi = net.clone();
        caches.open(CACHE).then(c => c.put(e.request, kopi));
      }
      return net;
    }).catch(() => new Response('', {status:503})))
  );
});