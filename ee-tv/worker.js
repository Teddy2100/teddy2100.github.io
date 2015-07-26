var version='v5',preload=[
 '../bower_components/webcomponentsjs/webcomponents-lite.min.js',
 '../bower_components/jquery/dist/jquery.min.js',
 '../bower_components/vulcanized-full.html',
 './images/nobblee_regular.woff',
 './images/nobblee_light.woff',
 './images/logo.png'
];

this.addEventListener('install',function(event){
 event.waitUntil(caches.open(version).then(function(cache){
  return cache.addAll(preload);
 }));
});

this.addEventListener('activate',function(event){
 event.waitUntil(caches.keys().then(function(keyList){
  return Promise.all(keyList.map(function(key,i){if(key!=version){
   console.log("CACHE DELETED",keyList[i]);
   return caches.delete(keyList[i]);
  }}));
 }));
});

this.addEventListener('fetch',function(event){
 event.respondWith(caches.open(version).then(function(cache){
  return cache.match(event.request).then(function(file){if(file){return file;}else{
   return fetch(event.request.clone()).then(function(response){
    console.log("FETCH",event.request.url);return response;
   }).catch(function(error){throw error;});
  }});
 }));
});
