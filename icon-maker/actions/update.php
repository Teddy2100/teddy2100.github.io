<?
$jsonfile="../stored/list.json";
$segments=explode("~",$_REQUEST["file"]);
$json=json_decode(file_get_contents($jsonfile),true);
$base64=explode(",",str_replace(" ","+",$_REQUEST["base64"]))[1];
$location=@glob("../{res/**,stored/raw}/".$_POST["file"].".png",GLOB_BRACE)[0];
if(count($segments)==1){$image=$segments[0];}else{$image=md5($segments[1].$segments[2]);}
file_put_contents("../stored/icon/{$image}.png",base64_decode($base64));unset($_REQUEST["base64"]);
if(count($segments)!=1){$json[$image]['apps'][]=$segments[1]."/".$segments[2];}unset($_REQUEST["file"]);
if($location!="../stored/raw/{$image}.png"){rename($location,"../stored/raw/{$image}.png");}
foreach($_REQUEST as $key=>$value){$json[$image][$key]=$value;}
file_put_contents($jsonfile,json_encode($json));
 
foreach($json as $md5=>$data){@$temp[str_replace(" ","",$data['name'])]=$md5;}ksort($temp);
foreach($temp as $name=>$md5){$temp[$md5]=$json[$md5];unset($temp[$name]);}
file_put_contents($jsonfile,json_encode($temp));
?>