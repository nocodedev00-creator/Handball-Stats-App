const CACHE_NAME = 'handball-stats-cache-v1';
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  // Ajoutez ici toutes les feuilles de style (CSS), les scripts (JS) et les images critiques
  'votre-style.css', 
  'votre-script.js', 
  // N'oubliez pas toutes les autres ressources essentielles !
];

// Événement 1: INSTALL - Mise en cache des ressources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache ouvert, ajout des ressources.');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Force le Service Worker à s'activer immédiatement
});

// Événement 2: FETCH - Interception des requêtes et service du cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si la ressource est dans le cache, on la sert immédiatement
        if (response) {
          return response;
        }
        // Sinon, on va la chercher sur le réseau
        return fetch(event.request);
      })
  );
});

// Événement 3: ACTIVATE - Nettoyage des vieux caches (important pour les mises à jour)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Supprime tous les caches qui ne sont pas dans la liste blanche
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
