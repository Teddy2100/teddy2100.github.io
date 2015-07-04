<?
ob_start();
set_time_limit(300);
@unlink("polymer-full.html");
@unlink("vulcanized-full.html");

foreach(glob("./*/*.html") as $element){
 if(!strpos($element,"index.html") && !strpos($element,"web-animations.html")){
  echo"<link rel='import' href='{$element}'/>\r\n";
 }
}

file_put_contents("polymer-full.html",ob_get_contents());sleep(5);
$opts=implode(" ",["--inline-scripts","--inline-css","--strip-comments"]);
system("vulcanize {$opts} polymer-full.html > vulcanized-full.html");
ob_end_clean();sleep(5);echo"DONE @ ".time();
//header("location: ../ee-tv/");
?>