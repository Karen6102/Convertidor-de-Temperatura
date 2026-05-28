const CACHE_NAME = `temperature-converter-v3`;
    
// Usamos el evento install para guardar en caché los recursos con sus NUEVAS rutas
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll([
      '../',                 // Raíz del proyecto (index.html)
      '../index.html',
      '../manifest.json',
      './converter.js',      // Está en la misma carpeta JS que este sw.js
      '../CSS/converter.css', // Sube un nivel y entra a CSS
      '../Img/icon512.png'   // Sube un nivel y entra a Img
    ]);
  })());
});

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    // Intentar buscar el recurso en la caché
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    } else {
        try {
          // Si no está en caché, lo busca en internet
          const fetchResponse = await fetch(event.request);
    
          // Guarda una copia limpia en la caché y la devuelve
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        } catch (e) {
          // El internet falló y el recurso no estaba en caché
          console.log('Recurso no encontrado en red ni en caché:', event.request.url);
        }
    }
  })());
});