// Resident Activités : service worker minimal, sans cache (les données viennent toujours du service).
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function () { /* réseau seulement */ });
