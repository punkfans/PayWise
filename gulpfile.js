var gulp = require('gulp');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var ngAnnotate = require('gulp-ng-annotate');
var templateCache = require('gulp-angular-templatecache');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var gutil = require('gulp-util');

gulp.task('index', function() {
    return gulp
    .src('index.html')
    .pipe(useref())
    .pipe(gulpif('*.js', ngAnnotate()))
    .pipe(gulp.dest('dist'));
});

gulp.task('html', function() {
    return gulp
    .src('src/components/**/*.html')
    .pipe(htmlmin({
        collapseWhitespace: true
    }))
    .pipe(templateCache({
        root: 'src/components',
        module: 'app'
    }))
    .pipe(gulp.dest('dist/temp'))
});

gulp.task('concat', ['index', 'html'], function() {
    return gulp
    .src(['dist/app.min.js', 'dist/temp/templates.js'])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
});

gulp.task('img', function() {
    return gulp
    .src('src/img/*.svg')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/src/img'))
});

gulp.task('image', function() {
    return gulp
    .src('images/*.png')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
});

gulp.task('manifest', function() {
    return gulp
    .src('manifest.json')
    .pipe(gulp.dest('dist'))
});

gulp.task('build', ['concat', 'img', 'image', 'manifest'], function() {
    gutil.log('building...')
})