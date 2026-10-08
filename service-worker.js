/* ============================================================
   UNP TOURS — SERVICE WORKER (PWA)
   ============================================================ */

const CACHE_NAME = 'unp-tours-v1';

const URLS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './assets/logo.png',
    './css/root.css',
    './css/buttons.css',
    './css/cards.css',
    './css/forms.css',
    './css/animations.css',
    './css/style.css',
    './css/responsive.css'
];

/* INSTALL */
self.addEventListener('install', function (event) {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(URLS_TO_CACHE);
            })
            .then(function () {
                return self.skipWaiting();
            })
    );
});

/* ACTIVATE */
self.addEventListener('activate', function (event) {
    console.log('[SW] Activating...');
    event.waitUntil(
        caches.keys()
            .then(function (cacheNames) {
                return Promise.all(
                    cacheNames.map(function (cacheName) {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(function () {
                return self.clients.claim();
            })
    );
});

/* FETCH */
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) return response;

                return fetch(event.request)
                    .then(function (networkResponse) {
                        if (!networkResponse ||
                            networkResponse.status !== 200 ||
                            networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    });
            })
    );
});