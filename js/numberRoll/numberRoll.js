/**
 * 数字滚筒组件
 *
 * Created by lWX242305 on 2015/4/21.
 */
(function ($) {

    var p = {
        length: 10,
        value: 0,
        maxValue: 1e+15,
        speed: 2000,
        lastValue: 0
    };

    var g = {

        /**
         * 获取组件根路径
         * @private
         */
        _path: function () {
            var path, idx, sList = document.getElementsByTagName("script");
            for (var i = 0; i < sList.length; i++) {
                path = sList[i].getAttribute("src");
                if (path) {
                    path = path.substr(0, path.toLowerCase().indexOf("numberroll.js"));
                    idx = path.lastIndexOf("/");
                    if (idx > 0)
                        path = path.substring(0, idx + 1);
                    if (path)
                        break;
                }
            }
            p.path = path;
        },

        /**
         * 创建DOM结构
         * @param context
         * @param p
         */
        _create: function (context, p) {
            this._path();

            var num = this._number(p);
            var len = Math.max(num.length, p.length);
            var ul = $('<ul></ul>').css({margin: '-1px 0', padding: 0});

            for (var i = 0; i < len; i++) {
                ul.prepend(this._createItem(p.path, i == len - 1, i == 0, Msg.unit.numberUnit[i]));
            }

            $(context).html(ul);
        },

        /**
         * 创建单个数字筒
         * @param path
         * @param isFirst 是否第一个
         * @param isLast 是否最后一个
         * @param unit 单位
         * @returns {HTMLLIElement}
         * @private
         */
        _createItem: function (path, isFirst, isLast, unit) {
            var li = $('<li></li>').css({
                'float': 'left', position: 'relative', width: 35, height: 29, 'overflow': 'hidden',
                'background': 'url(' + path + 'images/' + (isLast ? '9-0' : isFirst ? '1-0' : '2-0') + '.png) 0 0 no-repeat',
                'border-top': '2px solid #323232'
            });
            var div = $("<div/>").css({'position': 'absolute', 'width': '30px', 'height': '560px', 'margin': '0 2px'});
            var img_a = $('<img src="' + path + 'images/' + (isLast ? '1-2' : '1-1') + '.png" border="0" />')
                .attr({'title': unit, 'alt': '0'})
                .css({'position': 'relative', 'height': 280, display: 'block'});

            var img_b = $('<img src="' + path + 'images/' + '1-2' + '.png" border="0" />')
                .attr({'title': unit, 'alt': '0'})
                .css({'position': 'relative', 'height': 280, display: 'block'});

            div.append(img_a, img_b);
            li.append(div);
            return li;
        },

        /**
         * 赋值
         * @param context
         * @param p
         */
        _set: function (context, p) {

            var num = this._number(p, 'value');
            var preNum = this._number(p, 'lastValue');
            var nlen = num.length;
            var preNumLen = preNum.length;
            var len = Math.max(nlen, p.length);
            for (var j = 0; j < len - nlen; j++) {
                num = "0" + num;
            }
            for (var k = 0; k < len - preNumLen; k++) {
                preNum = "0" + preNum;
            }
            var ul = $('ul', $(context));
            var li = $('li', $(context));
            if (len > li.length) {
                li.eq(0).find('img').attr('src', p.path + 'images/1-1.png').end()
                    .css({'background': 'url(' + p.path + 'images/2-0.png) 0 0 no-repeat'});
                for (var k = 0; k < len - li.length; k++) {
                    ul.prepend(this._createItem(p.path, k == len - li.length - 1, false, Msg.unit.numberUnit[k + li.length]));
                }
            }
            else if (len < li.length) {
                var diff = li.length - len;
                for (var t = 0; t < diff; t++) {
                    li.eq(t).remove();
                }
                $('li', $(context)).eq(0).find('img').attr('src', p.path + 'images/1-2.png').end()
                    .css({'background': 'url(' + p.path + 'images/1-0.png) 0 0 no-repeat'});
            }
            for (var i = len - 1; i >= 0; i--) {
                // var n = num[i];
                var numObj = g._compareNumber(preNum[i], num[i]);
                var n = numObj.crossNum;
                var img = $('li', $(context)).eq(i).find('img');

                var imgDiv = img.parent('div');
                if (i > len - nlen - 1) {
                    $(img[0]).attr("src", p.path + 'images/1-2.png');
                    $(img[1]).attr("src", p.path + 'images/1-2.png');
                }
                else {
                    $(img[0]).attr("src", p.path + 'images/1-1.png');
                    $(img[1]).attr("src", p.path + 'images/1-1.png');
                }
                var divTop = parseInt(imgDiv.css('top')) ? parseInt(imgDiv.css('top')) : 0;
                if (divTop <= -280) {
                    imgDiv.css('top', divTop + 280 + "px");
                }
                imgDiv.stop(true, true).animate({'top': n ? -28 * n : 0}, p.speed);
            }

            p.lastValue = p.value;
        },

        /**
         * 传递数值域处理
         * @param p
         * @param property
         * @returns {string}
         * @private
         */
        _number: function (p, property) {
            var num = '0';
            if (Number(p[property])) {
                if (Number(p[property]) < 0) {
                    num = '0';
                }
                else if (Number(p[property]) < Number(p.maxValue)) {
                    num = Number(p[property]).toString();
                }
                else {
                    num = (Number(p.maxValue) - 1).toString();
                }
            }
            return num;
        },

        /**
         * 将前后两个值进行比较
         * @param  {String} preValue 前一个数字
         * @param  {String} value 当前数字
         * @return {Object}
         */
        _compareNumber: function (preValue, value) {
            var pre = parseInt(preValue) ? parseInt(preValue) : 0;
            var cur = parseInt(value) ? parseInt(value) : 0;

            if (pre < cur) {
                return {
                    isCross: false, //是否需要转到第二张图片
                    crossNum: cur //相差的数量
                }
            } else if (pre == cur) {
                return {
                    isCross: false, //是否需要转到第二张图片
                    crossNum: cur //相差的数量
                }
            } else {
                return {
                    isCross: true,
                    crossNum: 10 + cur
                }
            }
        }
    };

    /**
     * 创建数字滚筒
     * @param option
     */
    $.fn.numberRoll = function (option) {
        this.each(function () {
            p = $.extend({}, p, option);

            g._create($(this), p);
            g._set($(this), p);
        });
    };

    /**
     * 数字滚筒刷新
     * @param option
     */
    $.fn.numberRollRefresh = function (option) {
        this.each(function () {
            var np = $.extend(p, option);
            g._set($(this), np);
        });
    };

})(jQuery);