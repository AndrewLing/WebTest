/**
 * Created by lWX242305 on 2015/6/11.
 */
window.MapUtil = {};
(function () {

    var p = {
        key: "77c9006122a14e0948e43e1a7a5441d7",
        services: true
    };

    window.MapUtil = {
        Themes: {
            normal: [],
            dark: [
                {
                    featureType: "water",
                    stylers: [
                        {hue: "#000000"},
                        {saturation: -100},
                        {lightness: -85}
                    ]
                }, {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [
                        {hue: "#005E61"},
                        {lightness: -60},
                        {visibility: "simplified"}
                    ]
                }, {
                    featureType: "landscape",
                    elementType: "geometry",
                    stylers: [
                        {hue: "#133F58"},
                        {saturation: -68},
                        {lightness: -68}
                    ]
                }, {
                    featureType: "poi.park",
                    elementType: "geometry",
                    stylers: [
                        {hue: "#138F28"},
                        {saturation: -8},
                        {lightness: -80}
                    ]
                }, {
                    featureType: "road",
                    elementType: "labels",
                    stylers: [
                        {hue: "#ffffff"},
                        {saturation: 86},
                        {lightness: 8}
                    ]
                }
            ],
            light: [
                {
                    featureType: "water",
                    stylers: [
                        {hue: "#99C9C9"},
                        {saturation: -100},
                        {lightness: -8}
                    ]
                }, {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [
                        {lightness: 25}
                    ]
                }, {
                    featureType: "landscape",
                    elementType: "geometry",
                    stylers: [
                        {hue: "#033447"},
                        {saturation: -100},
                        {lightness: 25}
                    ]
                }
            ],
            fresh: [
                {
                    featureType: "water",
                    stylers: [
                        {hue: "#90CCCB"},
                        {saturation: 20},
                        {lightness: -58}
                    ]
                }, {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [
                        {hue: "#E5E9A0"},
                        {lightness: -58},
                        {saturation: 20},
                        {visibility: "simplified"}
                    ]
                }, {
                    featureType: "landscape",
                    elementType: "geometry",
                    stylers: [
                        {hue: "#a6a6a6"},
                        {lightness: 50}
                    ]
                }
            ]
        },
        /**
         * 配置模板
         */
        OptionTemplates: {
            /**
             * 默认配置模板
             */
            default: {
                theme: 'normal', //地图主题色， 目前支持normal（默认样式）、dark（深色样式）、light（浅色样式）、fresh(osm风格清新样式)四种
                lang: "zh_cn", // 设置地图语言类型，中文简体 TODO 暂不支持
                skin: "default",
                center: [116.404, 39.915],
                zoomLevel: 5,
                limitBounds: [[128, -65], [127, 65]],
                /**
                 * mapType 包括如下四种类型：
                 * (0)google.maps.MapTypeId.ROADMAP：显示普通的街道地图
                 * (1)google.maps.MapTypeId.SATELLITE：显示卫星图像
                 * (2)google.maps.MapTypeId.TERRAIN：显示带有自然特征（如地形和植被）的地图
                 * (3)google.maps.MapTypeId.HYBRID：显示卫星图像的主要街道透明层
                 */
                mapType: 0,

                /**
                 * <pre>
                 * <h2>目前官方支持的控件包含：</h2>
                 *    缩放控制条-地图工具条（ToolBar）、
                 *    缩略图-鹰眼(OverView)、
                 *    比例尺（Scale）
                 * </pre>
                 */
                mapControl: {
                    panControl: {
                        show: true
                    },
                    zoomControl: {
                        show: true,
                        properties: {
                            //style: google.maps.ZoomControlStyle.SMALL,// 显示最小化zoom 控件
                            //style: google.maps.ZoomControlStyle.LARGE, //显示标准zoom滑动控件
                            style: google.maps.ZoomControlStyle.DEFAULT //基于设备和地图大小，选择最合适的控件
                        }
                    },
                    mapTypeControl: {
                        show: false
                    },
                    scaleControl: {
                        show: false
                    },
                    streetViewControl: {
                        show: false
                    },
                    overviewMapControl: {
                        show: false
                    },
                    rotateControl: {
                        show: false
                    }
                }
            },
            /**
             * 大屏配置模板
             */
            plants: {
                theme: 'normal', //地图主题色， 目前支持normal（默认样式）、dark（深色样式）、light（浅色样式）、fresh(osm风格清新样式)四种
                skin: "plants",
                center: [116.404, 39.915],
                zoomLevel: 3,
                limitBounds: [[128, -65], [127, 65]],
                mapType: 1,
                mapControl: {
                    panControl: {
                        show: true,
                        properties: {
                            position: google.maps.ControlPosition.RIGHT_CENTER
                        }
                    },
                    zoomControl: {
                        show: true,
                        properties: {
                            position: google.maps.ControlPosition.RIGHT_CENTER,
                            style: google.maps.ZoomControlStyle.DEFAULT
                        }
                    },
                    mapTypeControl: {
                        show: true,
                        properties: {
                            position: google.maps.ControlPosition.TOP_CENTER, // 位置控制
                            //position: google.maps.ControlPosition.LEFT_BOTTOM, // 位置控制
                            //position: google.maps.ControlPosition.RIGHT_BOTTOM, // 位置控制
                            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR, //用于在水平栏中将一组控件显示为如 Google Maps 中所示按钮。
                            //style: google.maps.MapTypeControlStyle.DROPDOWN_MENU, //用于显示单个按钮控件，以便您从下拉菜单中选择地图类型。
                            //style: google.maps.MapTypeControlStyle.DEFAULT //用于显示"默认"的行为，该行为取决于屏幕尺寸，并且可能会在 API 以后的版本中有所变化。
                        }
                    },
                    scaleControl: {
                        show: false,
                        properties: {}
                    },
                    streetViewControl: {
                        show: false,
                        properties: {}
                    },
                    overviewMapControl: {
                        show: false,
                        properties: {}
                    },
                    rotateControl: {
                        show: false,
                        properties: {}
                    }
                }
            }
        },

        /**
         * 地图配置
         * @param id 容器ID
         * @param option 配置参数
         * @returns {MapUtil}
         */
        Config: function (id, option) {
            this.ready = window.google.maps ? true : false;
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

            var mapOption = {
                center: this.createPoint(lng, lat), // 创建中心点坐标
                zoom: p.option.zoomLevel, // 设置地图缩放级别
                minZoom: 3,
                maxZoom: 18,
                //disableDefaultUI: true,
                mapTypeId: [
                    google.maps.MapTypeId.ROADMAP, // 显示普通的街道地图
                    google.maps.MapTypeId.HYBRID, // 显示卫星图像的主要街道透明层
                    google.maps.MapTypeId.SATELLITE, // 显示卫星图像
                    google.maps.MapTypeId.TERRAIN // 显示带有自然特征（如地形和植被）的地图
                ][p.option.mapType % 4 || 0],
                lang: p.option.lang || "zh_cn", // TODO 语言设置 暂不支持
                tilt: 0 // TODO 停用 45° 图像 无效
            };
            // 创建地图实例
            p.map = new google.maps.Map(document.getElementById(p.container), mapOption);
            // p.option.theme && p.map.setMapStyle(p.option.theme);
            p.map.setOptions({styles: this.Themes[p.option.theme || 'normal']});

            // 添加控件
            var controlOption = p.option.mapControl;
            for (var t in controlOption) {
                this.addControls(p.map, t, controlOption[t]);
            }
            // TODO 自定义地图缩放范围
            //google.maps.event.addListener(p.map, 'zoom_changed', function () {
            //    if (p.map.getZoom() < 3) p.map.setZoom(3);
            //    if (p.map.getZoom() > 18) p.map.setZoom(18);
            //});
            // 自定义地图的显示范围
            var limitBounds = p.option.limitBounds;
            var strictBounds = new google.maps.LatLngBounds(
                this.createPoint(limitBounds[0][0], limitBounds[0][1]),
                this.createPoint(limitBounds[1][0], limitBounds[1][1])
            );
            google.maps.event.addListener(p.map, 'bounds_changed', function () {
                if (strictBounds.contains(p.map.getCenter())) return;
                var c = p.map.getCenter(), x = c.lng(), y = c.lat();
                var maxX = strictBounds.getNorthEast().lng(), maxY = strictBounds.getNorthEast().lat();
                var minX = strictBounds.getSouthWest().lng(), minY = strictBounds.getSouthWest().lat();
                //if (x < minX) x = minX;
                //if (x > maxX) x = maxX;
                if (y < minY) y = minY;
                if (y > maxY) y = maxY;
                p.map.panTo(MapUtil.createPoint(x, y));
            });
            // TODO 大小自适应
            $('#' + p.container).resize(function () {
                google.maps.event.trigger(p.map, 'resize');
                p.map.setCenter(MapUtil.createPoint(lng, lat));
            });
            // 自定义皮肤设置
            var skin = p.option.skin || "default";
            var mapSkin = document.getElementById('mapSkin');
            if (mapSkin) {
                mapSkin.href = MapTools._path() + 'skin/' + skin + '/skin.css';
            } else {
                var el = document.createElement('link');
                el.id = 'mapSkin';
                el.type = 'type="text/css"';
                el.rel = 'stylesheet';
                el.href = MapTools._path() + 'skin/' + skin + '/skin.css';
                (document.getElementsByTagName('head')[0] || document.body).appendChild(el);
            }

//            this.fitView(p.map);
            return this;
        },

        /**
         * 向地图添加控件
         * @returns {MapUtil}
         */
        addControls: function (map, type, properties) {
            if (!this.ready) return this;
            var c = {};
            c[type] = properties.show;
            c[type + 'Options'] = properties.properties;
            map.setOptions(c);
            return this;
        },

        /**
         * 创建坐标点（Point）
         * @param lng 经度
         * @param lat 纬度
         * @returns {LatLng}
         */
        createPoint: function (lng, lat) {
            if (!this.ready) return this;
            return new google.maps.LatLng(lat, lng); // location, （纬度, 经度）
        },

        /**
         * 创建图标（Icon）
         * @param url 图标图片地址
         * @param options 图标样式参数
         * @returns {Icon}
         */
        createIcon: function (url, options) {
            if (!this.ready) return this;
            var w = options.width || 20, h = options.height || 28;
            var x = options.offset ? +options.offset.x * -1 : w / 2, y = options.offset ? +options.offset.y * -1 : h / 2;
            return {
                url: url || MapTools._path() + 'gmapv3/mapfiles/markers/marker_sprite.png',
                size: new google.maps.Size(w, h),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(x || 0, y || 0)
            };
        },

        /**
         * 添加标注(Marker)
         *
         * @param point {LngLat || LatLng}
         * @param options {*}
         * @return {Marker || MarkerWithLabel}
         */
        createMarker: function (point, options) {
            if (!this.ready) return this;
            options = $.extend({
                position: point,
                topWhenClick: true,
                topWhenMouseOver: true,
                cursor: 'default'
            }, options);
            if (options.width && options.height) {
                options = $.extend({
                    shape: {
                        coords: [
                            1, 1,
                            1, options.height,
                            options.width, options.height,
                            options.width, 1
                        ],
                        type: 'poly'
                    }
                }, options);
            }
            if (options.icon && typeof options.icon == 'string') {
                options.icon = MapUtil.createIcon(options.icon, {
                    width: options.width || 18,
                    height: options.height || 18,
                    offset: options.offset || {y: -1 * options.width || -18, x: -1 * options.height || -18}
                });
            }

            var x = options.offset ? +options.offset.x * -1 : options.icon.anchor.x;
            var y = options.offset ? +options.offset.y * -1 : options.icon.anchor.y;
            options = $.extend({
                labelContent: options.label,
                labelAnchor: new google.maps.Point(options.width * -0.5, options.height * 1.2),
                labelClass: "gmap-marker-labels",
                labelStyle: {opacity: 1},
                labelVisible: !!(options.label)
            }, options);
            //console.log(options);
            var marker = new MarkerWithLabel(options);

            // 添加事件
            if (options && options.events) {
                for (var event in options.events) {
                    google.maps.event.addDomListener(marker, event, function (e) {
                        options.events[event]
                        && (typeof options.events[event] == 'function')
                        && options.events[event](e);
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
            if (cluster && typeof cluster == 'MarkerClusterer') {
                //cluster.setMap(null);
                cluster.clearMarkers();
            }
            cluster = new MarkerClusterer(map, markers, {
                imagePath: MapTools._path() + 'gmapv3/mapfiles/markers/m',
                gridSize: 60,
                averageCenter: true,
                hideSingleGroupMarker: true,
                styles: styles || []
            });
            return cluster;
        },

        /**
         * 使地图自适应显示到合适的范围
         *
         * @returns {LngLat || LatLng} 新的中心点
         */
        fitView: function (map, markers) {
            if (!this.ready) return map.getCenter();
            //return map.setFitView();
            var bounds = new google.maps.LatLngBounds();
            if (markers) {
                for (var i = 0, marker; marker = markers[i]; i++) {
                    bounds.extend(marker.getPosition());
                }
            } else {
                bounds.extend(map.getCenter());
            }
            this.map_.fitBounds(bounds);
            return map.getCenter();
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
            var p = this.createPoint(lng, lat);
            if (zoomLevel) {
                map.setZoom(zoomLevel);
                setTimeout(function () {
                    map.panTo(p);
                }, 200);
            }
            else {
                setTimeout(function () {
                    this.fitView(map, [MapUtil.createMarker(p)]);
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
            //console.log(map);
            try {
                //map.clearMap();
                //map.clearOverlays();
                map.clearMarkers();
            } catch (e) {
                console.log(e);
            }
            return this;
        }

    };

})();
