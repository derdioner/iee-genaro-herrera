const CACHE_NAME = 'tesoreria-gh-v4';
const urlsToCache = [
    '/',
    '/treasury.html',
    '/academic.html',
    '/hub.html',
    '/style.css',
    '/images/logo.png',
    'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    // For navigation requests (like .html pages), try Network First
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(networkResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // For other assets, try Cache First
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request).then(networkResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
            .catch(() => {
                // Return nothing or an empty response if both fail
                return new Response('Internet Connection Error', { status: 503, statusText: 'Service Unavailable' });
            })
    );
});
