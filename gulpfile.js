const gulp = require ('gulp');
const {
    src,
    dest,
    parallel,
    series,
    watch
} = require('gulp');

// Load plugins

const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const changed = require('gulp-changed');
const browsersync = require('browser-sync').create();
const sassLint = require('gulp-sass-lint');

//  Clean assets

function clear() {
    return src('./assets/*', {
            read: false
        })
        .pipe(clean());
}

// JS function 

function js() {
    const source = './src/js/*.js';

    return src(source)
        .pipe(changed(source))
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest('./assets/js/'))
        .pipe(browsersync.stream());
}

// CSS function 

function css() {
    const source = './src/scss/style.scss';

    return src(source)
        .pipe(changed(source))
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(cssnano())
        .pipe(dest('./assets/css/'))
        .pipe(browsersync.stream());
}

// Copy HTML

function html() {
    return src('*.html')
    .pipe(dest('assets'))
    .pipe(browsersync.stream());
}

// Optimize images

function img() {
    return src('./src/images/*')
        .pipe(dest('./assets/images'))
        .pipe(browsersync.stream());
}

// Scss-Lint

function lint() {
    return src('./src/scss/**/*.s+(a|c)ss')
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
        .pipe(sassLint({
            configFile: 'sass-lint.yml'
        }))
        .pipe(browsersync.stream());
}

// Watch files

function watchFiles() {
    watch('./src/scss/*', css);
    watch('./src/js/*', js);
    watch('./src/images/*', img);
    watch('./src/scss/**/*.s+(a|c)ss', lint);
}

// BrowserSync

function browserSync() {
    browsersync.init({
        server: {
            baseDir: './'
        },
        port: 3000
    });
}

// Tasks to define the execution of the functions simultaneously or in series

exports.watch = parallel(watchFiles, browserSync);
exports.default = series(clear, parallel(html, js, css, img));