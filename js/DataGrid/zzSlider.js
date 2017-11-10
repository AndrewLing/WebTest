(function ($) {
    var flipTimer = null;
    /**
     * 动态数据分页
     * @param options {Object}
     *  pageSize:{int} 每页显示条数
     *  isFlip:{Boolean} 是否自动翻页
     *  flipDelay:{Number} 每页停留时间(毫秒，默认3500毫秒)
     */
    $.fn.zzSlider = function (options) {
        var flipId = 0; // 当前页序列
        var flipCount = 1; // 总页数
        var init = true; // 是否初始化所有页面

        var opts = $.extend({
            url: '',
            width: 1090,
            height: 785,
            pageSize: 10,
            isFlip: true,
            flipDelay: 3500,
            populate: function (dom, data) {
                dom.html(JSON.stringify(data));
                return false;
            }
        }, options);
        var $this = $(this);
        var nw = $this.width() || opts.width;
        var nh = $this.height() || opts.height;
        $this.css({"overflow": "hidden", "position": "relative"});
        $this.append('<div class="slide_conn"><div class="slide_main"></div></div><div class="slide_page"></div>');
        $(".slide_conn", $this).css({"width": nw, "height": nh, "overflow": "hidden"});

        var createPage = function (curIndex) {
            $.omcAjax(opts.url, {rp: curIndex + 1, size: opts.pageSize}, function (data) {
                var page = 1;
                var prlist = [];
                if (data.success) {
                    page = data.data.pageCount;
                    prlist = data.data.list;
                }

                if(init) {
                    drawPage(flipCount);
                    init = false;
                }
                if (page != flipCount) {
                    var diff = Math.abs(page - flipCount);
                    if (page > flipCount) { // 大于当前总页数
                        drawPage(diff);
                    } else if (page < flipCount) { // 小于当前总页数
                        removePage(curIndex, diff);
                    }
                    flipCount = page;
                }
                $(".slide_main", $this).css({"width": nw * flipCount, "height": nh});
                $(".slide_list", $this).css({"width": nw, "height": nh, "overflow": "hidden"});
                // 如果当前页数据为空，则跳转到第一页
                if (!prlist || !prlist.length)
                    $(".slide_page span:first", $this).trigger("click");
                else {
                    opts.populate($($(".slide_main .slide_list", $this).get(curIndex)), prlist, curIndex + 1);
                    $(".slide_page span", $this).removeClass("current");
                    $($(".slide_page span", $this).get(curIndex)).addClass("current");
                }
            });
        };

        var drawPage = function (pageCount) {
            for (var i = 0; i < pageCount; i++) {
                $(".slide_main", $this).append('<div class="slide_list"><div class="tab_prompt_message">' + Msg.plants.noData + '</div></div>');
                $(".slide_page", $this).append('<span>' + i + '</span>');
            }
        };

        var removePage = function (curIndex, pageCount) {
            if (pageCount > flipCount) return;
            var indexList = [];
            for (var i = 0; i < pageCount; i++) {
                indexList[i] = (curIndex + i + 1) % flipCount;
            }
            for (var k = 0; k < indexList.length; k++) {
                $(".slide_main .slide_list:eq(" + k + ")", $this).remove();
                $(".slide_page span:eq(" + k + ")", $this).remove();
            }
        };

        var flip = function () {
            if (flipTimer) {
                clearTimeout(flipTimer);
                flipTimer = null;
            }
            if (!$($this.selector).get(0)) return;
            createPage(flipId);
            if (!flipCount) return;
            $(".slide_conn", $this).animate({
                scrollLeft: flipId * nw
            });
            flipId = (flipId + 1) % flipCount;
            if ($($this.selector).get(0) && opts.isFlip) {
                flipTimer = setTimeout(flip, opts.flipDelay);
            }
        };
        flip();
        $(".slide_page", $this).delegate("span", "click", function () {
            if (flipTimer) {
                clearTimeout(flipTimer);
                flipTimer = null;
            }
            flipId = $("div.slide_page span").index(this);
            flip();
            $(".slide_page span").removeClass("current");
            $(this).addClass("current");
            return false;
        });
    };
})(jQuery);
