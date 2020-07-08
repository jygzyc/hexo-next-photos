# hexo-next-photos

中文说明请移步：[NexT主题插件hexo-next-photos](https://jygzyc.github.io/hexo/hexo-next-photos)

## Upgrade Instructions

- Now support the figure bed URL.
- Please follow the README and reinstall this package to asure the package running correctly.

## what is it

- This package achieves a waterfall album page for Hexo Next theme.

- Example: my blog: [https://jygzyc.github.io/photos](https://jygzyc.github.io/photos)
![result](img/result.jpg)

  
## How to use

### install

- do `npm install hexo-next-photos --save` command
- then you need to change your theme layout file and add the following content to that file depended on your render system

### set up body-end.swig

- If you have installed this package before, you should delete the following code in `/source/_data/body-end.swig`  
- If not, make sure the file exists.

```swig
{% if page.type ==='photos' %}
  <script src="/js/photo.js"></script>
{% endif %}
```

### set up styles.styl

- If you have installed this package before, you should delete the following code in `/source/_data/styles.styl`
- If not, make sure the file exists.

```styl
//album style
.ImageGrid {
  width: 100%;
  max-width:1040px;
  margin: 0 auto;
  text-align: center;
  column-count: 1;
  column-gap: 0;
}
@media (min-width: 500px) {
    .ImageGrid {
        column-count: 2; // two columns on larger phones
    }
    .card {
        break-inside: avoid;
        box-sizing: border-box;
        padding: 4px;
        border-radius: 8px;
        background-color: #ddd;
    }
}
@media (min-width: 800px) {
    .ImageGrid {
        column-count: 3; // two columns on larger phones
    }
    .card {
        break-inside: avoid;
        box-sizing: border-box;
        padding: 4px;
        border-radius: 8px;
        background-color: #ddd;
    }

}
.card {
  break-inside: avoid;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 4px;
  border-radius: 8px;
  background-color: #ddd;
}

.ImageInCard img {
  padding: 0 0 0 0;
  border-radius: 8px;
}
.TextInCard {
  background-color: rgba(255, 255, 255, 0.8);
  font-size: 70%;
  border-radius: 8px;
}
```

### _config.yml

- Add these config below to your _config.yml file(which under your blog root directory), and change your URL
- If you have installed the package before, please reset the config

```yml
# hexo-next-photos
hexo_next_photos:
  modes         : figureBed # or repository
  pictureUrl    :           # if repositry, please put your repos URL here
  pictureDirPath:           # the dir put your photos or linkList.txt file, default: Your blog path/pictureDir/ 
```

repositry example:
```yml
hexo_next_photos:
  modes:          repository
  pictureUrl:     https://dev.tencent.com/u/username/p/repos/git/raw/master/photos/ # photos url
  pictureDirPath: photoDir # photo dir path is 'Your blog path/photoDir/'
```

figure bed example:
```yaml
# hexo-next-photos
hexo_next_photos:
  modes         : figureBed 
  pictureUrl    : 
  pictureDirPath: testDir   # your linkList file is 'Your blog path/testDir/linkList.txt'
```

### next.yml

- Change your theme _config.yml(which under your blog theme directory)

```yml
custom_file_path:
-  #bodyEnd: source/_data/body-end.swig
+  bodyEnd: source/_data/body-end.swig
-  #style: source/_data/styles.styl
+  style: source/_data/styles.styl
...

# ---------------------------------------------------------------
# Third Party Plugins & Services Settings
# See: https://theme-next.org/docs/third-party-services/
# You may need to install dependencies or set CDN URLs in `vendors`
# There are two different CDN providers by default:
#   - jsDelivr (cdn.jsdelivr.net), works everywhere even in China
#   - CDNJS (cdnjs.cloudflare.com), provided by cloudflare
# ---------------------------------------------------------------
- fancybox: false
+ fancybox: true
...
- lazyload: false
+ lazyload: true
...

vendors:
  # FancyBox
  # jquery: //cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
  # fancybox: //cdn.jsdelivr.net/gh/fancyapps/fancybox@3/dist/jquery.fancybox.min.js
  # fancybox_css: //cdn.jsdelivr.net/gh/fancyapps/fancybox@3/dist/jquery.fancybox.min.css
  jquery:
  fancybox:  # choose a faster CDN
  fancybox_css: # choose a faster CDN

  # Lazyload
  # lazyload: //cdn.jsdelivr.net/npm/lozad@1/dist/lozad.min.js
  # lazyload: //cdnjs.cloudflare.com/ajax/libs/lozad.js/1.9.0/lozad.min.js
  lazyload: # choose a faster CDN

```

### add a new page and open it
- create a photos' page `hexo new page photos`，create `/source/photos/index.md`, insert the following code:

```md
---
title: Photos
type: photos
---
<div class="ImageGrid"></div>
```

- insert the following code into your _config.yml file(which under your blog theme directory)

```yml
menu:
+ photos: /photos/ || fa fa-camera
```

### linkList.txt file

- You should put the original image URL in this file, for example:

```txt
https://s1.ax1x.com/2020/05/21/YbueyT.jpg
https://s1.ax1x.com/2020/05/21/YbuZlV.jpg
https://s1.ax1x.com/2020/05/21/YbuVS0.jpg
https://s1.ax1x.com/2020/05/21/YbukYn.jpg
https://s1.ax1x.com/2020/05/21/YbuFFs.jpg
https://s1.ax1x.com/2020/05/21/YbuPoj.jpg
https://s1.ax1x.com/2020/05/21/YbuCwQ.jpg
https://s1.ax1x.com/2020/05/21/Ybu9eg.jpg
https://s1.ax1x.com/2020/05/21/YbuSOS.jpg
https://s1.ax1x.com/2020/05/21/Ybnzy8.jpg
https://s1.ax1x.com/2020/05/21/YbnxQf.jpg
https://s1.ax1x.com/2020/05/21/YbnvSP.jpg
https://s1.ax1x.com/2020/05/21/YbnXWt.jpg
```

## Some questions

- If there is some trouble, please contact me at my [blog](https://jygzyc.github.io/hexo/hexo-next-photos/)

## Thanks

[hexo-tag-cloud](https://github.com/MikeCoder/hexo-tag-cloud)


