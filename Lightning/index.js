// AHH! JS
const CACHE_NAME = 'lightning-cache-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/Stellar/index.html',
  '/Stellar/bucket.json',
  '/404.html',
  'https://unpkg.com/_assets/styles-LG6W3OHZ.css',
  'https://unpkg.com/_assets/code-light-B2LHUSJR.css',
  '/favicon.jpg'
];
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching assets');
        return cache.addAll(ASSETS);
      })
      .catch((err) => {
        console.error('Cache installation failed:', err);
      })
  );
});
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache));
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then((cachedResponse) => cachedResponse || new Response('Offline'));
      })
  );
});
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
