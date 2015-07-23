var gulp=require('gulp');
var filter=require('gulp-filter');
var ghPages=require('gulp-gh-pages');
var gitIgnore=require('gulp-exclude-gitignore');

var options={branch:'master',cacheDir:'.git/www'};

 
gulp.task('deploy',function(){
 var folders=['./**/*','!node_modules/**','!required/**'];

 return gulp.src(['./**/*'])

  .pipe(filter(['*','!./.git/']))

  .pipe(gitIgnore())

  .pipe(ghPages(options));
});

gulp.task('default',function(){
 console.log('No Auto Run Setup');
});