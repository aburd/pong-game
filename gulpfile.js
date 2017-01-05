var gulp = require('gulp')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var tsify = require('tsify')
var paths = {
  pages: ['client/*.html']
}


// gulp.task('copy-html', function() {
//   return gulp.src(paths.pages)
//       .pipe(gulp.dest('dist'))
// })

gulp.task('typescript', function() {
  return browserify({
    basedir: '.',
    debug: true,
    entries: ['src/app.ts'],
    cache: {},
    packageCache: {}
  })
  .plugin(tsify)
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('dist'))
});

gulp.task('watcher', function() {
  return gulp
      .watch('./src/*.ts', ['typescript'])
      .on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      });
});

gulp.task('default', ['typescript', 'watcher'])


// var ts = require('gulp-typescript')
// var tsProject = ts.createProject('tsconfig.json')
// gulp.task('default', function(){
//   return tsProject.src()
//       .pipe(tsProject())
//       .js.pipe(gulp.dest('dist'))
// })
