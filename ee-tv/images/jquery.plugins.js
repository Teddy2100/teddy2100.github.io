$.ajaxSetup({
 timeout:2000
});

$.fn.extend({
 loadSelected:function(setup){
  $(this).on("click",function(event){
   document.querySelector("paper-drawer-panel").closeDrawer();
   $("#gui-title-bar").html("EE TV : "+$(this).text().toUpperCase());
   var loadFile=$(this).attr("file"),us=unix?unix:new Date().getTime();
   $().sleep(setup.delay,function(){$.get(loadFile+"?nc="+us,function(html){
    $("#mainContainer").html(html);
   });});return $(this);
  });
 },
 toast:function(obj){
  var x="PT"+new Date().getTime();
  if(obj){var toast=$("<paper-toast/>");
   var colors={alert:"#CC0000",done:"#31B404"};
    toast.addClass("paper-toast-open").attr({id:x,text:obj.text});   
    toast.css({"background":colors[obj.type]?colors[obj.type]:"#009C9C"});
   $("paper-toast-stack").append(toast).css({"bottom":"-50px"}).sleep(0,function(){
    $("paper-toast-stack").animate({"bottom":"0px"}).sleep(50000,function(){
     $("#"+x).fadeOut("250",function(){$(this).remove();});
    });
   });
  }return $(this);
 },
 getQuery:function(key){try{
  var hashes=window.location.href.split("?")[1].split('&');
  for(var i=0;i<hashes.length;i++){var hash=hashes[i].split('=');
   if(key==hash[0]){return hash[1];}
  }return null;
 }catch(e){
  return null;
 }},
 sleep:function(ms,callback){
  return setTimeout(callback, ms);
 },
 upperText:function(){
  return $(this).html().trim().toUpperCase();
 }
});
