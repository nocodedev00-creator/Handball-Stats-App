// Incrémentez le numéro (v2, v3, etc.) à chaque modification du code.
const CACHE_NAME = 'stathand-cache-v2'; 

// La liste est courte car tout est dans index.html
const urlsToCache = [
  './',             // La racine de l'application
  'index.html',     // Contient tout le CSS et le JS
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  // Si vous avez d'autres images ou polices non intégrées, ajoutez-les ici.
  // Sinon, cette liste est suffisante.
];

// Événement 1: INSTALLATION (Mise en cache)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache ouvert, ajout des ressources.');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Échec de la mise en cache lors de l\'installation:', error);
      })
  );
  self.skipWaiting();
});

// Événement 2: RÉCUPÉRATION (Cache en premier)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Événement 3: ACTIVATION (Nettoyage des anciens caches)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
