define('SocketJS', ['jquery'], function () {

    /**
     * <b>WebSocket JS</b>
     *
     * <p>使用：</p>
     * <pre>
     * var data = {};
     * SockJs.listen("allDevSignalSocketListener", data);
     * SockJs.register("allDevSignalSocketListener", function (res) {
     * });
     * </pre>
     */
    var SockJs = {};

    var __serval_start; // 心跳计时器

    // 图表对象缓存
    SockJs.Cache = {};

    SockJs.Config = {
        debug: false,
        health_timeout: 60000,
        health_keep: 3000,
        last_health: -1,
        url: 'ws://localhost/websocket.ws',
        busiTypes: {}
    };

    SockJs.Status = {
        CONNECTING: 0, // websocket正尝试与服务器建立连接
        OPEN: 1, // websocket与服务器已经建立连接
        CLOSING: 2, // websocket正在关闭与服务器的连接
        CLOSED: 3 // websocket已经关闭了与服务器的连接
    };

    /**
     * 连接WebSocket监听数据
     *
     * @param url WebSocket地址
     * @param bizName 业务名称
     * @param param 传递参数
     * @param callback 数据变化触发回调方法
     * @param options 配置
     * @returns {*}
     */
    SockJs.connection = function (url, bizName, param, callback, options) {
        if (!url) return;

        var p = $.extend({}, SockJs.Config, options);

        var ws = null;
        try {
            if ("WebSocket" in window) {
                ws = new WebSocket(url);
            } else if ("MozWebSocket" in window) {
                ws = new MozWebSocket(url);
            } else {
                if (p.debug) {
                    console.debug("The browser don't support the WebSocket");
                }
            }
        }
        catch (e) {
            console.error("create WebSocket(" + url + ") error!");
            return;
        } finally {
            SockJs.cache[url] = ws;
        }
        if (ws) {
            ws.onopen = function () {
                if (p.debug) {
                    console.debug("connect success");
                }
                __serval_start = setInterval(SockJs.keepAlive, p.health_keep);
            };
            ws.onclose = function () {
                if (p.debug) {
                    console.log("disconnect success");
                }
            };
            ws.onerror = function () {
                if (p.debug) {
                    console.log("sorry, it get error");
                }
            };
            ws.onmessage = function (receiveMsg) {
                if (p.debug) {
                    console.log("send message: ", receiveMsg);
                }
                if (!receiveMsg || !receiveMsg.data) {
                    return receiveMsg;
                }
                var jsonObject = eval('(' + receiveMsg.data + ')');
                if (jsonObject.bizName == undefined || jsonObject.data == undefined) {
                    return;
                }
                if (SockJs.busiTypes[jsonObject.bizName] == undefined) {
                    return;
                }

                SockJs.busiTypes[jsonObject.bizName](jsonObject.data);
            };
        }

        return ws;
    };

    /**
     *
     * @param bizName
     * @param data
     */
    SockJs.sendMessage = function (bizName, data) {
        var json = {};
        json.bizName = bizName;
        json.data = data;
        json.type = "1";
        var jsonData = JSON.stringify(json);
        if (1 == SockJs.wso.readyState) {
            SockJs.busiTypes[bizName].data = jsonData;
            SockJs.ws.send(jsonData);
        }
    };

    /**
     * 间隔发送心跳包数据给服务器，服务器在一定时间内发回心跳包响应，对比超时限定;
     * 如果超过设定的超时时间，则认为当前与服务器的websocket连接已经断开，关闭当前web socket连接
     */
    SockJs.keepAlive = function () {
        var time = new Date();
        if (SockJs.last_health != -1 && (time.getTime() - SockJs.last_health > SockJs.health_timeout)) {
            //连接断开，重连或者关闭连接
            if (SockJs.wso) {
                SockJs.close();
                SockJs.init();
            }
        } else {
            //连接正常
            if (SockJs.wso && SockJs.wso.bufferedAmount > 0) {
                for (var type in SockJs.busiTypes) {
                    if (SockJs.busiTypes.hasOwnProperty(type)) {
                        SockJs.relisten(type);
                    }
                }
            }
            SockJs.last_health = time.getTime();
        }
    };

    SockJs.reListen = function (bizName) {
        if (SockJs.wso == undefined) {
            SockJs.init();
        }
        if (1 == SockJs.wso.readyState) {
            SockJs.wso.send(SockJs.busiTypes[bizName].data);
        }
    };

    SockJs.close = function () {
        if (SockJs.wso == undefined) {
            return;
        }
        if (1 == this.wso.readyState) {
            SockJs.wso.close();
        }
    };

    SockJs.register = function (busiType, backFunction) {
        SockJs.busiTypes[busiType] = backFunction;
    };

    return SockJs;
});