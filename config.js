/*jshint esversion: 6 */
// 输入路径 input src/temp/*.pug

let srcPath = {
  pug: ['src/pug/**/*.pug', '!src/pug/layout/**/*.pug', '!src/pug/widget/**/*.pug'],
  html: ['src/views/**/*.html', '!src/views/header/**/*', '!src/views/footer/**/*'],
  css: ['src/sass/**/*.scss', '!src/sass/layout/**/*', '!src/sass/utilities/**/*', '!src/sass/mixins/**/*'],
  script: ['src/js/**/*.js', '!src/js/common/**/*', '!src/js/utils/**/*'],
  image: ['src/images/**/*.+(png|jpg|jpeg|gif|svg)', '!src/images/sprite/**/*']
};

// 输出路径 output
let destPath = {
  pug: 'dist/html/',
  html: 'dist/views/',
  css: 'dist/assets/css/',
  script: 'dist/js/',
  image: 'dist/assets/images'
};

// 雪碧图 sprite sheet
let spriteConfig = {
  srcPath: 'src/images/sprite',
  isOpen: true, // 是否开启合并雪碧图
  url: '../images/sprite/', // 雪碧图CSS的background-image图片路径
  image: 'dist/assets/images/sprite',
  css: 'src/sass/sprite'
};

export {
  srcPath,
  destPath,
  spriteConfig
};
