var gulp=require('gulp');
var ghPages=require('gulp-gh-pages');
 
gulp.task("deploy",function(){
 var options={remoteUrl:"https://github.com/aronfeerick/aronfeerick.github.io.git",branch:"master",cacheDir:".page"}
 return gulp.src("./**/*").pipe(ghPages(options));
});

gulp.task("default",function(){
 console.log("TEST");
});