<?
ob_start();
require("../setup.inc");$output=array();$stop=false;
$output['init']['missing']=[];$output['init']['found']=[];
DEFINE("KEY_PASS","penny1234");DEFINE("STORE_PASS","penny1234");
$check=@[ADB, JAVA_HOME, ANDROID_HOME, DEV_HOME, ANDROID_JAR, APPLICATION_HOME];
foreach($check as $dir){$f=(is_file($dir)?true:(is_dir($dir)?true:false));
 if(!$f){$stop=true;$output['init']['missing'][]=$dir;}
 else{$output['init']['found'][]=$dir;}
}

if(count($output['init']['missing'])==0){switch(@$_REQUEST['step']){
 case 1;command('md "'.APPLICATION_HOME.'/obj" "'.APPLICATION_HOME.'/bin"');break;
 case 2;command(ANDROID_HOME.'/aapt package -v -f -m -S "'.APPLICATION_HOME.'/res" -J "'.APPLICATION_HOME.'/src" -M "'.APPLICATION_HOME.'/AndroidManifest.xml" -I "'.ANDROID_JAR.'"');break;
 case 3;command(JAVA_HOME.'/bin/javac -verbose -d "'.APPLICATION_HOME.'/obj" -classpath "'.ANDROID_JAR.';'.APPLICATION_HOME.'/obj" -sourcepath "'.APPLICATION_HOME.'/src" "'.APPLICATION_HOME.'/src/com/aronfeerick/mypack/R.java"');break;
 case 4;command(ANDROID_HOME.'/dx --dex --verbose --output="'.APPLICATION_HOME.'/bin/classes.dex" "'.APPLICATION_HOME.'/obj"');break;
 case 5;command(ANDROID_HOME.'/aapt package -v -f -M "'.APPLICATION_HOME.'/AndroidManifest.xml" -S "'.APPLICATION_HOME.'/res" -I "'.ANDROID_JAR.'" -F "'.APPLICATION_HOME.'/bin/custom.unsigned.apk" "'.APPLICATION_HOME.'/bin"');break;
 case 6;command(JAVA_HOME.'/bin/jarsigner -verbose -keystore "'.DEV_HOME.'/mykeystore" -storepass "'.STORE_PASS.'" -keypass "'.KEY_PASS.'" -signedjar "'.APPLICATION_HOME.'/bin/custom.signed.apk" "'.APPLICATION_HOME.'/bin/custom.unsigned.apk" aronfeerick');break;
 case 7;command(ANDROID_HOME.'/zipalign -v -f 4 "'.APPLICATION_HOME.'/bin/custom.signed.apk" "'.APPLICATION_HOME.'/custom.apk"');break;
 case 8;command('rd /s /q "'.APPLICATION_HOME.'/obj" "'.APPLICATION_HOME.'/bin" "'.APPLICATION_HOME.'/gen"');break;
 case 9;command(ADB.'/adb -d install -r "'.APPLICATION_HOME.'/custom.apk"');break;
 case 0:header("location: ?step=1");break;
 default:header("location: ../");
}}

function command($run){
 global $output;passthru($run);
 $output['action']=$run; 
 $output['raw']=ob_get_contents(); 
 $output['next']=@$_REQUEST['step']+1;
 $output=json_encode($output);
 ob_clean();die($output);
}
/*
if($stop){die("<h2>Please check all files/folders exist.</h2>");}else{try{
 exec('md "'.APPLICATION_HOME.'/obj" "'.APPLICATION_HOME.'/bin"');DEFINE("KEY_PASS","penny1234");DEFINE("STORE_PASS","penny1234");
 exec(ANDROID_HOME.'/aapt package -v -f -m -S "'.APPLICATION_HOME.'/res" -J "'.APPLICATION_HOME.'/src" -M "'.APPLICATION_HOME.'/AndroidManifest.xml" -I "'.ANDROID_JAR.'"');
 exec(JAVA_HOME.'/bin/javac -verbose -d "'.APPLICATION_HOME.'/obj" -classpath "'.ANDROID_JAR.';'.APPLICATION_HOME.'/obj" -sourcepath "'.APPLICATION_HOME.'/src" "'.APPLICATION_HOME.'/src/com/aronfeerick/mypack/R.java"');
 exec(ANDROID_HOME.'/dx --dex --verbose --output="'.APPLICATION_HOME.'/bin/classes.dex" "'.APPLICATION_HOME.'/obj"');
 exec(ANDROID_HOME.'/aapt package -v -f -M "'.APPLICATION_HOME.'/AndroidManifest.xml" -S "'.APPLICATION_HOME.'/res" -I "'.ANDROID_JAR.'" -F "'.APPLICATION_HOME.'/bin/custom.unsigned.apk" "'.APPLICATION_HOME.'/bin"');
 exec(JAVA_HOME.'/bin/jarsigner -verbose -keystore "'.DEV_HOME.'/mykeystore" -storepass "'.STORE_PASS.'" -keypass "'.KEY_PASS.'" -signedjar "'.APPLICATION_HOME.'/bin/custom.signed.apk" "'.APPLICATION_HOME.'/bin/custom.unsigned.apk" aronfeerick');
 exec(ANDROID_HOME.'/zipalign -v -f 4 "'.APPLICATION_HOME.'/bin/custom.signed.apk" "'.APPLICATION_HOME.'/custom.apk"');
 exec('rd /s /q "'.APPLICATION_HOME.'/obj" "'.APPLICATION_HOME.'/bin" "'.APPLICATION_HOME.'/gen"');
 exec(ADB.'/adb -d install -r "'.APPLICATION_HOME.'/custom.apk"');
 exec('del "'.APPLICATION_HOME.'/custom.apk"');
}catch(Exception $event){$stop=true;}}
if(!$stop){header("location: ../");}
*/
?>