/**
 * Created by lWX242305 on 2015/6/11.
 */
(function () {

    var p = {
        mapPath: "http://webapi.amap.com/maps",
        version: 1.3,
        key: "77c9006122a14e0948e43e1a7a5441d7",
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
                theme: 'normal', //地图主题色， 目前支持normal（默认样式）、dark（深色样式）、light（浅色样式）、fresh(osm风格清新样式)四种
                lang: "zh_cn", // 设置地图语言类型，中文简体
                skin: "default",
                center: [116.404, 39.915],
                zoomLevel: 5,
                mapType: 0,

                /**
                 * <pre>
                 * <h2>目前官方支持的控件包含：</h2>
                 *    缩放控制条-地图工具条（ToolBar）、
                 *    缩略图-鹰眼(OverView)、
                 *    比例尺（Scale）
                 * </pre>
                 */
                mapControl: [
                    {
                        type: 'ToolBar',
                        properties: {
                            ruler: true, //	标尺键盘是否可见，默认为true
                            direction: true, //	方向键盘是否可见，默认为true
                            autoPosition: false // 是否自动定位，即地图初始化加载完成后，是否自动定位的用户所在地，该功能仅在支持HTML5的浏览器中有效，默认为false
                        }
                    },
//                    {
//                        type: 'OverView',
//                        properties: {
//                            isOpen: true,	//	鹰眼是否展开，默认为false
//                            visible: true // 鹰眼是否显示，默认为true
//                        }
//                    },
                    {
                        type: 'MapType',
                        properties: {
                            defaultType: 0, //使用2D地图
//                            defaultType: 1, // 默认显示卫星图
                            showTraffic: false, // 叠加实时交通图层
                            showRoad: true, // 叠加路网图层
                            visible: false
                        }
                    }
                ]
            },
            /**
             * 大屏配置模板
             */
            plantsOption: {
                theme: 'normal', //地图主题色， 目前支持normal（默认样式）、dark（深色样式）、light（浅色样式）、fresh(osm风格清新样式)四种
                lang: "zh_cn", // 设置地图语言类型，中文简体
                skin: "plants",
                center: [116.404, 39.915],
                zoomLevel: 5,
                mapType: 0,
                mapControl: [
                    {
                        type: 'ToolBar',
                        properties: {
                            offset: window.AMap ? new AMap.Pixel(1160, 300) : undefined, // 重新定义显示位置
                            ruler: true, //	标尺键盘是否可见，默认为true
                            direction: true, //	方向键盘是否可见，默认为true
                            autoPosition: false // 是否自动定位，即地图初始化加载完成后，是否自动定位的用户所在地，该功能仅在支持HTML5的浏览器中有效，默认为false
                        }
                    },
                    {
                        type: 'MapType',
                        properties: {
                            defaultType: 1, // 默认显示卫星图
                            showTraffic: false, // 叠加实时交通图层
                            showRoad: true, // 叠加路网图层
                            visible: true
                        }
                    }
                ]
            }
        },

        /**
         * 设置组件根路径
         * @private
         */
        _path: function () {
            var path, idx, sList = document.getElementsByTagName("script");
            for (var i = 0; i < sList.length; i++) {
                path = sList[i].getAttribute("src");
                if (path) {
                    path = path.substr(0, path.toLowerCase().indexOf("maputil.js"));
                    idx = path.lastIndexOf("/");
                    if (idx > 0)
                        path = path.substring(0, idx + 1);
                    if (path)
                        break;
                }
            }
            return path;
        },

        /**
         * 地图配置
         * @param id 容器ID
         * @param option 配置参数
         * @returns {MapUtil}
         */
        Config: function (id, option) {
            this.ready = window.AMap ? true : false;
            option = $.extend({}, p, MapUtil.OptionTemplates['default'], option);
            this.option = {map: {}, option: option, container: id};
            return this;
        },

        /**
         * 地图事件
         * @returns {MapUtil}
         */
        Instance: function () {
            if (!this.ready) return this;
            var p = this.option;
            var lng = p.option.center[0];
            var lat = p.option.center[1];
            // 创建地图实例
            p.map = new AMap.Map(p.container, {
                resizeEnable: true,
                view: new AMap.View2D({ // 创建地图二维视口
                    center: this.createPoint(lng, lat), // 创建中心点坐标
                    zoom: p.option.zoomLevel // 设置地图缩放级别
                }),
                //初始化时，加载google地图
//                layers: [new AMap.TileLayer({
//                    tileUrl: "http://mt{1,2,3,0}.google.cn/vt/lyrs=m@142&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galil" //取图地址
//                })],
                lang: p.option.lang || "zh_cn"
            });
            p.option.theme && p.map.setMapStyle(p.option.theme);

            // 自定义皮肤设置
            var skin = p.option.skin || "default";
            if (skin != 'default') {
                var mapSkin = document.getElementById('mapSkin');
                if (mapSkin) {
                    mapSkin.href = this._path() + 'skin/' + skin + '/skin.css';
                } else {
                    var el = document.createElement('link');
                    el.id = 'mapSkin';
                    el.type = 'type="text/css"';
                    el.rel = 'stylesheet';
                    el.href = this._path() + 'skin/' + skin + '/skin.css';
                    (document.getElementsByTagName('head')[0] || document.body).appendChild(el);
                }
            }

            // 添加控件
            var controlOption = p.option.mapControl;
            for (var i = 0; i < controlOption.length; i++) {
                var type = controlOption[i].type;
                var properties = controlOption[i].properties;
                // 设置默认MapType
                if (p.option.mapType) {
                    properties = $.extend({}, properties, {defaultType: p.option.mapType || 0});
                }
                this.addControls(p.map, type, properties);
            }

//            this.fitView(p.map);
            return this;
        },

        /**
         * 向地图添加控件
         *
         * <pre>
         * <b>地图API中提供的控件有：</b>
         *
         *    ToolBar：地图平移缩放控件，默认位于地图左上方，它包含控制地图的平移和缩放的功能。
         *    OverView：缩略地图控件，默认位于地图右下方，是一个可折叠的缩略地图。
         *    Scale：比例尺控件，默认位于地图左下方，显示地图的比例关系。
         *    MapType：地图类型控件，默认位于地图右上方。
         * </pre>
         *
         * @returns {MapUtil}
         */
        addControls: function (map, type, properties) {
            if (!this.ready) return this;

            map.plugin(["AMap." + type], function () {
                var control = new AMap[type](properties);
                map.addControl(control);

                // 隐藏定位小部件
                if (type == 'ToolBar')
                    control.hideLocation();

                // 隐藏MapType控件
                if (type == 'MapType')
                    properties && !properties.visible && control.hide();
            });
            return this;
        },

        /**
         * 创建坐标点（Point）
         * @param lng 经度
         * @param lat 纬度
         * @returns {LngLat}
         */
        createPoint: function (lng, lat) {
            if (!this.ready) return this;
            return new AMap.LngLat(lng, lat);
        },

        /**
         * 创建图标（Icon）
         * @param url 图标图片地址
         * @param options 图标样式参数
         * @returns {Icon}
         */
        createIcon: function (url, options) {
            if (!this.ready) return this;
            return new AMap.Icon({
                image: url,
                size: new AMap.Size(options.width, options.height),
                imageSize: new AMap.Size(options.width, options.height),
                imageOffset: new AMap.Pixel(options.offset[0] || 0, options.offset[1] || 0)
            });
        },

        /**
         * 添加标注(Marker)
         *
         * @param point
         * @param options
         * @return {Marker}
         */
        createMarker: function (point, options) {
            if (!this.ready) return this;
            options = $.extend({
                position: point,
                topWhenClick: true,
                topWhenMouseOver: true
            }, options);
            var marker = new AMap.Marker(options);

            if (options.label) {
                // 自定义点标记内容
                var markerContent = document.createElement("span");
                if (options.id)
                    markerContent.id = options.id;
                markerContent.className = "marker-content-box";

                //点标记中的图标
                var icon = marker.getIcon();
                var markerImg = document.createElement("img");
                markerImg.className = "marker-content-icon";
                if (this.option.option.skin == 'default')
                    markerImg.style.cssText = "display: inline-block; border: none;";
                markerImg.src = icon && !(icon instanceof String) ? icon.get('image') : icon;
                markerContent.appendChild(markerImg);

                //点标记中的文本
                var markerSpan = document.createElement("span");
                markerSpan.className = "marker-content-label";
                if (this.option.option.skin == 'default') {
                    markerSpan.style.cssText = 'margin: 0 auto; ' +
                        'font-size: 12px; color: #333; position: absolute; ' +
                        'text-shadow: rgb(174, 174, 174) 1px 1px 2px; text-align: center; ' +
                        'border: 1px solid #666; box-shadow: rgba(53, 53, 53, 0.5) 2px 2px 5px; border-radius: 3px; ' +
                        'background-color: #FFFFFF; padding: 1px 5px; ';
                }
                markerSpan.style.cssText += 'left: ' +
                    ((icon && !(icon instanceof String) ? icon.getImageSize().getWidth() : 36) - 3) + 'px; ' +
                    'top: ' +
                    (-(icon && !(icon instanceof String) ? icon.getImageSize().getHeight() : 36) / 2 - 3) + 'px;';
                markerSpan.innerHTML = '<nobr>' + options.label + '</nobr>';
                markerContent.appendChild(markerSpan);

                marker.setContent(markerContent);
            }

            // 点击区域设置
            marker.setShape(AMap.MarkerShape({
                type: 'rect',
                coords: [
                    0,
                    0,
                    (icon && !(icon instanceof String) ? icon.getImageSize().getWidth() : 36),
                    (icon && !(icon instanceof String) ? icon.getImageSize().getHeight() : 36)
                ]
            }));

            // 添加事件
            if (options && options.event) {
                if (options.event && options.event.type) {
                    AMap.event.addListener(marker, options.event.type, function (e) {
                        options.event.process
                        && (typeof options.event.process == 'function')
                        && options.event.process(e);
                    });
                }
            }

            return marker;
        },

        /**
         * 向地图中添加覆盖物(Overlay)
         * @param map
         * @param overlay
         * @return {MapUtil}
         */
        addOverlay: function (map, overlay) {
            if (!this.ready) return this;
            overlay.setMap(map);
            return this;
        },

        /**
         * 添加点聚合
         * @param map
         * @param cluster
         * @param markers
         * @param styles
         * @return {* || Cluster}
         */
        addCluster: function (map, cluster, markers, styles) {
            if (!this.ready) return {};
            if (cluster) {
                cluster.setMap(null);
            }
            if (styles) {
                map.plugin(["AMap.MarkerClusterer"], function () {
                    cluster = new AMap.MarkerClusterer(map, markers, {
                        gridSize: 60,
                        averageCenter: true,
                        styles: styles
                    });
                });
            } else {
                map.plugin(["AMap.MarkerClusterer"], function () {
                    cluster = new AMap.MarkerClusterer(map, markers, {
                        gridSize: 60,
                        averageCenter: true
                    });
                });
            }
            return cluster;
        },

        /**
         * 使地图自适应显示到合适的范围
         *
         * @returns {LngLat || Point} 新的中心点
         */
        fitView: function (map) {
            if (!this.ready) return map.getCenter();
            return map.setFitView();
        },

        /**
         * 定位到指定点
         * @param map
         * @param lng 经度
         * @param lat 纬度
         * @param zoomLevel 定位缩放级别（默认最大）
         * @returns {boolean} 是否定位成功
         */
        panToPoint: function (map, lng, lat, zoomLevel) {
            if (!this.ready) return false;
            var p = MapUtil.createPoint(lng, lat);
            if (zoomLevel) {
                map.setZoom(zoomLevel);
                setTimeout(function () {
                    map.panTo(p);
                }, 200);
            }
            else {
                setTimeout(function () {
                    map.setFitView([MapUtil.createMarker(p)]);
                }, 200);
            }
            return true;
        },

        /**
         * 清除地图上的覆盖物
         * @param map
         * @return {MapUtil}
         */
        clearMap: function (map) {
            if (!this.ready) return this;
            map.clearMap();
            return this;
        }

    };

})();
