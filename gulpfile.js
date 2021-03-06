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
var zip = require('gulp-zip');
var sass = require('gulp-sass');


//once css file is generated, do the concat and minification
gulp.task('index', ['createAppCss'], function() {
    return gulp
    .src('index.html')
    .pipe(useref())
    .pipe(gulpif('*.js', ngAnnotate()))
    .pipe(gulpif('*.min.css', cssmin()))
    .pipe(gulp.dest('dist'));
});


//compile scss file to css files and put them in the css
//folder with the same folder structure
gulp.task('sass', function() {
    return gulp
        .src(['*.scss', 'src/**/*.scss'])
        .pipe(sass()).on('error', sass.logError)
        .pipe(gulp.dest('src/css'));
});


//concat all the css file (compiled from sass task) together as app.css
// which will be referenced in index.html
gulp.task('createAppCss', ['sass'], function() {
    return gulp
        .src(['src/css/*.css', 'src/css/**/*.css'])
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./'))
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
    .src('images/*')
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

gulp.task('zip', ['build'], function() {
    gulp
        .src('dist/**/*')
        .pipe(zip('payWise.zip'))
        .pipe(gulp.dest('/Users/Yuyang_Wang/Desktop'));
});

gulp.task('build', ['clean', 'concat', 'img', 'image', 'manifest', 'font'], function() {
    gutil.log('building...')
});