$.jobs=({
 storage:{},
 create:function(store,fn,ms){
  if(!this.storage[store]){$.extend(this.storage,{[store]:[]});}
  if(typeof ms=="number"){this.storage[store].push(ms);}
  return this.storage[store].push(fn);
 },
 run:function(store,fn){
  var store=this.storage[store];
  $.each(store,function(k,c){switch(typeof c){
   case"number":$(window).delay(c);break;//DELAY ACTION
   default:$(window).queue(function(){c();$(this).dequeue();});   
  }});$(window).queue(function(){fn();$(this).dequeue();});
 } 
});
