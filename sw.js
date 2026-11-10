// Gestion APF : service worker. Version 0.32.
// Page : réseau d'abord (revalidée à chaque ouverture), copie gardée pour l'ouverture sans réseau. Icônes : copie gardée.
var CACHE = 'resident-activites-0.32';
var FICHIERS = ["manifest.webmanifest","icone-192.png","icone-512.png","icone-maskable-512.png","apple-touch-icon.png","favicon-32.png"];
function page() { return self.registration.scope; }
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FICHIERS.concat([page()]).map(function (f) { return new Request(f, { cache: 'reload' }); })); }).catch(function () { /* copie au prochain passage */ }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k.indexOf('resident-activites-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET') return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r.url, { cache: 'no-cache', credentials: 'same-origin' }).then(function (rep) {
      if (rep.ok) { var copie = rep.clone(); caches.open(CACHE).then(function (c) { return c.put(page(), copie); }); }
      return rep;
    }).catch(function () { return caches.match(page()).then(function (m) { return m || fetch(r); }); }));
    return;
  }
  if (r.url.indexOf(page()) !== 0) return;
  // Manifeste (nom de l'appli) : réseau d'abord, pour qu'un changement de nom arrive tout de suite.
  if (r.url.indexOf('manifest.webmanifest') >= 0) { e.respondWith(fetch(r, { cache: 'no-cache' }).catch(function () { return caches.match(r, { ignoreSearch: true }); })); return; }
  e.respondWith(caches.match(r).then(function (m) { return m || fetch(r); }));
});
