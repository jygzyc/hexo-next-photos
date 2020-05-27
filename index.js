"use strict";
// --------------------> config
var config = hexo.config.hexo_next_photos = Object.assign({
  modes: '', /*figureBed or reposirty*/
  pictureUrl: '',
  pictureDirPath: '' /*put your photos or linkList.txt file */
}, hexo.config.hexo_next_photos);

//---------------------> Init
var _ = require('lodash');
var pathFn = require("path");
var log = require("hexo-log")({
  debug: false,
  silent: false
});

if (!hexo.config.hexo_next_photos) {
  log.info(
    "hexo-next-photos not config in _config.yml, use default config!\nPlease visit https://github.com/jygzyc/hexo-next-photos for more information");
}
// target dir
var targetPhotoListDir = pathFn.join(hexo.public_dir, "photos");

var pictureUrl = hexo.config.hexo_next_photos.pictureUrl;

//default path: ./Your blog/pictureDir/
var pictureDirPath = pathFn.join(hexo.base_dir, "pictureDir");

if (hexo.config.hexo_next_photos.modes) {
  var modes = hexo.config.hexo_next_photos.modes;
  // different modes
  if (modes == 'figureBed') {
    targetPhotoListDir = pathFn.join(
      targetPhotoListDir, 'figureBed.json');
    if (hexo.config.hexo_next_photos.pictureDirPath) {
      pictureDirPath = hexo.config.hexo_next_photos.pictureDirPath;
    }
    var figureBedLinkFilePath = pathFn.join(pictureDirPath, 'linkList.txt');

  } else if (modes == 'repository') {
    targetPhotoListDir = pathFn.join(
      targetPhotoListDir, 'repository.json');

    if (hexo.config.hexo_next_photos.pictureDirPath) {
      pictureDirPath = hexo.config.hexo_next_photos.pictureDirPath;
    }
  }
  var photoPubPath = pathFn.join(
    pathFn.join(hexo.public_dir, "js"),
    "photo.js");
}
// --------------------> Generator

var fs = require("hexo-fs");
var sizeOf = require("image-size");


//-----------
//generate different modes
//-----------

// check album setting
function checkSetting() {
  var styleLibPath = pathFn.join(__dirname, "lib/photo.styl");
  var swigLibPath = pathFn.join(__dirname, "lib/photo.swig");
  var cusStylePath = pathFn.join(hexo.source_dir, "_data/styles.styl");
  var cusBodyEndPath = pathFn.join(hexo.source_dir, "_data/body-end.swig");
  log.info("---- START DETECTING SETTING FILES ----");
  try {
    if (fs.statSync(cusStylePath).isFile()) {
      var styleStr = fs.readFileSync(cusStylePath);
      if (styleStr.search("ALBUM STYLE SETTING") == -1) {
        log.info("---- START GENERATING CSS SETTING FILES ----");
        var styleTemp = fs.readFileSync(styleLibPath);
        fs.appendFileSync(cusStylePath, styleTemp);
        log.info("---- END GENERATING CSS SETTING FILES ----");
      } else {
        log.info("---- CSS SETTING FILES EXISTS----");
      }
    }
    if (fs.statSync(cusBodyEndPath).isFile()) {
      var swStr = fs.readFileSync(cusBodyEndPath);
      if (swStr.search("ALBUM JS SETTING") == -1) {
        log.info("---- START GENERATING JS SETTING FILES ----");
        var JsTemp = fs.readFileSync(swigLibPath);
        fs.appendFileSync(cusBodyEndPath, JsTemp);
        log.info("---- END GENERATING JS SETTING FILES ----");
      } else {
        log.info("---- JS SETTING FILES EXISTS----");
      }
    }
  } catch (e) {
    log.info(e);
  }
  log.info("---- END DETECTING SETTING FILES ----");
}

checkSetting();

if (modes == 'reposirty') {
  reposirtyGen();

} else if (modes == 'figureBed') {
  figureBedGen();
}

// figureBed Generate 
// return figureBed.json
function figureBedGen() {
  hexo.extend.filter.register("after_generate", function () {
    log.info("---- START GENERATING PICTURE FILES ----");
    try {
      var arr = [];
      const LinkFilePath = figureBedLinkFilePath;
      const output = targetPhotoListDir;
      (function toJson(path) {
        let linklistfile = fs.readFileSync(path);
        var cache = linklistfile.toString().split('\n');
        if (!cache) {
          log.info("LinkList file is empty!");
          return;
        }
        var content = JSON.stringify(cache, null, "\t");
        fs.writeFile(output, content);
      })(LinkFilePath);
    } catch (err) {
      log.info(err);
    }
    var photojslibPath = pathFn.join(__dirname, "lib/figureBed.js");
    var photoJsContent = fs.readFileSync(photojslibPath);
    fs.writeFile(photoPubPath, photoJsContent);
    log.info("---- END GENERATING PICTURE FILES ----");
  });

}

// Reposirty Generate 
// from "hexo-next-photos" plugin
function reposirtyGen() {
  hexo.extend.filter.register("after_generate", function (picture) {
    log.info("---- START GENERATING PICTURE FILES ----");
    try {
      var arr = [];
      const originPath = pictureDirPath;
      const output = targetPhotoListDir;
      (function test(path) {
        const files = fs.readdirSync(path);
        if (!files.length) return;
        files.forEach(v => {
          const vPath = path + "/" + v;
          const stats = fs.statSync(vPath);
          if (stats.isFile()) {
            const imgSize = sizeOf(vPath);
            arr.push(imgSize.width + "." +
              imgSize.height + " " +
              vPath.replace(originPath + "/", ""));
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
    var photojslibPath = pathFn.join(__dirname, "lib/repos.js");
    var photoJsContent = fs.readFileSync(photojslibPath);
    photoJsContent = photoJsContent.replace("${thumbnailUrl}", pictureUrl);
    photoJsContent = photoJsContent.replace("${pictureUrl}", pictureUrl);
    fs.writeFile(photoPubPath, photoJsContent);
    log.info("---- END GENERATING PICTURE FILES ----");
  });
}
