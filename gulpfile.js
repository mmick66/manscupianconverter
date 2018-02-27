const spawn     = require('child_process').spawn;
const gulp      = require('gulp');
const maps      = require('gulp-sourcemaps');
const babel     = require('gulp-babel');
const css       = require('gulp-minify-css');
const rename    = require('gulp-rename');
const change    = require('change-case');
const del       = require('del');

gulp.task('clean',  () => {
    return del('app/**/*');
});

/* Build */

const cssFiles = [
    'src/**/*.css',
];

gulp.task('build-css', () => {
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

const cssToCopy = [
    'src/main.css',
    'node_modules/react-image-crop/dist/ReactCrop.css',
    'node_modules/antd/dist/antd.css'
];

gulp.task('copy-css', () => {
    return gulp.src(cssToCopy)
        .pipe(css())
        .pipe(rename(function (file) {
            file.basename = change.headerCase(file.basename).toLowerCase();
        }))
        .pipe(gulp.dest('app/'));
});

gulp.task('copy-html', () => {
    return gulp.src(htmlFiles).pipe(gulp.dest('app/'));
});

gulp.task('copy-assets', () => {
    return gulp.src('assets/**/*').pipe(gulp.dest('app/assets'));
});

gulp.task('copy', ['copy-html', 'copy-assets', 'copy-css']);


/* Execute */

const cmd   = (name) => 'node_modules/.bin/' + name;
const args  = (more) => Array.isArray(more) ? ['.'].concat(more) : ['.'];
const exit  = () => process.exit();

gulp.task('start', ['copy', 'build'], () => {
    spawn(cmd('electron'), args(), { stdio: 'inherit' }).on('close', exit);
});


gulp.task('release', ['clean', 'copy', 'build'], () => {
    spawn(cmd('electron-builder'), args(), { stdio: 'inherit' }).on('close', exit);
});

gulp.task('test', ['copy', 'build'], () => {
    spawn(cmd('jest'), args(), { stdio: 'inherit' }).on('close', exit);
});


