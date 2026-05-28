const CACHE_NAME = `temperature-converter-v6`;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll([
      './',
      './index.html',
      './manifest.json',
      './JS/converter.js',
      './CSS/converter.css',
      './Img/icon512.png'
    ]);
  })());
});

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    } else {
        try {
          const fetchResponse = await fetch(event.request);
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        } catch (e) {
          console.log('Modo Offline activo para:', event.request.url);
        }
    }
  })());
});