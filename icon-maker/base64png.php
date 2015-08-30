<?
$input=$_REQUEST['base64'];$filename=md5($_REQUEST['name']);
$input=substr($input,strpos(str_replace(' ','+',$input),",")+1);
file_put_contents("./output/icon_{$filename}.png",base64_decode($input));
echo "./output/icon_{$filename}.png";
?>