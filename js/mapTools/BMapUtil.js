/**
 * Created by lWX242305 on 2015/6/11.
 */
(function () {

    var p = {
        bMapPath: "http://api.map.baidu.com/api",
        version: 2.0,
        AK: "xeBemF45MwVCkp1Df3tG8PkG",
        services: true
    };

    window.MapUtil = {
        /**
         * 配置模板
         */
        OptionTemplates: {
            /**
             * 默认配置模板
             */
            default: {
                center: {
//                    city: '北京市',
                    position: [116.404, 39.915]
                },
                zoomLevel: 5,

                scrollWheelZoom: true, // 是否鼠标滚轮缩放地图比例
                keyboard: true, // 是否支持键盘控制
                dragging: true, // 允许拖动地图显示区域
                doubleClickZoom: true, // 是否双击缩放地图比例

                mapType: BMAP_HYBRID_MAP,
                /**
                 * 地图模式:
                 *
                 * BMAP_NORMAL_MAP: 普通模式，
                 * BMAP_STAELLITE_MAP：卫星图标准模式，
                 * BMAP_HYBRID_MAP：卫星图混合模式，
                 * BMAP_PERSPECTIVE_MAP：3D模式
                 */

                /**
                 * anchor方位，控制控件停靠位置
                 *
                 * BMAP_ANCHOR_TOP_LEFT 表示控件定位于地图的左上角。
                 * BMAP_ANCHOR_TOP_RIGHT 表示控件定位于地图的右上角。
                 * BMAP_ANCHOR_BOTTOM_LEFT 表示控件定位于地图的左下角。
                 * BMAP_ANCHOR_BOTTOM_RIGHT 表示控件定位于地图的右下角。
                 */
                mapControl: [
                    {
                        type: 'Scale',
                        properties: {
                            anchor: BMAP_ANCHOR_BOTTOM_LEFT,
                            unit: BMAP_UNIT_IMPERIAL
                        }
                    },
                    {
                        type: 'Navigation',
                        properties: {
                            anchor: BMAP_ANCHOR_TOP_LEFT,
                            type: BMAP_NAVIGATION_CONTROL_LARGE
                            /**
                             * NavigationControl控件就提供了如下类型：
                             *
                             * BMAP_NAVIGATION_CONTROL_LARGE 表示显示完整的平移缩放控件。
                             * BMAP_NAVIGATION_CONTROL_SMALL 表示显示小型的平移缩放控件。
                             * BMAP_NAVIGATION_CONTROL_PAN 表示只显示控件的平移部分功能。
                             * BMAP_NAVIGATION_CONTROL_ZOOM 表示只显示控件的缩放部分功能。
                             */
                        }
                    },
//                    {
//                        type: 'OverviewMap',
//                        properties: {
//                            anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
//                            isOpen: true
//                        }
//                    },
//                    {
//                        type: 'MapType',
//                        properties: {
//                            anchor: BMAP_ANCHOR_TOP_RIGHT,
//                            mapTypes: [
//                                BMAP_NORMAL_MAP, // 普通模式，
//                                BMAP_SATELLITE_MAP, // 卫星图标准模式，
//                                BMAP_HYBRID_MAP //：卫星图混合模式，
//                            ]
//                        }
//                    },
//                    {
//                        type: 'Copyright',
//                        properties: {
//                            anchor: BMAP_ANCHOR_BOTTOM_RIGHT
//                        }
//                    }
                ]

                /**
                 * 地图API提供了如下几种覆盖物：
                 *
                 * Overlay：覆盖物的抽象基类，所有的覆盖物均继承此类的方法。
                 * Marker：标注表示地图上的点，可自定义标注的图标。
                 * Label：表示地图上的文本标注，您可以自定义标注的文本内容。
                 * Polyline：表示地图上的折线。
                 * Polygon：表示地图上的多边形。多边形类似于闭合的折线，另外您也可以为其添加填充颜色。
                 * Circle: 表示地图上的圆。
                 * InfoWindow：信息窗口也是一种特殊的覆盖物，它可以展示更为丰富的文字和多媒体信息。
                 *      注意：同一时刻只能有一个信息窗口在地图上打开。
                 */
            }
        },

        /**
         * 地图配置
         * @param id 容器ID
         * @param option 配置参数
         * @returns {MapUtil}
         */
        Config: function (id, option) {
            option = $.extend(p, MapUtil.OptionTemplates['default'], option);
            this.option = {map: {}, option: option, container: id};
            return this;
        },

        /**
         * 地图事件
         * @returns {MapUtil}
         */
        Instance: function () {
            var option = this.option;
            option.map = new BMap.Map(option.container, {zoomLevelMin: 2, zoomLevelMax: 12});
            if (option.option.center) {
                if(option.option.mapType) {
                    option.map.setMapType(option.option.mapType || BMAP_NORMAL_MAP);
                    if(option.option.mapType == BMAP_PERSPECTIVE_MAP && option.option.center.city) {
                        option.map.setCurrentCity(option.option.center.city);
                    }
                }
                var lng, lat;
                if (!option.option.center.position) {
                    lng = 0;
                    lat = 0;
                } else {
                    lng = option.option.center.position[0];
                    lat = option.option.center.position[1]
                }
                option.map.centerAndZoom(new BMap.Point(lng, lat), option.option.zoomLevel);
            }
            option.option.scrollWheelZoom ? option.map.enableScrollWheelZoom() : option.map.disableScrollWheelZoom();
            option.option.keyboard ? option.map.enableKeyboard() : option.map.disableKeyboard();
            option.option.dragging ? option.map.enableDragging() : option.map.disableDragging();
            option.option.doubleClickZoom ? option.map.enableDoubleClickZoom() : option.map.disableDoubleClickZoom();

            this.addControl();

            return this;
        },

        /**
         * 向地图添加控件
         *
         * <pre>
         * <b>地图API中提供的控件有：</b>
         *
         *    NavigationControl：地图平移缩放控件，默认位于地图左上方，它包含控制地图的平移和缩放的功能。
         *    OverviewMapControl：缩略地图控件，默认位于地图右下方，是一个可折叠的缩略地图。
         *    ScaleControl：比例尺控件，默认位于地图左下方，显示地图的比例关系。
         *    MapTypeControl：地图类型控件，默认位于地图右上方。
         *    CopyrightControl：版权控件，默认位于地图左下方。
         * </pre>
         *
         * @returns {MapUtil}
         */
        addControl: function () {
            var controlOption = this.option.option.mapControl;
            for (var i = 0; i < controlOption.length; i++) {
                var type = controlOption[i].type;
                var control = new BMap[type + 'Control'](controlOption[i].properties);
                this.option.map.addControl(control);
            }
            return this;
        }
    };

})();

