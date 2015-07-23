var gulp=require('gulp');
var ghPages=require('gulp-gh-pages');
 
gulp.task("deploy",function(){
 var options={branch:"master",cacheDir:".page"};

 var folders=["./**/*","!node_modules/**","!required/**","!.git/**"];

 return gulp.src(folders).pipe(ghPages(options));
});

gulp.task("default",function(){
 console.log("TEST");
});