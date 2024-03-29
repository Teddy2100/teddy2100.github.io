<?
set_time_limit(300);
date_default_timezone_set("Europe/London");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Cache-Control: post-check=0, pre-check=0",false);
header("Cache-Control: no-store, no-cache, must-revalidate");

define("ADB","C:/Android/sdk/platform-tools");
define("JAVA_HOME","C:/Progra~1/Java/jdk1.7.0_72");
define("ANDROID_HOME","C:/Android/sdk/build-tools/23.0.1");
define("DEV_HOME","C:/Dropbox/Projects/Android Applications");
define("ANDROID_JAR","C:/Android/sdk/platforms/android-23/android.jar");
define("APPLICATION_HOME","C:/Dropbox/Projects/Android Applications/IconMaker");

if(!file_exists(APPLICATION_HOME)){die("ANDROID APPLICATION FOLDER DOES NOT EXISTS");}else{
 define("DRAWABLE",APPLICATION_HOME."/res/drawable-xxxhdpi/");if(!file_exists(DRAWABLE)){mkdir(DRAWABLE,0755,true);}
 define("XML",APPLICATION_HOME."/res/xml/");if(!file_exists(XML)){mkdir(XML,0755,true);}
}

function documentRoot($goto=""){
 $root=array_filter(explode("/",$_SERVER['DOCUMENT_ROOT']));
 $goto=array_filter(explode("/",str_replace("\\","/",$goto)));
 foreach($goto as $dir){if($dir!=".."){break;}else{
  if(count($root)>1){array_shift($goto);}
  if(count($root)>1){array_pop($root);}
 }}$output=array_merge($root,$goto);
 return implode("/",$output)."/";
}

function openXML($filename,$child="xml",$delete=0){
 if(isset($delete) && $delete==true){@unlink($filename);}
 $blank="<?xml version='1.0' encoding='UTF-8'?><{$child}></{$child}>";
 if(!file_exists($filename)){file_put_contents($filename,$blank);}
 return simplexml_load_file($filename);
}

function saveXML($filename,$object){
 $dom=new DOMDocument("1.0");$dom->preserveWhiteSpace=false;
 $dom->formatOutput=true;$dom->loadXML($object->asXML());
 $xml=str_replace("\n","\r\n",$dom->saveXML());
 file_put_contents($filename,$xml);
}

function openJSON($filename){
 if(!file_exists($filename)){file_put_contents($filename,"[]");}
 return json_decode(file_get_contents($filename),true);
}

function saveJSON($filename,$array){
 file_put_contents($filename,json_encode($array));
}

function randomPART(){
 return str_pad(dechex(mt_rand(0,255)),2,"0",STR_PAD_LEFT);
}

function randomCOLOR(){
 $hex=randomPART().randomPART().randomPART();
 return strToUpper($hex);
}
?>