const spawn     = require('child_process').spawn;
const gulp      = require('gulp');
const maps      = require('gulp-sourcemaps');
const babel     = require('gulp-babel');
const concat    = require('gulp-concat');
const css       = require('gulp-minify-css');
const rename    = require('gulp-rename');

/* Build */

const cssFiles = [
    'src/**/*.css',
];

gulp.task('build-css', function() {
    return gulp.src(cssFiles)
        .pipe(css())
        .pipe(rename('all.css'))
        .pipe(gulp.dest('app/'));
});

const jsFiles = [
    'main.js',
    'src/**/*.js',
    'src/**/*.jsx',
    '!src/**/*.test.js'
];

gulp.task('build-js', () => {
    return gulp.src(jsFiles)
        .pipe(maps.init())
        .pipe(babel())
        .pipe(maps.write('.'))
        .pipe(gulp.dest('app/'));
});


gulp.task('build', ['build-css', 'build-js']);


/* Copy */

const htmlFiles = [
    'index.html',
    'src/*.html'
];



gulp.task('copy-antd', () => {
    return gulp.src('node_modules/antd/dist/antd.min.css').pipe(gulp.dest('app/'));
});

gulp.task('copy-html', () => {
    return gulp.src(htmlFiles).pipe(gulp.dest('app/'));
});

gulp.task('copy-assets', () => {
    return gulp.src('assets/**/*').pipe(gulp.dest('app/assets'));
});

gulp.task('copy', ['copy-html', 'copy-assets', 'copy-antd']);


/* Execute */

const cmd   = (name) => 'node_modules/.bin/' + name;
const args  = (more) => Array.isArray(more) ? ['.'].concat(more) : ['.'];
const exit  = () => process.exit();

gulp.task('start', ['copy', 'build'], () => {
    spawn(cmd('electron'), args(), { stdio: 'inherit' }).on('close', exit);
});


gulp.task('release', ['copy', 'build'], () => {
    spawn(cmd('electron-builder'), args(), { stdio: 'inherit' }).on('close', exit);
});

gulp.task('test', ['copy', 'build'], () => {
    spawn(cmd('jest'), args(), { stdio: 'inherit' }).on('close', exit);
});


