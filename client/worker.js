var CACHE_NAME = 'shri-2016-task3-2';
var CACHE_NAME_DATA = 'shri-2016-task3-2-data'

var urlsToCache = [
    '/',
    'css/index.css',
    'js/index.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    const requestURL = new URL(event.request.url);

    if (/^\/api\/v1/.test(requestURL.pathname)
        && (event.request.method !== 'GET' && event.request.method !== 'HEAD')) {

        caches.delete(CACHE_NAME_DATA);
        return event.respondWith(fetch(event.request));


    }

    if (/^\/api\/v1/.test(requestURL.pathname)) {
        return event.respondWith(
            getFromCache(event.request)
                .catch(() => fetchAndPutToCache(event.request))
        );
    }

    return event.respondWith(
        getFromCache(event.request).catch(() => fetchAndPutToCache(event.request))
    );
});

function fetchAndPutToCache(request) {
    return fetch(request).then((response) => {

            const responseToCache = response.clone();
            return caches.open(CACHE_NAME_DATA)
                .then((cache) => {

                    cache.put(request, responseToCache);
                })
                .then(() => response);
        })
        .catch(() => caches.match(request));
}

function getFromCache(request) {
    return caches.match(request)
        .then((response) => {
            if (response) {
                return response;
            }

            return Promise.reject();
        });
}