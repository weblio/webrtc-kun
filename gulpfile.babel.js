"use strict";

import gulp from "gulp";
import webserver from "gulp-webserver";
import path from "path";
import pug from "gulp-pug";
import inline_source from "gulp-inline-source";
import rename from "gulp-rename";
import webpack from "webpack";
import sass from "gulp-sass";

gulp.task("start", () => {
    const dist = path.resolve("dist");
	gulp.src(dist)
		.pipe(webserver({
			livereload: true,
			directoryListing: false,
			open: true,
		}));
});

gulp.task("build", ["build-js", "build-css"], () => {
    gulp.start("build-html");
});

gulp.task("build-html", () => {
    const src = path.resolve("src");
    const dist = path.resolve("dist");

    // ミニファイして出力
    gulp.src(path.join(src, "*.pug"))
        .pipe(pug({pretty: false}))
        .pipe(gulp.dest(dist))

        // CSS/JSを埋め込む
        .pipe(inline_source())
        .pipe(rename({suffix: ".bundle"}))
        .pipe(gulp.dest(dist));
});

gulp.task("build-js", (callback) => {
    const src = path.resolve("src", "js");
    const dist = path.resolve("dist", "js");
    const config = {
        entry: {
            "script": "script.es",
        },
        resolve: {
            modules: [
                src,
                "node_modules",
            ],
        },
        output: {
            path: dist,
            filename: "[name].min.js",
        },
        module: {
            loaders: [
                {
                    test: /\.es/,
                    loader: "babel-loader",
                    query: {
                        presets: [
                            ["env", {
                                "targets": {
                                    ie: 9,
                                    firefox: 30,
                                    chrome: 50,
                                },
                            }],
                        ],
                    },
                },
            ],
        },
        plugins: [
            new webpack.optimize.AggressiveMergingPlugin(),
            new webpack.optimize.UglifyJsPlugin(),
        ],
        devtool: "source-map",
    };

    webpack(config, (err, stats) => {
        console.log(stats.toString({colors: true}));
        callback();
    });
});

gulp.task("build-css", () => {
    const src = path.resolve("src", "css");
    const dist = path.resolve("dist", "css");
    const options = {
        // nested, expanded, compact, compressed
        outputStyle: "compressed",
    };

    gulp.src(path.join(src, "**", "*.s[ac]ss"))
        .pipe(sass(options))
        .pipe(gulp.dest(dist));
});
