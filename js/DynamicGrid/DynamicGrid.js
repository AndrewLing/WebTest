/**
 * Created by p00034 on 2016-07-13.
 */
+(function ($, b) {
    window.define ? define(['jquery'], b) : b();
})(jQuery, function () {
    /**
     * 可编辑动态表格组件
     * @param p 参数
     */
    $.fn.extend({
        DynamicGrid: function (p) {
            var $context = $(this);
            var defaultOption = {
                skin: 'default',
                title: 'Dynamic Grid Title',
                columns: [
                    {
                        tag: 'input',
                        show: "filed 1",
                        filed: "id",
                        width: 20,
                        events: {
                            click: function (e) {
                                alert("click filed 2");
                                console.log(e, e.target);
                            }
                        }
                    },
                    {
                        tag: 'input',
                        show: "filed 2",
                        filed: "name",
                        width: 40,
                        events: {
                            click: function (e) {
                                alert("click filed 1");
                                console.log(e, e.target);
                            }
                        }
                    },
                    {
                        tag: 'select',
                        show: "filed 3",
                        filed: "sex",
                        width: 40,
                        events: {
                            change: function (e) {
                                alert("click filed 1");
                                console.log(e, e.target);
                            }
                        }
                    }
                ],
                operator: true,
                showRowNumber: 'decimal'
            };
            p = $.extend({}, defaultOption, p);

            var g = {
                $container: null,
                $header: null,
                $body: null,
                $bodyContent: null,
                $opAdd: null,
                dataIndex: 0,
                /**
                 * TODO 自定义皮肤设置
                 */
                initSkin: function () {
                    /**
                     * 设置组件根路径
                     * @private
                     */
                    var _path = function () {
                        var path, idx, sList = document.getElementsByTagName("script");
                        for (var i = 0; i < sList.length; i++) {
                            path = sList[i].getAttribute("src");
                            if (path) {
                                path = path.substr(0, path.toLowerCase().indexOf("dynamicgrid.js"));
                                idx = path.lastIndexOf("/");
                                if (idx > 0)
                                    path = path.substring(0, idx + 1);
                                if (path)
                                    break;
                            }
                        }
                        return path;
                    };

                    var skinUrl = _path() + 'skin/' + p.skin + '.css';
                    window.require ? require(['css!' + skinUrl]) : (function () {
                        var skinLink = document.getElementById('DynamicGridSkin');
                        if (skinLink) {
                            skinLink.href = skinUrl;
                        } else {
                            var el = document.createElement('link');
                            el.id = 'DynamicGridSkin';
                            el.type = 'type="text/css"';
                            el.rel = 'stylesheet';
                            el.href = skinUrl;
                            (document.getElementsByTagName('head')[0] || document.body).appendChild(el);
                        }
                    })();
                },
                work: function () {
                    g.initSkin();

                    g.$container = $('<div />').addClass('DynamicGrid');
                    g.$header = $('<div/>').addClass('DynamicGrid-head');
                    g.$body = $('<div/>').addClass('DynamicGrid-body');
                    g.$bodyContent = $('<ul/>');

                    p.showRowNumber && (function () {
                        g.$bodyContent.css({
                            'list-style-type': p.showRowNumber,
                            'margin-left': 50
                        });
                    })();
                    p.maxHeight && (function () {
                        g.$body.css({
                            'max-height': p.maxHeight
                        });
                    })();

                    g.createHeader();
                    //g.createBody();

                    g.$container.append(g.$header);
                    g.$container.append(g.$body.append(g.$bodyContent));
                    $context.append(g.$container);

                    g.bindEvents();
                },

                createHeader: function () {
                    $.each(p.columns, function () {
                        g.appendElement(g.$header, 'p', '', this.show)
                            .css({width: ((this.width) || (100 / p.columns.length)) + '%'});
                    });
                    if (p.operator) {
                        g.$opAdd = $('<button/>').addClass('operator-btn').addClass('add');
                        g.appendElement(g.$header, 'div', '', g.$opAdd).addClass('operator-btn-container');
                    }
                },

                createBody: function () {
                    var li = g.appendElement(g.$bodyContent, 'li', '', '').addClass('row');
                    $.each(p.columns, function () {
                        g.appendElement(
                            g.appendElement(li, 'div', '', '').addClass('body-line')
                                .css({
                                    width: ((this.width) || (100 / p.columns.length)) + '%',
                                    padding: '2px 0'
                                }),
                            this.tag, $.extend(this.attributes, {name: this.filed}), '');
                    });
                    if (p.operator) {
                        var $opDelete = $('<button/>').addClass('operator-btn').addClass('delete')
                            .bind('click', g.fnOperatorDelete);
                        g.appendElement(li, 'div', '', [$opDelete, g.$opAdd])
                            .addClass('body-line').addClass('operator-btn-container');
                    }
                },

                appendElement: function (context, tagName, attributes, data) {
                    var tag = $('<' + tagName + '/>');
                    var valueReplaceElements = ['input', 'select', 'textarea'],
                        htmlReplaceElements = ['button'],
                        srcReplaceElements = ['img'];

                    if ($.inArray(tagName, valueReplaceElements) != -1) {
                        tag.val(data);
                    }
                    else if ($.inArray(tagName, htmlReplaceElements) != -1) {
                        tag.html(data);
                    }
                    else if ($.inArray(tagName, srcReplaceElements) != -1) {
                        tag.attr('src', data);
                    }
                    else {
                        tag.html(data);
                    }

                    if (attributes) {
                        for (var key in attributes) {
                            if (attributes.hasOwnProperty(key) ) {
                                tag.attr(key, attributes[key]);
                            }
                        }
                    }
                    context.append(tag);

                    return tag;
                },

                bindEvents: function () {
                    if (g.$opAdd) {
                        g.$opAdd.click(g.fnOperatorAdd);
                    }
                },
                unbindEvents: function () {
                    if (g.$opAdd) {
                        g.$opAdd.unbind('click');
                    }
                },

                fnOperatorAdd: function (e) {
                    g.createBody();
                    g.dataIndex++;
                },

                fnOperatorDelete: function (e) {
                    var self = $(e.target);
                    var row = self.parents('.row');
                    row.remove();

                    var opContainers = $('.operator-btn-container');
                    opContainers.eq(opContainers.length - 1).append(g.$opAdd);
                    g.unbindEvents();
                    g.bindEvents();
                    g.dataIndex--;
                }
            };

            g.work();
        }

    });

});
