const CACHE_NAME = 'ombundu-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192x192.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Cache aberto');
        return cache.addAll(ASSETS);
      })
      .catch((error) => {
        console.error('[Service Worker] Falha no cache:', error);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Retorna resposta em cache ou faz nova requisição
        return cachedResponse || fetch(event.request)
          .then((response) => {
            // Atualiza cache com nova resposta
            return caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, response.clone());
                return response;
              });
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[Service Worker] Removendo cache antigo:', name);
            return caches.delete(name);
          })
      );
    })
  );
});
