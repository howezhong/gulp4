/*jshint esversion: 6 */
import {
  src,
  dest,
  lastRun,
  watch,
  series,
  parallel
} from 'gulp';
import fs from 'fs'
import path from 'path'
// import browserSync from 'browser-sync';
import connect from 'gulp-connect';
import pug from 'gulp-pug';
import plumber from 'gulp-plumber';
import htmlmin from 'gulp-htmlmin';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
// import concat from 'gulp-concat'; // 文件合并
import uglify from 'gulp-uglify'; // 压缩js
import rename from 'gulp-rename';
import imagemin from 'gulp-imagemin';
import spritesmith from 'gulp.spritesmith';
import buffer from 'vinyl-buffer'; // 合并雪碧图分开存css和img 不支持 merge流，因此要此插件就可以支持
import merge from 'merge-stream'; // 合并流
import changed from 'gulp-changed'; // 只操作有过修改的文件
import del from 'del';
import fileinclude from 'gulp-file-include';
import header from 'gulp-header'; // 给文件头部添加注释
// const reload = browserSync.reload;
// 配置文件
import {
  srcPath,
  destPath,
  spriteConfig
} from './config';

function css(cb) {
  src(srcPath.css)
    .pipe(sourcemaps.init())
    .pipe(sass.sync({
      outputStyle: 'expanded' // compressed(压缩) expanded(扩展) compact(紧凑) nested(嵌套)
    }).on('error', function (err) {
      console.error('Error!', err.message); // 显示错误信息
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', '> 5%', 'ie >= 8'],
      cascade: true, // 是否美化格式 默认：true 像这样：
      //-webkit-transform: rotate(45deg);
      //        transform: rotate(45deg);
      remove: false // 是否删除不必要的前缀 默认：true
    }))
    .pipe(dest(destPath.css))
    .pipe(sass.sync({
      outputStyle: 'compressed'
    }).on('error', function (err) {
      console.error('Error!', err.message);
    }))
    .pipe(headNote())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(sourcemaps.write('../../../cache'))
    .pipe(dest(destPath.css))
    // .pipe(reload({
    //   stream: true
    // }));
    .pipe(connect.reload());
  cb();
}

function pugTohtml(cb) {
  src(srcPath.pug)
    .pipe(plumber(function (error) { // 编译出错不断流
      console.log(error);
    }))
    .pipe(pug({
      pretty: true // 取消压缩
    }))
    .pipe(htmlmin({
      removeComments: false, // 清除HTML注释
      collapseWhitespace: false, // 压缩HTML
      collapseBooleanAttributes: false, // 省略布尔属性的值 <input checked="true"/> ==> <input />
      removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
      removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
      removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
      minifyJS: false, // 压缩页面JS
      minifyCSS: false, // 压缩页面CSS
      minifyURLs: false
    }))
    .pipe(changed(destPath.pug))
    .pipe(dest(destPath.pug))
    // .pipe(reload({
    //   stream: true
    // }));
    .pipe(connect.reload());
  cb();
}

function html(cb) {
  src(srcPath.html)
    .pipe(plumber(function (error) {
      console.log(error);
    }))
    .pipe(fileinclude({
      // prefix: '@@', //变量前缀 @@include 默认@@
      // basepath: '@file', //引用文件路径 默认@file
      indent: true // 保留缩进
    }))
    .pipe(dest(destPath.html))
    // .pipe(reload({
    //   stream: true
    // }));
    .pipe(connect.reload());
  cb();
}

function script(cb) {
  src(srcPath.script, {
      sourcemaps: true
    })
    .pipe(changed(destPath.script))
    .pipe(babel())
    .pipe(dest(destPath.script)) // 返回未压缩的
    // 将文件添加到流中
    // .pipe(src('vendor/*.js'))
    .pipe(uglify({
      // mangle: true, //类型：Boolean 默认：true 是否修改变量名
      // compress: true, //类型：Boolean 默认：true 是否完全压缩
      // preserveComments: 'all' //保留所有注释
    })) // 压缩
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('../../../cache'))
    .pipe(dest(destPath.script))
    // .pipe(reload({
    //   stream: true
    // }));
    .pipe(connect.reload());
  cb();
}

// 合并文件
// function concat(cb) {
//   src(srcPath.script) // 要合并的文件
//     .pipe(concat('libs.js')) // 合并成libs.js
//     .pipe(rename({
//       suffix: '.min'
//     })) // 重命名
//     .pipe(dest(destPath.script)); // 输出路径
//   cb();
// }

/**
 * lastRun
 * 检索在当前运行过程中上次成功完成任务的时间。在观察程序运行时, 对后续任务运行最有用
 * 与之结合使用时src(), 通过跳过自上次成功完成任务以来未更改的文件, 启用增量构建以加快执行时间
 */
