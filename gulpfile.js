
const path = require("path");
const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass");
const clean = require("gulp-clean");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const htmlFormat = require("gulp-html-beautify");
const autoprefixer = require("autoprefixer");
const postcssNormalize = require("postcss-normalize");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");



// Sources:
const sourcesRoot = "src";
const sources = {
    root: sourcesRoot,
    typescript: `${sourcesRoot}/ts`,
    pug: `${sourcesRoot}/pug`,
    sass: `${sourcesRoot}/sass`,
    assets: `${sourcesRoot}/assets`,
};

// Targets:
const targetsRoot = "W:\\jannickelunde.eu\\www";
const targets = {
    wwwRoot: targetsRoot,
    files: `${targetsRoot}/files`,
};



const getWebpackConfig = function (entrypointFilename) {
    return {
        mode: "development",
        entry: path.resolve(__dirname, sources.typescript + "/" + entrypointFilename),
        devtool: "source-map",

        output: {
            filename: entrypointFilename + ".js",
            library: ["APP"],
            libraryTarget: "umd",
            umdNamedDefine: true
        },
        resolve: {
            extensions: [".ts"],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: {
                        loader: "awesome-typescript-loader",
                        options: { errorsAsWarnings: true }
                    },
                    include: path.resolve(__dirname, sources.typescript),
                }
            ]
        }
    };
}

const webpackTaskFn = function (entrypoint, watch = false) {
    const config = getWebpackConfig(entrypoint);
    config.watch = watch;

    return gulp.src(sources.typescript + "/" + entrypoint + ".ts")
        .pipe(webpackStream(config), webpack)
        .on("error", function handleError() { this.emit("end"); })
        .pipe(gulp.dest(targets.files));
}



gulp.task("watch-html-pug", ["html-pug"], function () {
    return gulp.watch(sources.pug + "/**/*.pug", ["html-pug"]);
});

gulp.task("html-pug", function () {
    return gulp.src(sources.pug + "/**/*.pug")
        .pipe(pug({}))
        .pipe(htmlFormat())
        .pipe(gulp.dest(targets.wwwRoot));
});

gulp.task("watch-assets", ["assets"], function () {
    return gulp.watch(sources.assets + "/**/*", ["assets"]);
});

gulp.task("assets", function () {
    return gulp.src(sources.assets + "/**/*")
        .pipe(gulp.dest(targets.files));
});

gulp.task("watch-css-sass", ["css-sass"], function () {
    return gulp.watch(sources.sass + "/**/*.scss", ["css-sass"]);
});

gulp.task("css-sass", function () {
    return gulp.src(sources.sass + "/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: "compact" }).on("error", sass.logError))
        .pipe(postcss([ postcssNormalize(), autoprefixer() ]))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(targets.files));
});

gulp.task("webpack", function() {
    return webpackTaskFn("entrypoint");
});

gulp.task("watch-webpack", function() {
    return webpackTaskFn("entrypoint", true);
});

gulp.task("clean", function () {
    return gulp.src(targets.wwwRoot + "**/*", { read: false })
        .pipe(clean());
});



gulp.task("watch-all", ["clean"], function () {
    gulp.start("watch-assets");
    gulp.start("watch-html-pug");
    gulp.start("watch-css-sass");
    //gulp.start("watch-webpack");
});

gulp.task("run-all", ["clean"], function () {
    gulp.start("assets");
    gulp.start("html-pug");
    gulp.start("css-sass");
    //gulp.start("webpack");
});
