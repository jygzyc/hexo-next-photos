var photo = {
    page: 1,
    //offset 用于设置照片数量的上限
    offset: 1000,
    init: function () {
        var that = this;
        //这里设置的是刚才生成的 json 文件路径
        $.getJSON("/photos/figureBed.json ",
            function (data) {
                that.render(that.page, data);
            });
    },
    render: function (page, data) {
        var begin = page;
        var end = page * this.offset;
        if (begin >= data.length) return;
        var li = "";
        for (var i = begin; i < this.offset && i < data.length; i++) {
            li += '<div class="card" style="width: auto; break-inside: avoid; box-sizing: border-box;">' +
                '<div class="ImageInCard" style=" height: auto ">' +
                '<a data-fancybox="gallery" href="' + data[i] + '">' +
                '<img src="' + data[i] + '"/>' + '</a>' +
                '</div>' +
                '</div>';
            console.log(data[i]);
        }
        $(".ImageGrid ").append(li);
        $(".ImageGrid ").lazyload();
    }
};
photo.init();

