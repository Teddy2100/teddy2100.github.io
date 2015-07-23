var gulp=require('gulp');
var ghPages=require('gulp-gh-pages');
var options={branch:'master',cacheDir:'.git/www'};
 
gulp.task('deploy',function(){
 var folders=['**/*','!.git/**','!node_modules/**','!required/**'];
 return gulp.src(folders,{dot:true}).pipe(ghPages(options));
});

gulp.task('default',function(){
 console.log('TEST');
});