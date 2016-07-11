'use strict';

var CACHE_VERSION = 1;
var CURRENT_CACHES = {
    prefetch: 'prefetch-v' + CACHE_VERSION
};

self.addEventListener('install', event => {
    var prefetch = [
        'index.html',
        'manifest.json',
        'js/app.bundle.js',
        'css/styles.css',
        'img/iconset.svg'
    ];
    event.waitUntil(
        caches.open(CURRENT_CACHES.prefetch).then(cache => {
            return cache.addAll(prefetch);
        })
    );
});

self.addEventListener('activate', event => {
    let cacheWhitelist = Object.keys(CURRENT_CACHES).map(function(key) {
        return CURRENT_CACHES[key];
    });

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }

            return fetch(event.request).then(function(response) {
                return response;
            });
        })
    );
});
