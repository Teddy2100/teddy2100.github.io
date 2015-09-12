<?
require("../setup.inc");
$md5=@$_REQUEST["md5"];$base64=@$_REQUEST["base64"];
$base64=substr($base64,strpos(str_replace(' ','+',$base64),",")+1);
file_put_contents(DRAWABLE."icon_{$md5}.png",base64_decode($base64));
echo DRAWABLE."icon_{$md5}.png";
?>