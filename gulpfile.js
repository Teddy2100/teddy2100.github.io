var gulp=require('gulp');
var ghPages=require('gulp-gh-pages');
 
gulp.task("deploy",function(){
 var options={branch:"master",cacheDir:".page"};

 return gulp.src("./**/*").pipe(ghPages(options));
});

gulp.task("default",function(){
 console.log("TEST");
});