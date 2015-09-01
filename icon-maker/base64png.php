<?
$input=$_REQUEST['base64'];$filename=md5($_REQUEST['name']);
$input=substr($input,strpos(str_replace(' ','+',$input),",")+1);
file_put_contents("./res/drawable-xxhdpi/icon_{$filename}.png",base64_decode($input));
echo"./res/drawable-xxhdpi/icon_{$filename}.png";
?>