/* Service worker de Lucía: guarda la app para usarla SIN CONEXIÓN.
   Estrategia: precache de los archivos de la app; "red primero" para index.html
   (así llegan las actualizaciones) con respaldo en caché si no hay internet.
   No hace ninguna petición a terceros. Cambia VERSION al publicar cambios. */
const VERSION = 'lucia-v2.0.0';
const ARCHIVOS = ['./', './index.html', './manifest.webmanifest', './icons/icono.svg',
  './icons/icono-192.png', './icons/icono-512.png', './icons/icono-maskable-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  const esPagina = req.mode === 'navigate' || req.url.endsWith('/index.html') || req.url.endsWith('/');
  if (esPagina) {
    e.respondWith(fetch(req).then((r) => { const copia = r.clone(); caches.open(VERSION).then((c) => c.put('./index.html', copia)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then((r) => r || fetch(req)));
});
