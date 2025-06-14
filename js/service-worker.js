self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('v1').then(function(cache) {
        return cache.addAll([
            '/',
          '/js/papaparse.min.js',
          '/index.html',
          '/js/app.js',
          '/manifest.json',
          '/icons/icon-512x512.png',
          '/style/main.css'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  
