var gulp=require('gulp');
var ghPages=require('gulp-gh-pages');
var exclude=require('gulp-exclude-gitignore');
var options={branch:'master',cacheDir:'.git/www'};
 
gulp.task('deploy',function(){
 var folders=['./**/*','!node_modules/**','!required/**'];
 return gulp.src(['./**/*','!\.git/**']).pipe(exclude())
  .pipe(ghPages(options));
});

gulp.task('default',function(){
 console.log('TEST');
});