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
  div.buttons{background:lightgrey;border-top:2px inset;}
  body{background:radial-gradient(ellipse at center, #87e0fd 0%,#53cbf1 40%,#05abe0 100%);}
  img#thumb{width:75px;height:75px;cursor:pointer;}paper-fab{margin:0px 15px 15px 0px;}
  paper-fab.green{--paper-fab-keyboard-focus-background:var(--paper-green-900);
   --paper-fab-background:var(--paper-green-500);
  }  
 </style>
</head>
<body>
<div id="content" style="text-align:center;font-size:0px;"> 
<?
include("./findnew.php");echo"<hr>\n";$jsonfile="./stored/list.json";
foreach(json_decode(file_get_contents($jsonfile),true) as $image=>$data){
 echo" <img id='thumb' src='./stored/icon/{$image}.png?nc=".time()."' raw='{$image}'/>\n";
}
?>
</div>
<div style="position:fixed;bottom:0px;right:0px;height:75px;">
 <paper-fab icon="icons:android" title="Build & Install" class="green" onclick="build();" style="width:125px;"></paper-fab>
</div>
<paper-dialog entry-animation="fade-in-animation" exit-animation="fade-out-animation" modal>
 <paper-dialog-scrollable id="edithtml"></paper-dialog-scrollable><div class="buttons">
  <paper-button onclick="closeDialog();">Cancel</paper-button>
  <paper-button autofocus onclick="saveCanvas();">Save</paper-button>
 </div>
</paper-dialog>
<script>
var current=null;
$("paper-fab[title]").css("border-radius","56px").each(function(){
 $(this).find("paper-material").append($(this).attr("title")).css("white-space","nowrap");
 $(this).css({"border-radius":"56px","width":"125px"}).removeAttr("title");
}); 

$("img").on("error",function(){location.replace("./");
}).on("click",function(){current=$(this).attr("src").split("?")[0];
 $.get("./edit.php?image="+$(this).attr("raw"),function(code){
  $("paper-dialog").removeAttr("style").css("position","fixed");
  $("paper-dialog-scrollable").css("margin-top","0px");
  $("paper-dialog-scrollable#edithtml").html(code);
  $("paper-dialog").get(0).open();
 }); 
});

function closeDialog(){
 var image=current+"?nc="+new Date().getTime();
 $("img[src*='"+current+"']").attr("src",image);
 $("paper-dialog").get(0).close();
};

function build(){
 location.replace("./build.php");
}
</script>
</body>
</html>