const { src, dest, watch, series, parallel } = require('gulp');
const browserSync = require('browser-sync').create();
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
const newer = require('gulp-newer');
const ttf2woff2 = require('gulp-ttf2woff2');
const svgstore = require('gulp-svgstore');

// СТИЛІ
function styles() {
  return src('app/scss/style.scss')
    .pipe(scss({ outputStyle: 'compressed' }).on('error', scss.logError))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
    .pipe(concat('style.min.css'))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}



// СКРИПТИ
function scripts() {
  return src([
    'node_modules/swiper/swiper-bundle.js',
    'app/js/main.js'
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}

// ЗОБРАЖЕННЯ
function images() {
  return src(['app/images/src/*.*', '!app/images/src/*.svg'])
    .pipe(newer('app/images'))
    .pipe(avif({ quality: 50 }))

    .pipe(src('app/images/src/*.*'))
    .pipe(newer('app/images'))
    .pipe(webp())

    .pipe(src('app/images/src/*.*'))
    .pipe(newer('app/images'))
    .pipe(imagemin())

    .pipe(dest('app/images'));
}

// СПРАЙТИ
function sprites() {
  return src('app/images/sprite/*.svg')
    .pipe(svgstore())
    .pipe(dest('app/images'));
}

// ШРИФТИ
function fonts() {
  return src('app/fonts/*.{ttf,woff,woff2}')
    .pipe(ttf2woff2()) // конвертує ttf у woff2
    .pipe(dest('app/fonts')) // залишає копії в app/fonts
    .pipe(dest('dist/fonts')); // одразу копіює у dist/fonts
}


// ЧИСТКА DIST
function cleanDist() {
  return del('dist');
}


// БІЛД
function build() {
  return src([
    'app/css/style.min.css',
    'app/images/**/*.*',
    'app/fonts/**/*.*',
    'app/js/main.min.js',
    'app/*.html',
  ], { base: 'app' })
    .pipe(dest('dist'));
}

// ВОТЧЕР
function watching() {
  browserSync.init({
    server: { baseDir: 'app' }
  });

  watch('app/scss/**/*.scss', styles);
  watch(['app/js/**/*.js', '!app/js/*.min.js'], scripts);
  watch('app/images/src/*.*', images);
  watch('app/images/sprite/*.*', sprites);
  watch('app/*.html').on('change', browserSync.reload);
}

// ЕКСПОРТИ
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.sprites = sprites;
exports.fonts = fonts;
exports.cleanDist = cleanDist;
exports.build = series(cleanDist, build);

exports.default = parallel(styles, images, sprites, scripts, fonts, watching);

