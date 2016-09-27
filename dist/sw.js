let resourcesToCache =
    [
        '/',
        '/css/main.css',
        '/js/app.js'
    ];

self.addEventListener('install', function(event) {

  /* Pausamos al ejecución de la promesa hasta que no esté
  todo guardado */
   event.waitUntil(
       /* Creamos o abrimos la caché */
        caches.open('nombreCache').then(function(cache) {
            console.log('Opened cache', cache);
            /* Guardamos los archivos */
          // return cache.addAll(resourcesToCache);

           return cache.add('/css/main.css');
        })
   );
});


 self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
            console.log('devolvemos el recurso: ', response);
            return response;
        }
        console.log('nos traemos de la red el recurso solicitado');
        return fetch(event.request);
      }
    )
  );
});
