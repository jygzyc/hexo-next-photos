var photo = {
    page: 1,
    //offset 用于设置照片数量的上限
    offset: 1000,
    init: function () {
        var that = this;
        //这里设置的是刚才生成的 json 文件路径
        $.getJSON("/photos/repository.json ",
            function (data) {
                that.render(that.page, data);
            });
    },
    render: function (page, data) {
        var begin = (page - 1) * this.offset;
        var end = page * this.offset;
        if (begin >= data.length) return;
        var html, imgNameWithPattern, imgName, imageSize, imageX, imageY, li = "";
        for (var i = begin; i < end && i < data.length; i++) {
            imgNameWithPattern = data[i].split(' ')[1];
            imgName = imgNameWithPattern.split('.')[0];
            imageSize = data[i].split(' ')[0];
            imageX = imageSize.split('.')[0];
            imageY = imageSize.split('.')[1];
            li += '<div class="card" style="width: 250px; break-inside: avoid; box-sizing: border-box;">' +
                '<div class="ImageInCard" style=" height:' + 250 * imageY / imageX + 'px">' +
                //href 和 src 的链接地址是相册照片外部链接，也可以放博客目录里
                '<a data-fancybox="gallery" href="https://cdn.jsdelivr.net/gh/jygzyc/blog_file/photos/' + imgNameWithPattern + '">' +
                '<img src="https://cdn.jsdelivr.net/gh/jygzyc/blog_file/photos/' + imgNameWithPattern + '"/>' +
                '</a>' +
                '</div>' +
                '<div class="TextInCard">' + imgName + '</div>' + //图片下显示文件名作为说明的功能
                '</div>'
        }
        $(".ImageGrid ").append(li);
        $(".ImageGrid ").lazyload();
    }
};
photo.init();
