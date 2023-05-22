const { src, dest, series, parallel, watch } = require("gulp");
const sass = require("gulp-sass")(require("node-sass"));
const postcss = require("gulp-postcss");
const postcssNormalize = require("postcss-normalize");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("autoprefixer");

// Sources:
const sourcesRoot = "src";
const sources = {
  root: sourcesRoot,
  sass: `${sourcesRoot}/sass`,
  www: `${sourcesRoot}/www`,
};

// Targets:
const wwwRoot = "./dist/www";

const copyStaticAssets = () => src(sources.www + "/**/*").pipe(dest(wwwRoot));

const compileSassToCss = () =>
  src(sources.sass + "/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compact" }).on("error", sass.logError))
    .pipe(postcss([postcssNormalize(), autoprefixer()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest(wwwRoot + "/files"));

function defaultTask(cb) {
  cb();
}

const buildTask = parallel(copyStaticAssets, compileSassToCss);

const watchTask = () => {
  watch([sources.root + "/**/*"], buildTask);
};

exports.default = defaultTask;
exports.build = buildTask;
exports.watch = series(buildTask, watchTask);
