<?
require("../setup.inc");
$year=date("y");$time=date("Hi");
$apk=openXML(APK."AndroidManifest.xml");
$day=str_pad(date("z"),3,"0",STR_PAD_LEFT);
foreach(glob(DRAWABLE."*.png") as $file){unlink($file);}
if(file_exists(XML."drawable.xml")==true){unlink(XML."drawable.xml");}
if(file_exists(XML."appfilter.xml")==true){unlink(XML."appfilter.xml");}
 $apk->xpath("/manifest/@android:versionName")[0]->versionName="$year.$day.$time";
 $apk->xpath("/manifest/@android:versionCode")[0]->versionCode=$year.$day.$time;
saveXML(APK."AndroidManifest.xml",$apk);
?>