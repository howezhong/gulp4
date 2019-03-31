// 要按顺序执行任务，请使用该series()方法 exports.default = series(css, html);
// 对于以最大并发性运行的任务，请将它们与parallel()方法结合使用 // series()并且parallel()可以嵌套到任意深度
// parallel(
//   cssTranspile,
//   series(jsTranspile, jsBundle)
// )

// var postcsswritesvg = require('postcss-write-svg') // 解决1px方案
// var plumber = require('gulp-plumber'); // gulp错误处理
// // 目前出视觉设计稿，我们都是使用750px宽度的，从上面的原理来看，那么100vw = 750px，即1vw = 7.5px
// var pxtoviewport = require('postcss-px-to-viewport'); // 代码中写px编译后转化成vm

/**
 * usemin 会自动把html里 <!-- build:js js/main.js --> 包裹起来的JS合并成一个JS，合并完的JS就是自定义的main(可随意改)
 * .pipe(sourcemaps.write('.')) // 会单独生成地图文件
 * .pipe(sourcemaps.write()) // 地图文件会和css在同一文件
 */

// 引入动态计算html font-size script
// @@include("../../components/flexible.html")


/**
 * 需要进一步改善的:
 * 怎么根据不同的雪碧图目录名称生成不同的雪碧图, 如home目录里的图标则生成的雪碧图名称为home.png; howe目录里的图片则生成howe.png
 */

// function serve() {
//   browserSync.init({
//     proxy: "你的域名或IP"
//   });
// }
