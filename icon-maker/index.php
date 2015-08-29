<html lang="en" class=""><head>
 <meta charset="utf-8">
 <title>Android Icon Maker</title>
 <meta name="language" content="english"/>
 <meta name="theme-color" content="#009C9C">
 <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
 <link rel="icon" sizes="96x96" href="./images/launcher-icon-96.png">
 <link rel="icon" sizes="192x192" href="./images/launcher-icon-192.png">
 <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
 <script type="text/javascript" src="../bower_components/jquery/dist/jquery.min.js"></script>
<body>

<div class="content" style="text-align:center;">
<?
foreach(glob("./icons/*.png") as $image){
 $colors=array("#F5F5F5","#6362BC","#DCDCDC","#FCD20B","#04B9F0","#7CC102","#FF9601","#FE369D","#FE2323","#434446");
 
 
 echo" <canvas width='192' height='192' color='".$colors[array_rand($colors,1)]."' image='{$image}'></canvas>\n";
} 
?> 
</div>

<script>
$(document).one("ready",function(){
 $("canvas").each(function(k){
  var canvas=this;var ctx=canvas.getContext('2d');var size=128;
  var img=new Image(),back=new Image(),mask=new Image(),overlay=new Image();
  
  mask.src="./design_mask.png",overlay.src="./design_overlay.png",img.src=$(canvas).attr("image");
  
  img.addEventListener('load',function(){
   ctx.clearRect(0,0,canvas.width,canvas.height);
   xy=[(canvas.width-Math.min(size,img.width))/2,(canvas.height-Math.min(size,img.height))/2];
   for(var x=0;x<192;x++){ctx.drawImage(img,xy[0]+x,xy[1]+x,Math.min(size,img.width),Math.min(size,img.height));}
   var imageData=ctx.getImageData(0,0,canvas.width,canvas.height);
   for(var i=0;i<imageData.data.length;i+=4){if(imageData.data[i+3]!=0){
    imageData.data[i+0]=0;imageData.data[i+1]=0;imageData.data[i+2]=0;
    imageData.data[i+3]=Math.min(imageData.data[i+3],40);
   }}ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle=$(canvas).attr("color");
   ctx.putImageData(imageData,0,0);ctx.drawImage(img,xy[0],xy[1],Math.min(size,img.width),Math.min(size,img.height));   
   ctx.globalCompositeOperation="destination-over";ctx.fillRect(0,0,canvas.width,canvas.height);
   //ctx.globalCompositeOperation="destination-over";ctx.drawImage(back,0,0);
   ctx.globalCompositeOperation="source-over";ctx.drawImage(overlay,0,0);
   ctx.drawImage(mask,0,0);ctx.globalCompositeOperation="xor";
   ctx.drawImage(mask,0,0);console.log("LOADED");
  });
 });
});
</script>
</body>
</html>