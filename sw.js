const CACHE = 'sbb-tracker-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Install: cache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network first, cache fallback
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Don't cache CDN scripts (xlsx, jszip) — always fetch from network
  if (url.hostname === 'cdnjs.cloudflare.com') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // For share target requests (with ?url= or ?text= params), serve the app
  if (url.searchParams.has('url') || url.searchParams.has('text')) {
    event.respondWith(
      caches.match('./index.html').then(r => r || fetch(event.request))
    );
    return;
  }

  // App shell: network first, cache fallback
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