function images(cb) {
  src(srcPath.image, {
      since: lastRun(images)
    })
    .pipe(changed(destPath.image))
    .pipe(imagemin({
      optimizationLevel: 3, // 类型：Number 默认：3 取值范围：0-7（优化等级）
      progressive: true, // 类型：Boolean 默认：false 无损压缩jpg图片
      interlaced: true, // 类型：Boolean 默认：false 隔行扫描gif进行渲染
      multipass: true, // 类型：Boolean 默认：false 多次优化svg知道完全优化
      svgoPlugins: [{
        removeViewBox: false
      }] // 不要移除svg的viewbox属性
    }))
    .pipe(dest(destPath.image))
    // .pipe(reload({
    //   stream: true
    // }));
    .pipe(connect.reload());
  cb();
}

// 同步获得文件夹
function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function (file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

function imgToSprites(path, filename) {
  let spriteData = src(path) //需要合并的图片地址
    .pipe(spritesmith({
      imgName: `${filename}.png`, // 输出名字
      cssName: `${filename}.scss`,
      padding: 5, // 合并时两个图片的间距
      cssFormat: 'scss', // 输出格式 css scss sass stylus less, 默认css
      algorithm: 'binary-tree', // 排列方式
      //cssTemplate: 'scss.handlebars'//模板文件（相对于gulpfile的位置）
      cssTemplate: item => {
        let arr = [];
        item.sprites.forEach((e) => {
          arr.push('.icon-' + e.name + '{' +
            'background: url(' + spriteConfig.url + e.escaped_image + ') no-repeat;' +
            'background-position: ' + e.px.offset_x + ' ' + e.px.offset_y + ';' +
            'width:' + e.px.width + ';' +
            'height:' + e.px.height + ';' +
            'display: inline-block;' +
            '}\n');
        });

        // 2倍图
        // arr.push('.icon-' + e.name + '{' +
        //   'background-image: url(' + spriteConfig.url + e.escaped_image + ');' +
        //   'background-size:' + (parseFloat(e.px.total_width) / 2) + 'px ' + (parseFloat(e.px.total_height) / 2) + 'px;' +
        //   'background-position: ' + (parseFloat(e.px.offset_x) / 2) + 'px ' + (parseFloat(e.px.offset_y) / 2) + 'px;' +
        //   'width:' + (parseFloat(e.px.width) / 2) + 'px;' +
        //   'height:' + (parseFloat(e.px.height) / 2) + 'px;' +
        //   '}\n');

        return arr.join('');
      }
    }));

  let imgStream = spriteData.img
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(dest(spriteConfig.image));

  let cssStream = spriteData.css
    .pipe(dest(spriteConfig.css))
    .pipe(connect.reload());
  // .pipe(reload({
  //   stream: true
  // }));

  return merge(imgStream, cssStream);
}

// 合并雪碧图
function sprites(cb) {
  if (spriteConfig.isOpen) {
    let folders = getFolders(spriteConfig.srcPath);
    imgToSprites(`${spriteConfig.srcPath}/*.png`, 'sprite')
    // 按文件夹分开合并其雪碧图
    if (folders) {
      for (let i = 0, len = folders.length; i < len; i++) {
        imgToSprites(`${spriteConfig.srcPath}/${folders[i]}/*.png`, folders[i])
      }
    }
  }
  cb();
}

function watchs(cb) {
  watch('src/sass/**/*.scss', css);
  watch('src/pug/**/*.pug', pugTohtml);
  watch('src/views/**/*.html', html);
  watch('src/js/**/*.js', script);
  watch('src/images/**/*.+(png|jpg|jpeg|gif|svg)', {
    // events: 'all', // 查看事件属性
    // ignoreInitial: false, // 在调用时watch(), 任务不会执行, 而是等待第一次文件更改了才会执行, 因此设置false后一运行就会执行
    // queue: true, // 每个都watch()保证其当前运行的任务不会同时再次执行, 禁用排队 false, 默认true
    // delay: 200 // 延迟执行, 默认200
  }, series(images, sprites));
  cb();
}

// 架设静态服务器
function serve(cb) {
  // browserSync({
  //   files: ['**'],
  //   // server: {
  //   //   baseDir: './', // 设置服务器的根目录
  //   //   // index: '' // 指定默认打开的文件
  //   // },
  //   open: false, // 停止自动打开浏览器
  //   server: true
  //   // prot: 3001 // 默认3000
  // });

  connect.server({
    root: '',
    livereload: true
  });
  cb();
}

// 用来在压缩后的JS、CSS文件中添加头部注释
function headNote() {
  let pkg = require('./package.json');
  let template = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @authors <%= pkg.authors %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''
  ].join('\n');
  return header(template, {
    pkg: pkg
  });
}

// 清空删除, 默认不删除 library 和 images下的fonts文件
export const clean = () => del(['./cache', 'dist/assets/css', 'dist/assets/images', 'dist/js', 'dist/views', 'dist/html']);

exports.default = series(
  css,
  pugTohtml,
  html,
  script,
  parallel(images, sprites),
  watchs,
  serve
);
