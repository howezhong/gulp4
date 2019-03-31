# 简介
```
基于gulp4.0的多页面自动化构建工具
```

# 功能
- scss 编译、压缩、兼容浏览器
- js、css 添加头部注释
- pug 语法写html
- gulp-file-include 语法写html
- js 压缩
- sourcemaps 地图
- images 压缩图片
- sprites 合并雪碧图
- watchs 自动监听文件变化
- serve 静态服务器
- clean 清楚文件和文件夹

# 安装gulp4.0版本
- [gulp 英文官网](https://gulpjs.com/)
- [gulp 中文官网](https://www.gulpjs.com.cn/)
```
npm install --global gulp-cli
npm install --save-dev gulp
gulp -v
```

# 入门指南
```
# clone the project
git clone https://github.com/howezhong/gulp4.git

// install dependencies
npm install

// develop
gulp
```

# 描述
```
1.字体文件fonts基本上都是经过优化的, 因此直接放assets/fonts里
2.依赖的类库(library)不处理
3.pug文件夹里是用pug格式编写的html, views里是html格式编写的html
4.fonts文件夹和library未做处理, 如需更删改查, 需要手动运行clean
5.直接使用import会报错, 识别不了, 因此需要进行babel
```
