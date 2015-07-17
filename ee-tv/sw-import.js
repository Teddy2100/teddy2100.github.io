importScripts("../bower_components/platinum-sw/service-worker.js");

var LiveFetchHandler=function(request, values, options){
 console.log(request);
  return fetch(request);
}