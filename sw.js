const CACHE_VERSION = 'spesen-v4';
const CACHE_STATIC = CACHE_VERSION + '-static';
const CACHE_CDN = CACHE_VERSION + '-cdn';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './icon-192.png',
  './icon-512.png'
];

const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_STATIC).then(cache =>
        cache.addAll(STATIC_ASSETS)
      ),
      caches.open(CACHE_CDN).then(cache =>
        Promise.allSettled(
          CDN_ASSETS.map(url =>
            fetch(url, { cache: 'no-cache' })
              .then(res => {
                if (res.ok) cache.put(url, res);
              })
              .catch(() => {
                console.warn('[SW] CDN nicht erreichbar:', url);
              })
          )
        )
      )
    ])
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  const validCaches = [CACHE_STATIC, CACHE_CDN];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => !validCaches.includes(k))
          .map(k => {
            console.log('[SW] Alter Cache gelöscht:', k);
            return caches.delete(k);
          })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  if (url.searchParams.has('url') || url.searchParams.has('text')) {
    event.respondWith(
      caches.match('./index.html')
        .then(r => r || fetch('./index.html'))
    );
    return;
  }

  if (url.hostname === 'cdnjs.cloudflare.com') {
    event.respondWith(
      caches.open(CACHE_CDN).then(async cache => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok) cache.put(request, response.clone());
          return response;
        } catch {
          return new Response(
            '// CDN-Library offline nicht verfügbar',
            { headers: { 'Content-Type': 'application/javascript' } }
          );
        }
      })
    );
    return;
  }

  if (url.hostname !== self.location.hostname &&
      url.hostname !== 'localhost') {
    event.respondWith(
      fetch(request).catch(() =>
        new Response('', { status: 503, statusText: 'Offline' })
      )
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE_STATIC).then(async cache => {
      const cached = await cache.match(request);
      const fetchPromise = fetch(request)
        .then(response => {
          if (response.ok && response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => null);

      if (cached) {
        event.waitUntil(fetchPromise);
        return cached;
      }

      const response = await fetchPromise;
      if (response) return response;
      return cache.match('./index.html');
    })
  );
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data?.type === 'GET_CACHE_INFO') {
    caches.keys().then(keys => {
      event.ports[0].postMessage({ caches: keys });
    });
  }
});
