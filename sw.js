const CACHE = 'spesen-v2';
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.hostname === 'cdnjs.cloudflare.com') {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }
  if (url.searchParams.has('url') || url.searchParams.has('text')) {
    event.respondWith(caches.match('./index.html').then(r => r || fetch(event.request)));
    return;
  }
  event.respondWith(
    fetch(event.request).then(response => {
      const clone = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, clone));
      return response;
    }).catch(() => caches.match(event.request))
  );
});
