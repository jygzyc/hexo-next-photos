"use strict";

var fs = require("hexo-fs");
var sizeOf = require("image-size");
var pathFn = require("path");
var Hexo = require("hexo");
var log = require("hexo-log")({
  debug: false,
  silent: false
});
var fss = require("fs");

hexo.extend.filter.register("after_generate", function(post) {

  var photoPubPath = pathFn.join(
    pathFn.join(hexo.public_dir, "js"),
    "photo.js"
  );
  var originPhotoDir = pathFn.join(hexo.base_dir, "originPhotos");

  var targetPhotosListDir = pathFn.join(
    pathFn.join(hexo.public_dir, "photos"),
    "photoslist.json"
  );

  log.info("---- START COPYING PHOTO FILES ----");

  var thumbnailUrl = "";
  var photoUrl = "";
  var photoDir = originPhotoDir;

  if (hexo.config.hexo_next_photos) {
    if (hexo.config.hexo_next_photos.photoDir) {
      photoDir = hexo.config.hexo_next_photos.photoDir;
    }
    if (hexo.config.hexo_next_photos.thumbnailUrl) {
      thumbnailUrl = hexo.config.hexo_next_photos.thumbnailUrl;
    }
    if (hexo.config.hexo_next_photos.photoUrl) {
      photoUrl = hexo.config.hexo_next_photos.photoUrl;
    }
  }

  try {
    var arr = [];
    const originPath = photoDir;
    const output = targetPhotosListDir;
    (function test(path) {
      const files = fss.readdirSync(path);
      if (!files.length) return;
      files.forEach(v => {
        const vPath = path + "/" + v;
        const stats = fss.statSync(vPath);
        if (stats.isFile()) {
          const imgSize = sizeOf(vPath);
          arr.push(
            imgSize.width +
              "." +
              imgSize.height +
              " " +
              vPath.replace(originPath + "/", "")
          );
        } else {
          test(vPath);
        }
      });
    })(originPath);
    var content = JSON.stringify(arr, null, "\t");
    fs.writeFile(output, content);
  } catch (err) {
    log.info(err);
  }

  var photoJsContent =
    "var photo = {\n" +
    "   page: 1,\n" +
    "   //offset 用于设置照片数量的上限\n" +
    "   offset: 1000,\n" +
    "   init: function () {\n" +
    "       var that = this;\n" +
    "       //这里设置的是刚才生成的 json 文件路径\n" +
    '       $.getJSON("/photos/photoslist.json ", \n' +
    "       function (data) {\n" +
    "           that.render(that.page, data);\n" +
    "       });\n" +
    "   },\n" +
    "   render: function (page, data) {\n" +
    "       var begin = (page - 1) * this.offset;\n" +
    "       var end = page * this.offset;\n" +
    "       if (begin >= data.length) return;\n" +
    '       var html, imgNameWithPattern, imgName, imageSize, imageX, imageY, li = "";\n ' +
    "       for (var i = begin; i < end && i < data.length; i++) {\n" +
    "           imgNameWithPattern = data[i].split(' ')[1];\n" +
    "           imgName = imgNameWithPattern.split('.')[0];\n" +
    "           imageSize = data[i].split(' ')[0];\n" +
    "           imageX = imageSize.split('.')[0];\n" +
    "           imageY = imageSize.split('.')[1];\n" +
    '           li += \'<div class="card" style="width: 250px; break-inside: avoid; box-sizing: border-box;">\' +\n' +
    "               '<div class=\"ImageInCard\" style=\" height:' + 250 * imageY / imageX + 'px\">' + \n" +
    "               //href 和 src 的链接地址是相册照片外部链接，也可以放博客目录里\n" +
    "               '<a data-fancybox=\"gallery\" href=\"${thumbnailUrl}' + imgNameWithPattern + '\">' +\n" +
    "               '<img src=\"${photoUrl}' + imgNameWithPattern + '\"/>' +\n" +
    "               '</a>' +\n" +
    "               '</div>' +\n" +
    "               '<div class=\"TextInCard\">' + imgName + '</div>' + //图片下显示文件名作为说明的功能\n" +
    "               '</div>'\n" +
    "       }\n" +
    '       $(".ImageGrid ").append(li);\n' +
    '       $(".ImageGrid ").lazyload();\n' +
    "   }\n" +
    "};\n" +
    "photo.init();\n";

  photoJsContent = photoJsContent.replace("${thumbnailUrl}", thumbnailUrl);
  photoJsContent = photoJsContent.replace("${photoUrl}", photoUrl);
  fs.writeFile(photoPubPath, photoJsContent);
  log.info(" ---- END COPYING PHOTO FILES ----");
});
