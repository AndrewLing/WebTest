/**
 * Created by PL02053 on 2016/3/9.
 */
(function (w) {
    /**
     * 将需要加载的js添加到队列
     */
    var files = [];
    /**
     * 正在加载的js队列
     * @type {Array}
     */
    var reqCalls = [], inCheckLoaded = false;
    var context = {};
    var checkLoadedTimeoutId;
    var isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document),
        isWebWorker = !isBrowser && typeof importScripts !== 'undefined';

    function isFunction(it) {
        return typeof it === 'function';
    }

    function isArray(it) {
        return it instanceof Array;
    }

    /**
     *
     * @param paths {Array}
     */
    function markRequire(paths) {
        var temp;
        if (paths && isArray(paths)) {
            for (var i = 0; i < paths.length; i++) {
                temp = paths[i];
                if (files.indexOf(temp) < 0) {
                    files.push(temp);
                }
            }
        }
    }

    /**
     * 加载js
     * @param src {String}
     * @param callback {Function}
     */
    function loadScript(src, callback) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        if (callback && isFunction(callback)) {
            script.onload = function () {
                callback();
            }
        }
        document.getElementsByTagName('body')[0].appendChild(script);
        reqCalls.push(src);
    }

    function checkLoaded(callback, error) {
        if (reqCalls.length) {
            context.startTime = context.startTime || new Date().getTime();
            var waitInterval = require.config.waitSeconds * 1000,
                expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime();

            if (inCheckLoaded) {
                return;
            }
            inCheckLoaded = true;

            if (!expired && (isBrowser || isWebWorker) && !checkLoadedTimeoutId) {
                checkLoadedTimeoutId = setTimeout(function () {
                    checkLoadedTimeoutId = 0;
                    checkLoaded(callback, error);
                }, 50);
            } else {
                if (error && isFunction(error)) {
                    error();
                }
            }
            inCheckLoaded = false;
        } else {
            if (checkLoadedTimeoutId) {
                clearTimeout(checkLoadedTimeoutId);
            }
            if (callback && isFunction(callback)) {
                callback();
            }
        }
    }

    var require = function (ary, callback, error) {
        markRequire(ary);
        context = {};

        var scripts, temp;
        if (files.length) {
            scripts = [];
            Array.prototype.push.apply(scripts, document.getElementsByTagName('script'));
            scripts.every(function (script, index, arr) {
                arr[index] = script.getAttribute('src') || script.text;
                return true;
            });
            for (var i = 0; i < files.length; i++) {
                temp = files[i];
                if (scripts.indexOf(temp) < 0) { // 没有加载过的js
                    loadScript(temp, (function (temp) {
                        return (function () {
                            var index = reqCalls.indexOf(temp);
                            if (index > -1) {
                                reqCalls.splice(index, 1);
                            }
                        });
                    })(temp));
                }
            }
            checkLoaded(callback, error);
        } else {
            if (callback && isFunction(callback)) {
                callback();
            }
        }
    };

    require.config = {
        waitSeconds: 7,
        baseUrl: './'
    };

    if (typeof w.require == 'undefined') {
        w.require = require;
    }
})(window);

/**
 * 地图加载工具
 */
var MapTools = {};

MapTools.mapType = 'AMap';

MapTools.ready = function (callback, error) {
    var rootPath = MapTools._path();
    switch (MapTools.mapType) {
        case 'AMap':
            require(['http://webapi.amap.com/maps?v=1.3&key=77c9006122a14e0948e43e1a7a5441d7&plugin=AMap.PolyEditor,AMap.CircleEditor&callback=mapInit'], function () {
                window.mapInit && window.mapInit();
                window.mapInit = function () {
                    require([rootPath + 'AMapUtil.js'], function () {
                        callback && callback instanceof Function && callback();
                    }, error);
                };
            }, error);
            break;
        case 'BMap':
            require(['http://api.map.baidu.com/api?v=2.0&ak=xeBemF45MwVCkp1Df3tG8PkG'], function () {
                require([rootPath + 'BMapUtil.js'], function () {
                    callback && callback instanceof Function && callback();
                }, error);
            }, error);
            break;
        case 'GMap':
            require([rootPath + 'gmapv3/mapapi.js'], function () {
                require([
                    rootPath + 'gmapv3/MarkerClusterer.js',
                    rootPath + 'gmapv3/MarkerWithLabel.js',
                    rootPath + 'GMapUtil.js'
                ], function () {
                    callback && callback instanceof Function && callback();
                }, error);
            }, error);
            break;
    }
};

/**
 * 设置组件根路径
 */
MapTools._path = function () {
    var path, idx, sList = document.getElementsByTagName("script");
    for (var i = 0; i < sList.length; i++) {
        path = sList[i].src;
        if (path) {
            path = path.substr(0, path.toLowerCase().indexOf("maptools.js"));
            idx = path.lastIndexOf("/");
            if (idx > 0)
                path = path.substring(0, idx + 1);
            if (path)
                break;
        }
    }
    return path;
};