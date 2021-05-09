const { src, dest, series, parallel } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const clean = require('gulp-clean');
const postcss = require('gulp-postcss');
const htmlFormat = require('gulp-html-beautify');
const postcssNormalize = require('postcss-normalize');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');

// Sources:
const sourcesRoot = 'src';
const sources = {
    root: sourcesRoot,
    pug: `${sourcesRoot}/pug`,
    sass: `${sourcesRoot}/sass`,
    assets: `${sourcesRoot}/assets`,
};

// Targets:
const wwwRoot = 'D:\\CodeDev\\GitHubRepos\\cv\\dist\\www';


const compilePugToHtml = () =>
    src([
        sources.pug + '/**/*.pug',
        '!' + sources.pug + '/parts/**',
    ])
        .pipe(pug({}))
        .pipe(htmlFormat())
        .pipe(dest(wwwRoot));

const copyStaticAssets = () =>
    src(sources.assets + '/**/*')
        .pipe(dest(wwwRoot));

const compileSassToCss = () =>
    src(sources.sass + '/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compact' }).on('error', sass.logError))
        .pipe(postcss([postcssNormalize(), autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(wwwRoot));

function defaultTask(cb) {
    cb();
}

exports.default = defaultTask;
exports.build = parallel(
    copyStaticAssets,
    compileSassToCss,
    compilePugToHtml,
);
