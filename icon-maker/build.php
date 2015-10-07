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
$design="blawb";
array_map("unlink",glob(DRAWABLE."*.png"));
array_map("copyDrawable",glob("./stored/*.png"));
$drawable=openXML(XML."drawable.xml","resources",1);
$appfilter=openXML(XML."appfilter.xml","resources",1);
$appfilter->addChild("scale")->addAttribute("factor","0.75");
$appfilter->addChild("iconmask")->addAttribute("img1","design_mask");
$appfilter->addChild("iconupon")->addAttribute("img1","design_overlay");$bg=$appfilter->addChild("iconback");
foreach(glob("./stored/*.png") as $k=>$file){$bg->addAttribute("img".($k+1),pathinfo($file)['filename']);}
foreach(json_decode(file_get_contents("./stored/list.json"),true) as $md5=>$data){
 echo" <canvas md5='{$md5}' color='".$data['background']."'></canvas>\n";
 $drawable->addChild("item")->addAttribute("drawable","icon_{$md5}");
	foreach($data['apps'] as $k=>$value){$newItemApp=$appfilter->addChild("item");
		$newItemApp->addAttribute("component","ComponentInfo{".$value."}");
  $newItemApp->addAttribute("drawable","icon_".$md5);
 }
}
copyDrawable("./designs/overlay_{$design}.png","design_overlay.png");
copyDrawable("./designs/mask_{$design}.png","design_mask.png");
saveXML(XML."appfilter.xml",$appfilter);
saveXML(XML."drawable.xml",$drawable);

function copyDrawable($file,$name=null){
 if(!$name){$name=pathinfo($file)['basename'];} 
 copy($file,DRAWABLE.$name);
}
?>
</div>
<script>
var data={},design="<?=$design;?>"; 
var mask=new Image();mask.src="./designs/mask_"+design+".png";
var overlay=new Image();overlay.src="./designs/overlay_"+design+".png";
$("canvas").each(function(){$(this).attr({width:"192px",height:"192px"});});
$(window).on("load",function(){createCanvas();});

function createCanvas(){
 var image=new Image(),nocache=new Date().getTime();
 var canvas=$("canvas").get(0);data["md5"]=$(canvas).attr("md5");
 var context=canvas.getContext('2d'),color=$(canvas).attr("color");
 if(data["md5"]){image.src="./stored/icon/"+data["md5"]+".png?nc="+nocache;}
 image.addEventListener("load",function(){context.drawImage(image,0,0);
  context.globalCompositeOperation="source-over";context.drawImage(overlay,0,0);  
  context.globalCompositeOperation="xor";context.drawImage(mask,0,0);//APPLY MASK  
  data["base64"]=canvas.toDataURL();$.post("./actions/save.php",data,function(html){
   if($("canvas").size()>1){$("canvas").get(0).remove();createCanvas();}
   else{$("canvas").get(0).remove();compileApk();}
  });
 });
}

function compileApk(step){
 $.getJSON("./actions/compile.php?step="+step,function(json){
  $("div.content").append(json.raw.replace("\n","<br>"));
  if(json.next==10){location.replace('./');}
  else{compileApk(json.next);}
 });
}
</script>
</body>
</html>