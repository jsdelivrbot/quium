var gulp = require('gulp')
var debug = require('gulp-debug');
var sass = require('gulp-sass')
var inject = require('gulp-inject')
var wiredep = require('wiredep').stream
var sourcemaps = require('gulp-sourcemaps')
var standard = require('gulp-standard')
var usemin = require('gulp-usemin')
var uglify = require('gulp-uglify')
var minifyHtml = require('gulp-minify-html')
var minifyCss = require('gulp-minify-css')
var rev = require('gulp-rev')
var ngAnnotate = require('gulp-ng-annotate')
var del = require('del')
var templateCache = require('gulp-angular-templatecache')

gulp.task('dev', ['clean', 'standard', 'sass', 'injector', 'templateCache'])

gulp.task('standard', function () {
  // ~ return gulp.src(['source/{app,components}/**/*.js'])
    // ~ .pipe(standard())
    // ~ .pipe(standard.reporter('default', {
      // ~ breakOnError: true
    // ~ }))
})

gulp.task('sass', ['clean'], function () {
  return gulp.src('source/app/app.scss')
    .pipe(inject(gulp.src(['source/**/*.scss', '!source/app/app.scss'], {read: false}), {
      starttag: '// injector',
      endtag: '// endinjector',
      transform: function (filepath) {
        return '@import ".' + filepath + '";'
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({includePaths: ['source', 'bower_components']}).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.tmp/app'))
})

gulp.task('injector', ['clean'], function () {
  return gulp.src('./source/index.html')
    .pipe(wiredep({
      exclude: [/jquery.js/, /bootstrap-sass-official/, /bootstrap.js/, '/json3/', '/es5-shim/', /bootstrap.css/, /font-awesome.css/]
    }))
    .pipe(inject(gulp.src(['source/{app,components}/**/*.{js,css}', '!source/app/app.js', '!source/{app,components}/**/*.spec.js'], {read: false}), {relative: true}))
    .pipe(gulp.dest('.tmp'))
})

gulp.task('clean', function () {
  return del.sync([
    '.tmp',
    'build'
  ])
})

gulp.task('copy-bower-components', ['dev'], function () {
  return gulp.src('bower_components/**/*').pipe(gulp.dest('build/bower_components'))
})

gulp.task('copy', ['dev'], function () {
  gulp.src(['source/*.*', '!source/index.html']).pipe(gulp.dest('build'))
  gulp.src(['source/assets/**/*']).pipe(gulp.dest('build/assets'))
})

gulp.task('default', ['dev'], function () {
  gulp.watch(['source/app/app.scss', 'source/**/*.scss'], ['dev'])
  gulp.watch(['source/index.html', 'bower.json', 'source/**/*.{js,css}'], ['dev'])
  gulp.watch('source/{app,components}/**/*.html', ['dev'])
  gulp.watch(['source/**/*.js']).on('change', function (file) {
    return gulp.src(file.path)
      .pipe(standard())
      .pipe(standard.reporter('default', {
        breakOnError: true
      }))
  })
})

gulp.task('templateCache', ['clean'], function () {
  return gulp.src('source/{app,components}/**/*.html')
    .pipe(minifyHtml())
    .pipe(templateCache({module: 'crowdferenceApp'}))
    .pipe(gulp.dest('.tmp/app'))
})

gulp.task('build', ['dev', 'copy-bower-components', 'copy'], function () {
  return gulp.src('.tmp/index.html')
    .pipe(usemin({
      css: [minifyCss, rev],
      js: [ngAnnotate, uglify, rev],
      html: [minifyHtml]
    }))
    .pipe(gulp.dest('build/'))
})
