// Resident Activités : service worker minimal, sans cache. Version 0.19.
// À chaque ouverture, la page est redemandée à GitHub (revalidation) : une nouvelle version arrive tout de suite.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  if (e.request.mode !== 'navigate') return;
  e.respondWith(fetch(e.request.url, { cache: 'no-cache', credentials: 'same-origin' }).catch(function () { return fetch(e.request); }));
});
