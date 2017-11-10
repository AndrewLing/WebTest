/*
 * name: MagicTabs
 * author: Mac_J
 * version: 1.3.2
 * note: need core.js
 */
mac.tabs = function (self, cfg) {

    cfg = self.config = $.extend({
        speed: 6,
        tabHeight: 40,
        hbarHeight: 0
    }, cfg);

    var th = cfg.tabHeight;
    var bh = th + cfg.hbarHeight;
    var hx = $('<div class="sbtn"><span></span></div>');
    var hm = $('<div class="main"></div>').height(th);
    var ht = $('<div class="tt"></div>').height(th);
    hx.width('26').height(th - 1);

    var hb = $('<div class="hbar"></div>');
    hb.height(cfg.hbarHeight).css('top', bh);
    var hd = $('<div class="head"></div>').height(th - 1);
    self.append(hb).append(hd);

    var hl = hx.clone().addClass('left'), hr = hx.clone().addClass('right');
    hd.append(hl).append(hm.append(ht)).append(hr);

    var bd = $('<div class="body"></div>').appendTo(self);
    self.adjust = function () {
        var sw = self.width(), sh = self.height(), h = sh - hd.height() - self.offset().top;
        bd.children('.main').each(function (n, c) {
            var ec = $(c), x = ec.attr('height');
            if (x) {
                if (x == 'auto') {
                    ec.css('height', '100%');
                } else
                    ec.css('height', x);
            } else {
                ec.css('height', '100%');
            }
            ec.css('height', h);
        });
        if (hd.width()) {
            var b = hd.width() <= ht.width();
            hl.toggle(b);
            hr.toggle(b);
            hm.width(hd.width() - (b ? hl.width() * 2 + 2 : 0));
        }
    };

    function closeTab(a, b, c) {
        if (!a.hasClass('closeable'))
            return;
        c = c || a.attr('name');
        b = b || bd.children('[name=' + c + ']');
        if (cfg.onCloseTab && !cfg.onCloseTab(self, c, a))
            return false;
        var s = a.next('.item');
        if (s.length != 1)
            s = a.prev('.item');
        var d = self.selected, t = (d ? d.attr('name') : '');
        if (c == t && s.length == 1)
            s.click();
        a.hide();
        b.hide();

        var item = cfg.items[c];
        delete cfg.items[c];

        window.setTimeout(function () {
            a.remove();
            b.remove();
            if (cfg.onTabClosed)
                cfg.onTabClosed(self, item, a);
        }, 0);
        self.adjust();
    }

    self.closeTab = function (c, a) {
        a = a || hd.seek(c);
        var b = bd.seek(c) || 0;
        closeTab(a, b, c);
    };
    self.closeTabs = function (x) {
        hd.find('.item').each(function (n, a) {
            var o = $(a), c = o.attr('name');
            if (c != x)
                closeTab(o);
            else
                self.select(x);
        });
    };
    self.addTab = function (p, n, cb) {
        p = $.extend({
            closeable: true,
            tabWidth: 125,
            initLoad: false,
            show: true,
            refresh: false
        }, p);
        var k = p.code || 'm' + n;
        var a = hd.seek(k), b;
        if (a.length > 0) {
            var r = false;
            b = bd.seek(k);
            if (p.url && p.initLoad) {
                self.refresh(k);
                r = true;
            }
            tabClick(a, p, b, r);
        } else {
            a = $('<div class="item normal" name="' + k + '"></div>');
            b = $('<div class="main hidden" name="' + k + '"></div>');
            if (p.show) {
                var s = self.selected;
                if (s) {
                    s.removeClass("selected");
                    bd.children('[name=' + s.attr('name') + ']').hide();
                }
                self.selected = a.addClass("selected");
                $('#tree').NavMenuTreeSelected(a.attr('name'));
                b.removeClass('hidden');
                if (cfg.onShowTab) {
                    beforeShowTab(self, a, p);
                    cfg.onShowTab(self, a, b, p);
                }
            }
            if (p.bodyCls)
                b.addClass(p.bodyCls);
            if (p.height)
                b.attr('height', p.height);
            ht.append(a.height(th + 1));
            self.adjust();
            var m = $('<div class="main"></div>');
            m.append(p.title).attr('refresh', p.refresh);
            var bw = 0;// xbtn width
            a.append('<div class="left"></div>').append(m);
            if (p.closeable) {
                var x = $('<span class="ui-icon ui-icon-close" title="' + Msg.close + '"></span>');
                var w = $('<div class="xbtn"></div>').append(x);
                x.click(function () {
                    closeTab(a, b, k);
                    return false;
                });
                a.addClass('closeable').append(w);
                bw = x.width();
            }
            if (cfg.tabWidth)
                m.width(cfg.tabWidth - bw);
            a.append('<div class="right"></div>');
            bd.append(b);
            // 缓存页面属性

            if (cfg.items[p.code] == undefined) {
                cfg.items[p.code] = p;
            }

            if(p.maximize) { // 最大化处理
                tabDblClick(a, p, b);
                a.dblclick(function(){
                    tabDblClick(a, p, b);
                });
            }

            if (p.el) {
                b.append(p.el);
            } else if (p.url && p.show) {
                var f = true;
                if (p.onBeforeLoad)
                    f = p.onBeforeLoad();
                if (f) {
                    a.unbind('click');
                    b.load(p.url, null, function (data) {
                        if (cfg.onLoadPage)
                            cfg.onLoadPage(data, $(this), p);
                        a.click(function () {
                            tabClick(a, p, b);
                        });
                    });
                }
            }
        }
        if (cb)
            cb(a, b, p);
        self.adjust();
        self.scroll(a);
        return a;
    };
    $.each(cfg.items, function (n, p) {
        self.addTab(p, n);
    });
    self.hscroll = function () {
        var s = cfg.speed * ($(this).hasClass('left') ? -1 : 1);
        $(document).mouseup(function () {
            var t = self.timer;
            if (t)
                window.clearInterval(t);
        });
        self.timer = window.setInterval(function () {
            var l = hm.scrollLeft();
            hm.scrollLeft(l + s);
        }, 20);
        return self.timer;
    };
    hl.mousedown(self.hscroll);
    hr.mousedown(self.hscroll);
    self.adjust();
    self.scroll = function (a) {
        var al = a.position().left;
        var pl = hm.position().left;
        if (al < pl)
            hm.scrollLeft(hm.scrollLeft() + al - 4 * pl);
        if (al + a.width() >= pl + hm.width())
            hm.scrollLeft(hm.scrollLeft() + al - hm.width() + 2 * pl + a.width());

        return self;
    };
    self.refresh = function (x) {
        var a = hd.seek(x), b = bd.seek(x), p = cfg.items[x];
        if (a.length && b.length && p) {
            b.empty();
            a.unbind('click');
            var f = true;
            if (p.onBeforeLoad)
                f = p.onBeforeLoad();
            if (f) {
                b.load(p.url, null, function (data) {
                    if (cfg.onLoadPage)
                        cfg.onLoadPage(data, $(this), p);
                    a.click(function () {
                        tabClick(a, p, b);
                    });
                });
            }
        }
    };

    function select(a) {
        a.click();
        self.scroll(a);
        return a;
    }

    /**
     * 点击标签头事件处理
     * @param a 点击标签头
     * @param p 参数
     * @param b 点击标签体
     * @param f 是否不需要刷新
     */
    function tabClick(a, p, b, f) {
        var s = self.selected;
        if (s) {
            s.removeClass("selected");
            bd.children('[name=' + s.attr('name') + ']').hide();
        }
        self.selected = a.addClass("selected");
        if (a.length > 0) {
            var tabTitle = $(a[0]).find("div.main");
            if (tabTitle && tabTitle.length > 0) {
                if (p.title != tabTitle[0].innerText) {
                    tabTitle[0].innerText = p.title;
                }
            }
        }

        var x = a.attr('name');
        $('#tree').NavMenuTreeSelected(x); // TODO 组件依赖
        /**
         * @author wuxiaohui 添加点击时强制刷新功能 加入对refresh属性的判断
         */
        if (!f && p.url && p.refresh) {
            self.refresh(x);
        }
        var h = b.attr('height');
        if (!h) {
            bd.height(self.height() - hd.height() - 4);
        } else if (h == 'auto') {
            bd.css('height', h);
        } else {
            bd.css('overflow', 'hidden');
            bd.height(h);
        }
        a.show();
        b.show();
        self.scroll(a);
        if (cfg.onShowTab) {
            beforeShowTab(self, a, p);
            cfg.onShowTab(self, a, b, p);
        }
        ECharts.Resize(); // TODO 组件依赖
    }

    /**
     * 双击满屏 TODO（耦合度高，需要分离）
     * @param a
     * @param p
     * @param b
     */
    function tabDblClick (a, p, b) {
        $("#top-logo").parentsUntil('tr').height(0).hide();
        $("#left-nav-box").width(0).hide();
        $('.head').height(0).hide();
        winResize.fire();
    }

    function beforeShowTab(self, a, p) {
        a.bind("contextmenu", {
            target: self
        }, function (e) {
            menu.css({
                "top": e.clientY + "px",
                "left": e.clientX + "px"
            });
            menu.menu({
                select: function (e, ui) {
                    rightSelect(ui, self, a);
                    $(this).hide();
                }
            });

            // 首页特殊处理
            var name = a.attr("name");
            if (name == 'home') {
                $(menu).children().each(function (t, e) {
                    $(e).removeClass("ui-state-disabled");
                    if ($(e).attr("action") != "closeOthers") {
                        $(e).addClass("ui-state-disabled");
                        return true;
                    }
                });
            }
            // 配置中存在不能右键刷新的Tab 和 当前选中Tab 不能右键刷新处理
            else if (p.refresh == null || (p.refresh && p.refresh === 'rd') || a != self.selected) {
                $(menu).children().each(function (t, e) {
                    $(e).removeClass("ui-state-disabled");
                    if ($(e).attr("action") == "refresh") {
                        $(e).addClass("ui-state-disabled");
                        return true;
                    }
                });
            }
            else {
                $(menu).children().each(function (t, e) {
                    $(e).removeClass("ui-state-disabled");
                });
            }

            menu.show();
            return false;
        });
    }

    /***
     * 右键选择菜单的事件响应
     */
    function rightSelect(ui, tabs, a) {
        var action = ui.item.attr("action");
        var name = a.attr("name");
        switch (action) {
            case 'close':
                tabs.closeTab(name);
                break;
            case 'closeOthers':
                tabs.closeTabs(name);
                break;
            case 'closeAll':
                tabs.closeTabs('home');
                break;
            case 'refresh':
                tabs.refresh(name);
                break;
            default:
                break;
        }
    }

    self.selectFirst = function () {
        var a = hd.find('.item:first');
        return select(a, a.attr('name'));
    };
    self.select = function (c) {
        return select(hd.seek(c), c);
    };
    /**
     * 最大化标签体
     */
    self.maximize = function () {
        tabDblClick();
    };

    $("body").click(function () { // TODO 节点依赖
        if (menu) {
            menu.hide();
        }
    });

    return self;
};
