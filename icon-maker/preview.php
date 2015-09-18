<?require("./setup.inc");?>
<html lang="en" class="">
<head>
 <meta charset="utf-8">
 <title>Android Icon Maker</title>
 <meta name="language" content="english"/>
 <meta name="theme-color" content="#009C9C">
 <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
 <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
 <script type="text/javascript" src="../bower_components/webcomponentsjs/webcomponents-lite.min.js"></script>
 <script type="text/javascript" src="../bower_components/jquery/dist/jquery.min.js"></script>
 <link rel="import" href="../bower_components/vulcanized-full.html"/>
 <style is="custom-style">
  body{background:radial-gradient(ellipse at center, #87e0fd 0%,#53cbf1 40%,#05abe0 100%);}
  canvas{display:none;}canvas:first-of-type{display:block;}
 </style>
</head>
<body>
<div class="content"> 
<?
$md5=$_GET['md5'];$design="blawb";
echo" <canvas md5='{$md5}' color='#FFF'></canvas>\n";
?>
</div>
<script>
var data={},design="<?=@$design;?>"; 
var mask=new Image();mask.src="./designs/mask_"+design+".png";
var overlay=new Image();overlay.src="./designs/overlay_"+design+".png";
$("canvas").each(function(){$(this).attr({width:"192px",height:"192px"});});
$(window).on("load",function(){createCanvas();});

function createCanvas(){
 var canvas=$("canvas").get(0);var context=canvas.getContext('2d');
 var image=new Image();image.src="./stored/icon/"+$(canvas).attr("md5")+".png"; 
 image.addEventListener("load",function(){context.drawImage(image,0,0);
  context.globalCompositeOperation="source-over";context.drawImage(overlay,0,0);  
  context.globalCompositeOperation="xor";context.drawImage(mask,0,0);
 });
}
</script>
</body>
</html>