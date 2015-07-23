var gulp=require('gulp');
var ghPages=require('gulp-gh-pages');
var options={branch:"master",cacheDir:".page"};
 
gulp.task("deploy",function(){
 var folders=["./**/*","!node_modules/**","!required/**","!.git/**"];
 return gulp.src(folders,{dot:true}).pipe(ghPages(options));
});

gulp.task("default",function(){
 console.log("TEST");
});