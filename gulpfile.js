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
var cssmin = require('gulp-cssmin');
var del = require('del');

gulp.task('index', function() {
    return gulp
    .src('index.html')
    .pipe(useref())
    .pipe(gulpif('*.js', ngAnnotate()))
    .pipe(gulpif('*.min.css', cssmin()))
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
    .src('src/img/*')
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
    .src(['manifest.json', 'getDomain.js'])
    .pipe(gulp.dest('dist'))
});

gulp.task('font', function() {
    return gulp
        .src('node_modules/bootstrap/dist/fonts/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean', function() {
    del(['dist/*']);
});

gulp.task('build', ['clean', 'concat', 'img', 'image', 'manifest', 'font'], function() {
    gutil.log('building...')
});