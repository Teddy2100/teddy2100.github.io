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
 <style>
  body{background:radial-gradient(ellipse at center, #87e0fd 0%,#53cbf1 40%,#05abe0 100%);} 
  img{width:100px;height:100px;cursor:pointer;-webkit-filter:drop-shadow(12px 12px 25px rgba(0,0,0,0.5));}
  canvas{display:none;}
 </style>
<body>

<div class="content" style="text-align:center;">
<?
require("./setup.inc");
function moveFile($from,$to){
 @mkdir(pathinfo($to)["dirname"],0755,true);
 if($from!=$to){rename($from,$to);}
}

foreach(glob("./input/**/*.png") as $image){
 switch(getimagesize($image)[0].getimagesize($image)[1]){
  case"512512":moveFile($image,"./input/drawable-web/".pathinfo($image)["basename"]);break;
  case"192192":moveFile($image,"./input/drawable-xxxhdpi/".pathinfo($image)["basename"]);break;
  case"144144":moveFile($image,"./input/drawable-xxhdpi/".pathinfo($image)["basename"]);break;
  case"9696":moveFile($image,"./input/drawable-xhdpi/".pathinfo($image)["basename"]);break;
  case"7272":moveFile($image,"./input/drawable-hdpi/".pathinfo($image)["basename"]);break;
  case"4848":moveFile($image,"./input/drawable-mdpi/".pathinfo($image)["basename"]);break;
  case"3636":moveFile($image,"./input/drawable-ldpi/".pathinfo($image)["basename"]);break;
  default:moveFile($image,"./input/drawable-nodpi/".pathinfo($image)["basename"]);
 }
}

foreach(glob("./input/**/*.png") as $image){
 $slices=explode("~",str_replace(["___","__","_"],"~",pathinfo($image)["filename"]));
 $colors=array("F5F5F5","6362BC","DCDCDC","FCD20B","04B9F0","7CC102","FF9601","FE369D","FE2323","434446");
 if(!@$slices[3]){$slices[3]=$colors[array_rand($colors,1)];}else{$slices[3]=str_replace("HEX","",$slices[3]);}
 moveFile($image,pathinfo($image)["dirname"]."/".implode("~",array_slice($slices,0,5)).".png");
}

@mkdir("./res/drawable-xxhdpi/",0755,true);
@mkdir("./res/xml/",0755,true);$infolder="";
$drawable=openXML("./res/xml/drawable.xml","resources",1);
$appfilter=openXML("./res/xml/appfilter.xml","resources",1);
 $appfilter->addChild("scale")->addAttribute("factor","0.75");
 $drawable->addChild("item")->addAttribute("drawable","design_logo");
 $appfilter->addChild("iconmask")->addAttribute("img1","design_mask");
 $appfilter->addChild("iconupon")->addAttribute("img1","design_overlay");
 
 $bg=$appfilter->addChild("iconback");
foreach(glob("./input/bg_*.png") as $k=>$file){
	$refrence=pathinfo($file)["filename"];
	$bg->addAttribute("img".($k+1),$refrence);
}
 
foreach(glob("./input/**/*.png") as $image){
 $options=@explode("~",pathinfo($image)["filename"]);
 $foldername=strtoupper(substr(pathinfo($image)["dirname"],17));
 if($infolder!=$foldername){echo"<h1>{$foldername}</h1>\n";$infolder=$foldername;} 
 echo" <canvas width='192' height='192' image='{$image}'></canvas>\n"; 
 $drawable->addChild("item")->addAttribute("drawable","icon_".md5($options[1].$options[2]));
 $newItemApp=$appfilter->addChild("item");
	$newItemApp->addAttribute("component","ComponentInfo{".$options[1]."/".$options[2]."}");
 $newItemApp->addAttribute("drawable","icon_".md5($options[1].$options[2]));
}
saveXML("./res/xml/appfilter.xml",$appfilter);
saveXML("./res/xml/drawable.xml",$drawable);
?> 
</div>

<script>
$(document).one("ready",function(){
 var mask=new Image(),overlay=new Image(),best=new Image(),design="blawb";
  mask.src="./designs/mask_"+design+".png",overlay.src="./designs/overlay_"+design+".png";
  best.src="./designs/best_fit.png";
 $(window).on("load",function(){
  $("canvas").each(function(appicon){
   var img=new Image(),data={},icon=128,offset=0,canvas=this;
   var ctx=canvas.getContext('2d');img.src=$(canvas).attr("image");
    if(design=="heart"){var icon=128,offset=10;}
   img.addEventListener('load',function(){iconxy=[icon,icon];
    var options=img.src.replace(".png","").split("/ic~")[1].split("~");
    
    if(options[3]){iconxy=[options[3],options[3]];}
    
    if(iconxy){xy=[(mask.width-iconxy[0])/2,((mask.height-iconxy[1])/2)-offset];}
    for(var x=1;x<mask.width;x++){ctx.drawImage(img,xy[0]+x,xy[1]+x,iconxy[0],iconxy[1]);}
    ctx.putImageData(shadow(ctx.getImageData(0,0,mask.width,mask.height)),0,0);ctx.drawImage(img,xy[0],xy[1],iconxy[0],iconxy[1]);
    ctx.globalCompositeOperation="destination-over";ctx.fillStyle="#"+options[2];ctx.fillRect(0,0,mask.width,mask.height);
    //ctx.globalCompositeOperation="source-over";ctx.drawImage(overlay,0,0);//ctx.drawImage(best,0,0);
    //ctx.globalCompositeOperation="xor";ctx.drawImage(mask,0,0);

    data["name"]=(options[0]+options[1]);data["base64"]=canvas.toDataURL();
    $.post("./base64png.php",data,function(x){var base64=$("<img/>").attr("src",x);
     base64.on("click",function(){window.open("https://play.google.com/store/apps/details?id="+options[0]);});
     $(canvas).replaceWith(base64);console.log("SAVED",x);
    });    
   });
  }); 
 });
});

function shadow(imageData){
 for(var i=0;i<imageData.data.length;i+=4){if(imageData.data[i+3]!=0){
  imageData.data[i+0]=0;imageData.data[i+1]=0;imageData.data[i+2]=0;
  imageData.data[i+3]=Math.min(imageData.data[i+3],50);
 }}return imageData;
}
</script>
</body>
</html>