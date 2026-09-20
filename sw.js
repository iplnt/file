const CACHE_NAME = 'interplanet-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Instalar el Service Worker y almacenar recursos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activar el Service Worker y limpiar cachés viejas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar peticiones para que la app cargue (aunque sea la cáscara) sin red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el recurso de la caché si lo encuentra
        if (response) {
          return response;
        }
        // De lo contrario, lo busca en la red
        return fetch(event.request);
      })
  );
});
