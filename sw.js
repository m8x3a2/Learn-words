// WordVault service worker: the site opens without internet and can be installed to the home screen.
// This is a template: the build (serviceWorker plugin in vite.config.js) fills in the two constants
// below with a hash and the list of built files, and writes the result to dist/sw.js.
const VERSION = "2a07ae6173dd";
const PRECACHE = ["./assets/index-BHfKv4ol.js","./assets/index-VY8_1eFh.css","./assets/jszip.min-9819smHi.js","./icons/favicon-64.png","./icons/icon-192.png","./icons/icon-512.png","./icons/maskable-512.png","./index.html","./manifest.webmanifest"];
const CACHE = `wordvault-${VERSION}`;

// No skipWaiting: an open old page keeps its cached files (e.g. the lazy JSZip chunk) until it is closed
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE.map(url => new Request(url, { cache: 'reload' })))),
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key.startsWith('wordvault-') && key !== CACHE).map(key => caches.delete(key)),
    )),
  );
});

// Pages: network first, so a new deploy shows up right away; the cached page works offline.
// Built files have hashed names and never change: cache first.
// Other sites (GitHub API for sync) are not touched.
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
