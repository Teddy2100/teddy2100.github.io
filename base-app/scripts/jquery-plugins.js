$.fn.extend({
 showPage:function(page){
  if($(this).attr("page")){page=$(this).attr("page");}
  $("#document-content > *").not("[page="+page+"]").removeClass("active");
  $("#document-content > *[page="+page+"]").addClass("active");
 }
});