<?require("./setup.inc");?>
<html lang="en" class="">
<head>
 <style is="custom-style">
  body{background:radial-gradient(ellipse at center, #87e0fd 0%,#53cbf1 40%,#05abe0 100%);} 
  canvas#raw,img#overlay,img#bestfit{position:absolute;cursor:crosshair;}img#overlay{width:192px;height:192px;z-index:10;}
 </style>
</head>
<body>
<table id="editDialog" cellspacing="10">
 <tr><td width="192px" height="192px" rowspan="3">
<?
$_GET['image']=pathinfo($_GET['image'])['basename'];
$appname=@substr(implode("/",explode("~",$_GET['image'])),3);
$imagelocation=glob("./{res/**,stored/raw}/".$_GET['image'].".png",GLOB_BRACE)[0];
echo"  <div id='canvasoutput' style='position:relative;width:192px;height:192px;'>\n";
$options=@json_decode(file_get_contents("./stored/list.json"),true)[str_replace(".png","",$_GET['image'])];
if(!$options){$options['size']=128;$options['background']="ECEBEB";$options['name']=@explode("~",$_GET['image'])[1];$options['apps'][]=$appname;}
echo"   <canvas id='raw' hex='#{$options['background']}' size='{$options['size']}' image='{$imagelocation}?nc=".time()."'></canvas>\n";
echo"   <img id='overlay' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII='/>\n";
echo"   <img id='bestfit' src='./designs/best_fit.png' style='display:none;'/>\n";
echo"  </div>\n";//print_r($options);
?>
 </td><td>
  <paper-input id="name" label="Application Name" value="<?=$options['name'];?>" always-float-label></paper-input>
 </td><td>
  <paper-input id="background" label="Background Color" value="#<?=$options['background'];?>" always-float-label></paper-input>
 </td></tr></tr><td colspan="2">
    <paper-slider id="size" min="64" max="256" step="2" value="5" class="orange" width="100%" pin></paper-slider>
 </td></tr><tr><td colspan="2">
<?
foreach($options['apps'] as $app){
 echo"  <paper-input id='app' value='{$app}' no-label-float></paper-input>\n";
}echo"  <paper-input id='app' no-label-float></paper-input>\n";
?>  
 </td></tr>
</table>
<script>
var data={},ready=0,design="blawb";
var img=new Image();img.src=$("canvas#raw").attr("image");
var mask=new Image();mask.src="./designs/mask_"+design+".png";
var overlay=new Image();overlay.src="./designs/overlay_"+design+".png";
 overlay.addEventListener("load",function(){ready++;createCanvas();});
 mask.addEventListener("load",function(){ready++;createCanvas();});
 img.addEventListener("load",function(){ready++;createCanvas();});
$("canvas#raw").attr({width:"192px",height:"192px"}); 

$("paper-fab").css("border-radius","56px").each(function(){
 $(this).find("paper-material").append($(this).attr("title")).css("white-space","nowrap");
}); 
 
function createCanvas(){
 if(ready!=3){return;}else{
  var canvas=$("canvas#raw")[0]
  var context=canvas.getContext('2d')
  var offset=0,color=$(canvas).attr("hex");
  $("img#overlay").attr("src",$(overlay).attr("src"));
  var iconxy=[$(canvas).attr("size"),$(canvas).attr("size")];
  var gradient=context.createRadialGradient(50,50,mask.width*1.3,20,20,0);  
  if(iconxy){mainxy=[(mask.width-iconxy[0])/2,((mask.height-iconxy[1])/2)-offset];}
  if(color){gradient.addColorStop(1,lighten(color));gradient.addColorStop(0,darken(color));}
  for(var x=1;x<mask.width;x++){context.drawImage(img,mainxy[0]+x,mainxy[1]+x,iconxy[0],iconxy[1]);}
  context.putImageData(shadow(context.getImageData(0,0,mask.width,mask.height)),0,0);//CREATE ICON SHADOW;
  context.globalCompositeOperation="destination-over";context.fillStyle=gradient;context.fillRect(0,0,mask.width,mask.height);
  context.globalCompositeOperation="source-over";context.drawImage(img,mainxy[0],mainxy[1],iconxy[0],iconxy[1]);
  data["base64"]=canvas.toDataURL();context.globalCompositeOperation="xor";context.drawImage(mask,0,0);
  $("paper-slider#size").attr("value",$("canvas#raw").attr("size").replace("px",""));
  data["file"]=img.src.substring(img.src.lastIndexOf('/')+1).split(".png")[0];
  data["size"]=$("canvas#raw").attr("size").replace("px","");
  data["background"]=color.replace("#","");
 }
}

$("img#overlay, paper-input#background").on("click keyup",function(e){
 var tmp=$("canvas#raw")[0].getContext('2d'),newCanvas=$("canvas#raw").clone();
 var trigger=e.currentTarget.localName+"#"+e.currentTarget.id;//EVENT TRIGGERED BY ELEMENT
 if(trigger=="img#overlay"){var rgba=tmp.getImageData(e.pageX-$(this).offset().left,e.pageY-$(this).offset().top,1,1).data;}
 if(trigger=="img#overlay"){newCanvas.attr("hex",RGB2HEX(complement({red:rgba[0],green:rgba[1],blue:rgba[2]})));}
 if(trigger=="paper-input#background"){newCanvas.attr("hex",$("input",this).get(0).value);}
 $("paper-input#background").attr("value",newCanvas.attr("hex"));
 if(newCanvas.attr("hex").length!=7){return;}
 $("div#canvasoutput").prepend(newCanvas);
 $("canvas#raw").last().remove();
 createCanvas();
});

$("paper-slider#size").on("change",function(){
 var newCanvas=$("canvas#raw").first().clone();
 $("div#canvasoutput").prepend(newCanvas.attr("size",$(this).attr("value")));
 $("canvas#raw").last().remove();createCanvas();
});

function saveCanvas(){
 data["apps"]=[];data["name"]=$("paper-input#name").val();
 $.each($("paper-input#app"),function(k,v){if($(v).val()){data["apps"].push($(v).val());}});
 $.post("./actions/update.php",data,function(x){closeDialog();});
}

function forceColor(){
 var newCanvas=$("canvas#raw").clone().attr("hex","#ECEBEB");
 $("div#canvasoutput").prepend(newCanvas);$("canvas#raw").last().remove();
 createCanvas();
}

function shadow(imageData){
 for(var i=0;i<imageData.data.length;i+=4){if(imageData.data[i+3]!=0){
  imageData.data[i+0]=0;imageData.data[i+1]=0;imageData.data[i+2]=0;
  imageData.data[i+3]=Math.min(imageData.data[i+3],50);
 }}return imageData;
}

function colors(imageData){
 for(var i=0;i<imageData.data.length;i+=4){
  imageData.data[i+0]=0;imageData.data[i+1]=0;imageData.data[i+2]=0;
  imageData.data[i+3]=Math.min(imageData.data[i+3],50);
 }return imageData;
}

function lighten(rgb){
 var hex=(typeof rgb=="string");
 if(hex==true){rgb=HEX2RGB(rgb);}
  rgb.red=Math.min(255,rgb.red+30);
  rgb.green=Math.min(255,rgb.green+30);
  rgb.blue=Math.min(255,rgb.blue+30);
 if(hex==true){rgb=RGB2HEX(rgb);}
 return rgb;
}

function darken(rgb){
 var hex=(typeof rgb=="string");
 if(hex==true){rgb=HEX2RGB(rgb);}
  rgb.red=Math.max(0,rgb.red-50);
  rgb.green=Math.max(0,rgb.green-50);
  rgb.blue=Math.max(0,rgb.blue-50);
 if(hex==true){rgb=RGB2HEX(rgb);}
 return rgb;
}

function complement(rgb){
 var temp=RGB2HSV(rgb);
 temp.hue=HUESHIFT(temp.hue,180.0);
 return HSV2RGB(temp);
}

/*COMPLEMENT CODE*/
function MIN3(a,b,c){
 return (a<b)?((a<c)?a:c):((b<c)?b:c);
}

function MAX3(a,b,c){
 return (a>b)?((a>c)?a:c):((b>c)?b:c);
}

function RGB2HEX(rgb){
 var hexdig='0123456789ABCDEF';
 var hex=function(d){return hexdig.charAt((d-(d%16))/16)+hexdig.charAt(d%16);};
	return "#"+hex(rgb.red)+hex(rgb.green)+hex(rgb.blue);
}

function HEX2RGB(hex){
 var result=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
 return result?{red:parseInt(result[1],16),green:parseInt(result[2],16),blue:parseInt(result[3],16)}:null;
}

function HUESHIFT(h,s){h+=s;
	while(h>=360.0){h-=360.0;}
 while(h<0.0){h+=360.0;}
	return h;
}

function RGB2HSV(rgb){
	var hsv=new Object();
	var max=MAX3(rgb.red,rgb.green,rgb.blue);
	var dif=max-MIN3(rgb.red,rgb.green,rgb.blue);
	hsv.saturation=(max==0.0)?0:(100*dif/max);
	if (hsv.saturation==0) hsv.hue=0;
 else if (rgb.red==max) hsv.hue=60.0*(rgb.green-rgb.blue)/dif;
	else if (rgb.green==max) hsv.hue=120.0+60.0*(rgb.blue-rgb.red)/dif;
	else if (rgb.blue==max) hsv.hue=240.0+60.0*(rgb.red-rgb.green)/dif;
	if (hsv.hue<0.0) hsv.hue+=360.0;
	hsv.value=Math.round(max*100/255);
	hsv.hue=Math.round(hsv.hue);
	hsv.saturation=Math.round(hsv.saturation);
	return hsv;
}

function HSV2RGB(hsv){
	var rgb=new Object();
	if(hsv.saturation==0){
		rgb.red=rgb.green=rgb.blue=Math.round(hsv.value*2.55);
	}else{
		hsv.hue/=60;
		hsv.saturation/=100;
		hsv.value/=100;
		i=Math.floor(hsv.hue);
		f=hsv.hue-i;
		p=hsv.value*(1-hsv.saturation);
		q=hsv.value*(1-hsv.saturation*f);
		t=hsv.value*(1-hsv.saturation*(1-f));
		switch(i){
		 case 0:rgb.red=hsv.value;rgb.green=t;rgb.blue=p;break;
	 	case 1:rgb.red=q;rgb.green=hsv.value;rgb.blue=p;break;
		 case 2:rgb.red=p;rgb.green=hsv.value;rgb.blue=t;break;
		 case 3:rgb.red=p;rgb.green=q;rgb.blue=hsv.value;break;
		 case 4:rgb.red=t;rgb.green=p;rgb.blue=hsv.value;break;
		 default:rgb.red=hsv.value;rgb.green=p;rgb.blue=q;
		}rgb.green=Math.round(rgb.green*255);
		rgb.blue=Math.round(rgb.blue*255);
		rgb.red=Math.round(rgb.red*255);
	}
	return rgb;
}
</script>
</body>
</html>