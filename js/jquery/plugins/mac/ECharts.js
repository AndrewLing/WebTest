!function (fn) {
    "function" == typeof define && define.amd ? define(["jquery", "echarts"], fn) : fn(jQuery)
}(function ($) {
    "use strict";
    window.ECharts = {
        // 图表对象缓存
        Cache: {},
        // 图表主题
        Theme: "macarons",
        // 是否显示Loading
        IsShowLoading: false,
        //右键保存图片
        saveImage: function (id, option, isMerge, chart) {
            option = $.extend({}, ECharts.OptionTemplate.CommonOption, option);
            $('#' + id).bind("contextmenu", function (event) {
                if ($('#imgSave') && $('#imgSave').length) {
                    $('#imgSave').remove();
                }
                if (option.imageSave) {
                    var imgSrc;
                    try {
                        imgSrc = chart.getDataURL("png");
                    } catch (e) {
                    }
                    if (imgSrc) {
                        var downloadLink = document.createElement('a');
                        //downloadLink.onclick = _saveImageForIE;
                        downloadLink.href = imgSrc;
                        downloadLink.setAttribute(
                            'download', option.imageName + '.png'
                        );
                        //downloadLink.innerHTML = Msg.op.exportPNG;
                        downloadLink.innerHTML = '导出PNG图片';
                        var $ul = $('<ul id="imgSave"/>');
                        var $li = $('<li/>');

                        var left = event.pageX + "px";
                        var top = event.pageY + "px";

                        $ul.css({
                            'top': top,
                            'left': left
                        });
                        $ul.append($li);
                        $('body').append($ul);
                        $li.append($(downloadLink));
                    }
                }
                return false;
            });
            $("body").click(function (event) {
                if ($("#imgSave") && $("#imgSave").length) {
                    $("#imgSave").remove();
                }
            });
        },

        /**
         * 渲染图表
         * @param id 容器ID
         * @param option 图表配置
         * @param isMerge 是否合并
         */
        Render: function (id, option, isMerge) {
            var self = this;
            var chart, container;
            if (id instanceof HTMLElement) {
                container = id;
                id = id.id;
            } else {
                container = document.getElementById(id);
            }

            self.Dispose(id);

            if (!container) return;

            chart = echarts.init(container, self.Theme);

            if (self.IsShowLoading) {
                //图表显示提示信息
                chart.showLoading({
                    text: Msg.ajax.loading
                });
            }

            self.Cache[id] = chart;

            try {
                $(container).resize(function () {
                    setTimeout(function () {
                        ECharts.Resize(id);
                    }, 100);
                });

                option = $.extend({}, ECharts.OptionTemplate.CommonOption, option);
                chart.setOption(option, isMerge);
            } catch (e) {

            } finally {
                if (self.IsShowLoading) {
                    chart.hideLoading();
                }
            }
            ECharts.saveImage(id, option, isMerge, chart);
            $(container).bind('mouseup mouseout', function () {
                self.Resize(id);
            });

            return chart;
        },

        /**
         * 新增数据
         *
         * @param chart
         * @param data {Object} 新增数据
         * @param seriaIndex {Number} 系列索引
         * @param toFirst {Boolean} 是否从队列头部新增数据，false则从对尾部增加数据（默认 false）
         * @param isAppend {Boolean} 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头（默认 false）
         * @param axisData {String} 坐标轴标签（默认不改变坐标轴标签内容）
         */
        AddData: function (chart, data, seriaIndex, toFirst, isAppend, axisData) {
            var self = this;
            var dataOption = [[seriaIndex || 0, data || '-', toFirst, isAppend, axisData]];
            chart.addData(dataOption);

            return self;
        },

        /**
         * 新增数据 —— 同时新增一组数据（同坐标轴）
         *
         * @param chart
         * @param datas {Array} 新增数据，序列按照数组顺序
         * @param toFirst {Boolean} 是否从队列头部新增数据，false则从对尾部增加数据（默认 false）
         * @param isAppend {Boolean} 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头（默认 false）
         * @param axisData {String} 坐标轴标签（默认不改变坐标轴标签内容）
         */
        AddDatas: function (chart, datas, toFirst, isAppend, axisData) {
            var self = this;
            var dataOption = [];
            for (var i = 0; i < datas.length; i++) {
                if (i == datas.length - 1) {
                    dataOption.push([i, datas[i] || '-', toFirst, isAppend, axisData]);
                } else {
                    dataOption.push([i, datas[i] || '-', toFirst, isAppend]);
                }
            }
            chart.addData(dataOption);

            return self;
        },

        /**
         * 新增数据 —— 同时新增一组数据（同坐标轴）
         *
         * @param chart
         * @param datas {Array} 新增数据，序列按照数组顺序
         * @param toFirst {Boolean} 是否从队列头部新增数据，false则从对尾部增加数据（默认 false）
         * @param isAppend {Boolean} 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头（默认 false）
         * @param axisData {String} 坐标轴标签（默认不改变坐标轴标签内容）
         */
        AddDatasByOption: function (chart, dataOption) {
            var self = this;
            chart.addData(dataOption);

            return self;
        },

        /**
         * 视图区域大小变化更新，默认绑定节点的resize事件
         */
        Resize: function (id) {
            var self = this;
            return (function (id) {
                try {
                    if (id) {
                        self.Cache[id] && self.Cache[id].resize && self.Cache[id].resize();
                    } else {
                        for (var key in self.Cache) {
                            if (self.Cache.hasOwnProperty(key)) {
                                var c = self.Cache[key];
                                c && c.dom && $(c.dom).is(':visible') && c.resize && c.resize();
                            }
                        }
                    }
                } catch (e) {
                }

                return self;
            })(id);
        },

        /**
         * 释放，释放后echarts实例不可用
         */
        Dispose: function (id) {
            var self = this;
            return (function (id) {
                try {
                    if (id) {
                        self.Cache[id] && self.Cache[id].dispose && self.Cache[id].dispose();
                    } else {
                        for (var key in self.Cache) {
                            if (self.Cache.hasOwnProperty(key)) {
                                var c = self.Cache[key];
                                c && c.dispose && c.dispose();
                            }
                        }
                    }
                } catch (e) {
                }

                return self;
            })(id);
        },

        /**
         * 事件处理
         */
        EVENT: {
            // -----------------------基础事件-----------------------
            REFRESH: 'refresh', // 刷新
            RESTORE: 'restore', // 还原
            RESIZE: 'resize', // 显示容器大小变化
            CLICK: 'click', // 点击
            DBLCLICK: 'dblclick', // 双击
            HOVER: 'hover', // 悬浮
            MOUSEOUT: 'mouseout', // 鼠标离开图表

            // ---------------------交互逻辑事件--------------------
            DATA_CHANGED: 'dataChanged',  // 数据修改，如拖拽重计算
            DATA_ZOOM: 'dataZoom', // 数据区域缩放
            DATA_RANGE: 'dataRange', // 值域漫游
            DATA_RANGE_SELECTED: 'dataRangeSelected', //值域开关选择
            DATA_RANGE_HOVERLINK: 'dataRangeHoverLink', // 值域漫游hover
            LEGEND_SELECTED: 'legendSelected', // 图例开关选择
            LEGEND_HOVERLINK: 'legendHoverLink', // 图例hover
            MAP_SELECTED: 'mapSelected', // 地图选择
            PIE_SELECTED: 'pieSelected', // 饼图选择
            MAGIC_TYPE_CHANGED: 'magicTypeChanged', // 动态类型切换
            DATA_VIEW_CHANGED: 'dataViewChanged', // 数据视图修改
            TIMELINE_CHANGED: 'timelineChanged', //时间轴变化
            MAP_ROAM: 'mapRoam' //地图漫游
        },

        /**
         * 数据格式化
         */
        DataFormat: {

            /**
             * 无分组数据初始化，这种数据格式多用于饼图、单一的柱形图的数据源
             * @param data {Object} 格式如：[{name:XXX,value:XXX},{name:XXX,value:XXX},……]
             * @return {Object} {category:Array, data:Array}
             */
            NoGroupData: function (data) {
                var categories = [];
                var datas = [];
                for (var i = 0; i < data.length; i++) {
                    categories.push(data[i].name || "");
                    datas.push({name: data[i].name, value: data[i].value || 0});
                }
                return {category: categories, data: datas};
            },

            /**
             * 有分组数据初始化，这种格式的数据多用于展示多条折线图、分组的柱形图等
             * @param data {Object} 格式如：[{name:XXX,group:XXX,value:XXX},{name:XXX,group:XXX,value:XXX},……]
             * @param type {string} 渲染的图表类型：可以是‘line’,‘bar’
             * @param isStack {boolean} 是否为堆积图
             * @return {Object} {category:Array, xAxis:Array, series:Array}
             */
            GroupData: function (data, type, isStack) {
                var chartType = "line";
                if (type) {
                    chartType = type || "line";
                    var xAxis = [];
                    var group = [];
                    var series = [];
                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < xAxis.length && xAxis[j] != data[i].name; j++) {
                        }

                        if (j == xAxis.length) {
                            xAxis.push(data[i].name);
                        }

                        for (var k = 0; k < group.length && group[k] != data[i].group; k++) {
                        }

                        if (k == group.length) {
                            group.push(data[i].group);
                        }
                    }

                    for (var i = 0; i < group.length; i++) {
                        var temp = [];
                        for (var j = 0; j < data.length; j++) {
                            if (group[i] == data[j].group) {
                                if (type == "map") {
                                    temp.push({name: data[j].name, value: data[i].value});
                                } else {
                                    temp.push(data[j].value);
                                }
                            }
                        }
                        var seriesTemp;
                        switch (type) {
                            case 'line':
                                seriesTemp = {name: group[i], data: temp, type: chartType};
                                if (isStack)
                                    seriesTemp = $.extend({}, {stack: 'stack'}, seriesTemp);
                                break;
                            case 'bar' :
                                seriesTemp = {name: group[i], data: temp, type: chartType};
                                if (isStack)
                                    seriesTemp = $.extend({}, {stack: 'stack'}, seriesTemp);
                                break;
                            case 'map':
                                seriesTemp = {
                                    name: group[i],
                                    type: chartType,
                                    mapType: 'china',
                                    selectedMode: 'single',
                                    itemStyle: {
                                        normal: {
                                            label: {show: true}
                                        },
                                        emphasis: {
                                            label: {show: true}
                                        }
                                    },
                                    data: temp
                                };
                                break;
                            default :
                                seriesTemp = {name: group[i], data: temp, type: chartType};
                        }
                        series.push(seriesTemp);
                    }
                }
                return {category: group, xAxis: xAxis, series: series};
            }
        },

        /**
         * 初始化常用的图表类型
         */
        OptionTemplate: {
            /**
             * 通用的图表基本配置
             */
            CommonOption: {
                grid: {
                    borderWidth: 0
                },
                tooltip: {
                    trigger: 'axis', // tooltip触发方式：axis以X轴线触发，item以每一个数据项触发
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                toolbox: {
                    show: false
                },
                yAxis: [{
                    boundaryGap: [0, 0]
                }],
                legend: {
                    show: false, // 默认不显示图例
                    selectedMode: false, // 选择模式，默认开启图例开关，可选single，multiple
                    data: []
                },
                calculable: false, // 是否拖拽重计算
                animation: false,  // 是否启用动画
                imageSave: false, // 是否可以右键保存图片
                imageName: 'image' // 默认保存的图片名称
            },

            /**
             * 饼图 配置
             * @param data 数据 格式：[{name:XXX,value:XXX},……]
             * @param name 显示标题
             * @return option
             */
            Pie: function (data, name) {
                var pieDatas = ECharts.DataFormat.NoGroupData(data);
                var option = {
                    title: {
                        text: name || ''
                    },
                    tooltip: {
                        tigger: 'item'
                    },
                    legend: {
                        selectedMode: 'multiple',
//                    orient: 'vertical',
                        data: pieDatas.category
                    },
                    series: [
                        {
                            name: name || "",
                            type: 'pie',
                            radius: '65%',
                            center: ['50%', '50%'],
                            data: pieDatas.data
                        }
                    ]
                };
                return $.extend({}, ECharts.OptionTemplate.CommonOption, option);
            },

            /**
             * 折线图 配置
             * @param data 数据 格式：[{name:XXX,value:XXX,group:XXX},……]
             * @param name 显示标题
             * @param xName x轴显示名称
             * @param yName y轴显示名称
             * @param isStack 是否为堆积图
             * @return option
             */
            Lines: function (data, name, xName, yName, isStack) {
                var stackLineDatas = ECharts.DataFormat.GroupData(data, 'line', isStack);
                var option = {
                    title: {
                        text: name || ''
                    },
                    legend: {
                        data: stackLineDatas.category
                    },
                    xAxis: [
                        {
                            name: xName || '',
                            type: 'category',
                            boundaryGap: false,
                            data: stackLineDatas.xAxis
                        }
                    ],
                    yAxis: [
                        {
                            name: yName || '',
                            type: 'value',
                            splitArea: {show: true}
                        }
                    ],
                    series: stackLineDatas.series
                };
                return $.extend({}, ECharts.OptionTemplate.CommonOption, option);
            },

            /**
             * 柱状图 配置
             * @param data 数据 格式：[{name:XXX,group:XXX,value:XXX},……]
             * @param name 显示标题
             * @param xName x轴显示名称
             * @param yName y轴显示名称
             * @param isStack 是否为堆积图
             * @return option
             */
            Bars: function (data, name, xName, yName, isStack) {
                var stackBarDatas = ECharts.DataFormat.GroupData(data, 'bar', isStack);
                var option = {
                    title: {
                        text: name || ''
                    },
                    legend: {
                        data: stackBarDatas.category
                    },
                    xAxis: [
                        {
                            name: xName || '',
                            type: 'category',
                            axisLabel: {
                                show: true,
                                interval: 'auto',
                                rotate: 0,
                                margin: 8
                            },
                            data: stackBarDatas.xAxis
                        }
                    ],
                    yAxis: [
                        {
                            name: yName || '',
                            type: 'value',
                            splitArea: {show: true}
                        }
                    ],
                    series: stackBarDatas.series
                };
                return $.extend({}, ECharts.OptionTemplate.CommonOption, option);
            }

        }
    };
});
