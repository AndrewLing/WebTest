/**
 * Created by p00034 on 2017-03-20.
 */
var topo3D = {
    LAZY_MIN: 1e3,
    LAZY_MAX: 6e3,
    CLEAR_COLOR: "#39609B",
    RES_PATH: "js/mono/images",
    lastElement: null,
    timer: 0,
    _creators: {},
    _filters: {},
    /**
     * 获取资源文件路径
     * @param res {String} 资源文件相对路径
     */
    getRes: function (res) {
        return topo3D.RES_PATH + "/" + res;
    },
    /**
     * 获取 HSV 颜色
     * @param h
     * @param s
     * @param v
     * @returns {string}
     */
    getHSVColor: function (h, s, v) {
        var r, g, b;
        if (h && void 0 === s && void 0 === v) {
            s = h.s;
            v = h.v;
            h = h.h;
        }
        var val = Math.floor(6 * h) % 6;
        switch (val) {
            case 0:
                r = v;
                g = v * (1 - (1 - (6 * h - Math.floor(6 * h))) * s);
                b = v * (1 - s);
                break;
            case 1:
                r = v * (1 - (6 * h - Math.floor(6 * h)) * s);
                g = v;
                b = v * (1 - s);
                break;
            case 2:
                r = v * (1 - s);
                g = v;
                b = v * (1 - (1 - (6 * h - Math.floor(6 * h))) * s);
                break;
            case 3:
                r = v * (1 - s);
                g = v * (1 - (6 * h - Math.floor(6 * h)) * s);
                b = v;
                break;
            case 4:
                r = v * (1 - (1 - (6 * h - Math.floor(6 * h))) * s);
                g = v * (1 - s);
                b = v;
                break;
            case 5:
                r = v;
                g = v * (1 - s);
                b = v * (1 - (6 * h - Math.floor(6 * h)) * s);
        }
        return "#" + this.toHex(255 * r) + this.toHex(255 * g) + this.toHex(255 * b);
    },
    /**
     * 转换为十六进制数
     * @param value 十进制数
     * @returns {string}
     */
    toHex: function (value) {
        var oct = parseInt(value).toString(16);
        if (1 == oct.length) {
            oct = "0" + oct;
        }
        return oct;
    },
    /**
     * 复制对象属性
     * @param src 数据源对象
     * @param dest 数据目标对象
     * @param propertyKeyArr 需要复制的属性集合
     */
    copyProperties: function (src, dest, propertyKeyArr) {
        if (src && dest)
            for (var prop in src)
                propertyKeyArr && propertyKeyArr.indexOf(prop) >= 0 || (dest[prop] = src[prop]);
    },

    /**
     * 注册图元构造器
     * @param key
     * @param value
     */
    registerCreator: function (key, value) {
        this._creators[key] = value;
    },
    /**
     * 获取图元构造器
     * @param key
     * @returns {*}
     */
    getCreator: function (key) {
        return this._creators[key];
    },
    /**
     * 注册图元过滤器
     * @param key
     * @param value
     */
    registerFilter: function (key, value) {
        this._filters[key] = value;
    },
    /**
     * 获取图元过滤器
     * @param key
     * @returns {*}
     */
    getFilter: function (key) {
        return this._filters[key];
    },


    /**
     * 初始化画布场景
     * @param id 容器ID
     */
    init: function (id) {
        // 创建3D画布
        var network = window.network = new mono.Network3D;

        // 类型搜索器
        topo3D.typeFinder = new mono.QuickFinder(network.getDataBox(), "type", "client");
        // 标签搜索器
        topo3D.labelFinder = new mono.QuickFinder(network.getDataBox(), "label", "client");

        // 设置默认镜头
        var camera = new mono.PerspectiveCamera(30, 1.5, 30, 3e4);
        network.setCamera(camera);
        // 设置光源
        topo3D.setupLights(network.getDataBox());

        // 设置交互处理器
        var handler = new mono.DefaultInteraction(network);
        handler.yLowerLimitAngle = Math.PI / 180 * 2;
        handler.yUpLimitAngle = Math.PI / 2;
        handler.maxDistance = 2e4;
        handler.minDistance = 50;
        handler.zoomSpeed = 3;
        handler.panSpeed = .2;
        // 设置编辑交互处理器
        var editHandler = new mono.EditInteraction(network);
        editHandler.setShowHelpers(true);
        editHandler.setScaleable(false);
        editHandler.setRotateable(false);
        editHandler.setTranslateable(true);

        network.setInteractions([handler, new mono.SelectionInteraction(network), editHandler]);

        network.isSelectable = function (a) {
            return network.moveView && "rack" === a.getClient("type");
        };
        network.editableFunction = function (a) {
            return network.moveView && "rack" === a.getClient("type");
        };

        document.getElementById(id).appendChild(network.getRootView());

        // 添加提示信息板
        var tooltip = new Tooltip(["BusinessId"], ["000000"]);
        document.body.appendChild(tooltip.getView());

        topo3D.setupToolbar([{
            label: "场景复位", icon: "reset.png", clickFunction: function () {
                topo3D.resetView(network)
            }
        }, {
            label: "调试信息", icon: "fps.png", clickFunction: function () {
                topo3D.toggleFpsView(network);
            }
        }]);
        mono.Utils.autoAdjustNetworkBounds(network, document.documentElement, "clientWidth", "clientHeight");

        network.getRootView().addEventListener("dblclick", function (e) {
            topo3D.handleDoubleClick(e, network);
        });
        network.getRootView().addEventListener("mousemove", function (e) {
            topo3D.handleMouseMove(e, network, tooltip);
        });

        network.getDataBox().getAlarmBox().addDataBoxChangeListener(function (e) {
            var target = e.data;
            if ("add" === e.kind) {
                var d = network.getDataBox().getDataById(target.getElementId());
                d.setStyle("m.alarmColor", null)
            }
        });
        network.getDataBox().addDataPropertyChangeListener(function (e) {
            var source = e.source,
                property = e.property,
                oldValue = e.oldValue,
                newValue = e.newValue;
            if ("position" == property && network.moveView && oldValue.y != newValue.y) {
                source.setPositionY(oldValue.y);
            }
        });

        network.addInteractionListener(function (e) {
            "liveMoveEnd" == e.kind && topo3D.dirtyShadowMap(network);
        });

        var start = (new Date).getTime();
        topo3D.loadData(network);
        var end = (new Date).getTime();
        console.log("time:  " + (end - start));

        topo3D.resetCamera(network);
    },
    /**
     * 场景复位
     * @param network
     */
    resetView: function (network) {
        topo3D.resetCamera(network);
        var nodes = [];
        network.getDataBox().forEach(function (node) {
            if ("rack" === node.getClient("type") && node.oldRack) {
                nodes.push(node);
            }
        });
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var oldRack = node.oldRack;
            node.alarm && network.getDataBox().getAlarmBox().remove(node.alarm);
            network.getDataBox().removeByDescendant(node, true);
            network.getDataBox().add(oldRack);

            oldRack.alarm && network.getDataBox().getAlarmBox().add(oldRack.alarm);
            oldRack.door.setParent(oldRack);
            oldRack.setClient("loaded", false);

            var door = oldRack.door;
            network.getDataBox().add(door);
            door.getClient("animated") && topo3D.playAnimation(door, door.getClient("animation"));
        }
        var doorNodes = [];
        network.getDataBox().forEach(function (node) {
            if ("left-door" === node.getClient("type") || "right-door" === node.getClient("type")) {
                doorNodes.push(node);
            }
        });
        for (i = 0; i < doorNodes.length; i++) {
            var doorNode = doorNodes[i];
            doorNode.getClient("animated") && topo3D.playAnimation(doorNode, doorNode.getClient("animation"));
        }
        network.moveView && topo3D.toggleMoveView(network);
    },
    /**
     * 镜头复位
     * @param network
     */
    resetCamera: function (network) {
        network.getCamera().setPosition(2e3, 1200, 3e3);
        network.getCamera().lookAt(new mono.Vec3(0, 0, 0));
    },
    /**
     * 设置光源
     * @param box
     */
    setupLights: function (box) {
        var light0 = new mono.PointLight(16777215, .3);
        light0.setPosition(0, 1e3, -1e3);
        box.add(light0);

        var light1 = new mono.PointLight(16777215, .3);
        light1.setPosition(0, 1e3, 1e3);
        box.add(light1);

        var light2 = new mono.PointLight(16777215, .3);
        light2.setPosition(1e3, -1e3, 1e3);
        box.add(light2);

        box.add(new mono.AmbientLight("white"));
    },
    /**
     * 创建工具条
     * @param objects {Array} 工具条操作配置项
     */
    setupToolbar: function (objects) {
        var preWidth = 32;
        var size = objects.length;

        var container = document.createElement("div");
        container.setAttribute("id", "toolbar");
        container.style.display = "block";
        container.style.position = "absolute";
        container.style.left = "10px";
        container.style.top = "75px";
        container.style.width = preWidth + "px";
        container.style.height = size * preWidth + preWidth + "px";
        container.style.background = "rgba(255, 255, 255, 0.75)";
        container.style["border-radius"] = "5px";
        document.body.appendChild(container);

        for (var i = 0; i < size; i++) {
            var obj = objects[i];
            var icon = obj.icon;

            var img = document.createElement("img");
            img.style.position = "absolute";
            img.style.left = "4px";
            img.style.top = preWidth / 2 + i * preWidth + "px";
            img.style["pointer-events"] = "auto";
            img.style.cursor = "pointer";
            img.setAttribute("src", topo3D.getRes(icon));
            img.style.width = "24px";
            img.style.height = "24px";
            img.setAttribute("title", obj.label);
            img.onclick = obj.clickFunction;
            container.appendChild(img);
        }
    },
    /**
     * 双击事件处理
     * @param event {Event}
     * @param network
     */
    handleDoubleClick: function (event, network) {
        var camera = network.getCamera();
        var handler = network.getDefaultInteraction();
        var cameraTarget = camera.getTarget();
        var target = topo3D.findFirstObjectByMouse(network, event);

        if (target) {
            var element = target.element;
            var point = target.point;

            if (element.getClient("animation")) {
                topo3D.playAnimation(element, element.getClient("animation"));
            } else if (element.getClient("dbl.func")) {
                var func = element.getClient("dbl.func");
                func && func();
            } else {
                topo3D.animateCamera(camera, handler, cameraTarget, point);
            }
        } else {
            var vec = new mono.Vec3(0, 0, 0);
            topo3D.animateCamera(camera, handler, cameraTarget, vec);
        }
    },
    /**
     * 鼠标移动事件处理
     * @param event
     * @param network
     * @param tooltip
     */
    handleMouseMove: function (event, network, tooltip) {
        var elements = network.getElementsByMouseEvent(event);
        var lastElement = null;
        var tooltipView = tooltip.getView();
        if (elements.length) {
            var e = elements[0], element = e.element;
            if ("card" === element.getClient("type")) {
                element.getClient("isAlarm");
                lastElement = element;
                tooltip.setValues([element.getClient("BID")]);
            }
        }
        if (topo3D.lastElement != lastElement) {
            clearTimeout(topo3D.timer);
            if (lastElement) {
                topo3D.timer = setTimeout(function () {
                    tooltipView.style.display = "block";
                    tooltipView.style.position = "absolute";
                    tooltipView.style.left = window.lastEvent.pageX - tooltipView.clientWidth / 2 + "px";
                    tooltipView.style.top = window.lastEvent.pageY - tooltipView.clientHeight - 15 + "px";
                }, 1000);
            }
        }
        topo3D.lastElement = lastElement;
        if (null == lastElement) {
            tooltipView.style.display = "none";
        }
        window.lastEvent = event;
    },
    /**
     * 加载配置数据
     * @param network
     */
    loadData: function (network) {
        var dataBox = network.getDataBox();
        var data = topo3D.filterJson(dataBox, dataJson.objects);

        network.setClearColor(topo3D.CLEAR_COLOR);

        var nodes = [], ops = [], nodeIds = [];
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var node = null;
            var creator = topo3D.getCreator(d.type);
            if (creator) {
                node = creator(d);
            }

            if (node) {
                var rotate = d.rotate || [0, 0, 0];

                node.shadow = d.shadow;
                node.setRotation(rotate[0], rotate[1], rotate[2]);
                d.style && node.s(d.style);
                if (d.client) {
                    for (var c in d.client)
                        node.setClient(c, d.client[c]);
                }

                if (d.shadowHost) {
                    dataBox.shadowHost = node;
                }

                if (d.op) {
                    nodes.push(node);
                    if (nodes.length > 1) {
                        ops.push(d.op);
                    }
                    nodeIds.push(node.getId());
                } else {
                    dataBox.add(node);
                }
            }
        }
        if (nodes.length > 0) {
            var comboNode = new mono.ComboNode(nodes, ops);
            comboNode.setNames(nodeIds);
            comboNode.setClient("type", "floorCombo");
            dataBox.add(comboNode);
        }
    },
    /**
     * 过滤JSON数据中的不合法数据
     * @param dataBox
     * @param data
     * @returns {Array}
     */
    filterJson: function (dataBox, data) {
        var result = [];
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var filter = topo3D.getFilter(d.type);
            if (filter) {
                var rd = filter(dataBox, d);
                if (rd) {
                    if (rd instanceof Array) {
                        result = result.concat(rd)
                    } else {
                        topo3D.copyProperties(d, rd, ["type"]);
                        result.push(rd);
                    }
                }
            } else result.push(d);
        }
        return result;
    },
    /**
     * 获取当前鼠标操作的第一个对象
     * @param network
     * @param event
     * @returns {*}
     */
    findFirstObjectByMouse: function (network, event) {
        var objects = network.getElementsByMouseEvent(event);
        if (objects.length) {
            for (var i = 0; i < objects.length; i++) {
                var obj = objects[i];
                var element = obj.element;
                if (!(element instanceof mono.Billboard)) {
                    return obj;
                }
            }
        }
        return null;
    },

    create2DPath: function (data) {
        var path = null;
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            if (path) {
                if (d.length > 3) {
                    path.curveTo(d[0], d[1], 0, d[2], d[3], 0);
                } else {
                    path.lineTo(d[0], d[1], 0);
                }
            } else {
                path = new mono.Path;
                path.moveTo(d[0], d[1], 0);
            }
        }
        return path;
    },
    create3DPath: function (data) {
        var path = null;
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            if (path) {
                if (d.length > 5) {
                    path.curveTo(d[0], d[1], d[2], d[3], d[4], d[5]);
                } else {
                    path.lineTo(d[0], d[1], d[2]);
                }
            } else {
                path = new mono.Path;
                path.moveTo(d[0], d[1], d[2]);
            }
        }
        return path;
    },

    /**
     * 创建镜头动画
     * @param camera 镜头对象
     * @param handler 处理器
     * @param start 镜头动画开始位置
     * @param end 镜头动画结束位置
     * @param callback 动画执行完成回调方法
     */
    animateCamera: function (camera, handler, start, end, callback) {
        var vecStart = camera.getPosition().sub(camera.getTarget());
        var animate = new twaver.Animate({
            from: 0, to: 1,
            dur: 500,
            easing: "easeBoth",
            onUpdate: function (e) {
                var vecX = start.x + (end.x - start.x) * e,
                    vecY = start.y + (end.y - start.y) * e,
                    vecZ = start.z + (end.z - start.z) * e;
                var vec = new mono.Vec3(vecX, vecY, vecZ);
                camera.lookAt(vec);
                handler.target = vec;
                var k = (new mono.Vec3).addVectors(vecStart, vec);
                camera.setPosition(k);
            }
        });
        animate.onDone = callback;
        animate.play();
    },
    /**
     * 创建抽屉动画
     * @param element
     * @param vec
     * @param callback
     */
    animatePullOut: function (element, vec, callback) {
        var d = element.getBoundingBox().size().multiply(element.getScale());
        var e = .8, g = 0;
        var endPosition = new mono.Vec3(0, 0, 1);
        if ("x" === vec) {
            endPosition = new mono.Vec3(1, 0, 0);
            g = d.x;
        }
        if ("-x" === vec) {
            endPosition = new mono.Vec3(-1, 0, 0);
            g = d.x;
        }
        if ("y" === vec) {
            endPosition = new mono.Vec3(0, 1, 0);
            g = d.y;
        }
        if ("-y" === vec) {
            endPosition = new mono.Vec3(0, -1, 0);
            g = d.y;
        }
        if ("z" === vec) {
            endPosition = new mono.Vec3(0, 0, 1);
            g = d.z;
        }
        if ("-z" === vec) {
            endPosition = new mono.Vec3(0, 0, -1);
            g = d.z;
        }
        g *= e;
        element.getClient("animated") && (endPosition = endPosition.negate());
        var position = element.getPosition().clone();
        element.setClient("animated", !element.getClient("animated"));
        new twaver.Animate({
            from: 0,
            to: 1,
            dur: 2000,
            easing: "bounceOut",
            onUpdate: function (value) {
                element.setPosition(position.clone().add(endPosition.clone().multiplyScalar(g * value)))
            },
            onDone: function () {
                topo3D.animationFinished(element);
                callback && callback();
            }
        }).play();
    },
    /**
     * 创建旋转动画
     * @param element
     * @param vec
     * @param rotate
     * @param ease
     * @param callback
     */
    animateRotate: function (element, vec, rotate, ease, callback) {
        ease = ease || "easeInStrong";
        var f = element.getBoundingBox().size().multiply(element.getScale());
        var form = 0, to = 1;
        element.getClient("animated") && (to = -1);
        element.setClient("animated", !element.getClient("animated"));
        var i, j;
        if ("left" === vec) {
            i = new mono.Vec3(-f.x / 2, 0, 0);
            j = new mono.Vec3(0, 1, 0);
        }
        if ("right" === vec) {
            i = new mono.Vec3(f.x / 2, 0, 0);
            j = new mono.Vec3(0, 1, 0);
        }
        new twaver.Animate({
            from: form, to: to, dur: 1500, easing: ease,
            onUpdate: function (value) {
                void 0 === this.lastValue && (this.lastValue = 0);
                element.rotateFromAxis(j.clone(), i.clone(), Math.PI / 180 * rotate * (value - this.lastValue));
                this.lastValue = value;
            },
            onDone: function () {
                delete this.lastValue;
                topo3D.animationFinished(element);
                callback && callback();
            }
        }).play();
    },
    /**
     * 执行动画
     * @param element
     * @param animateOption
     * @param callback
     */
    playAnimation: function (element, animateOption, callback) {
        var properties = animateOption.split(".");
        if ("pullOut" === properties[0]) {
            var vec = properties[1];
            topo3D.animatePullOut(element, vec, callback);
        }
        if ("rotate" === properties[0]) {
            var vec = properties[1], rotate = properties[2], ease = properties[3];
            topo3D.animateRotate(element, vec, rotate, ease, callback);
        }
    },
    /**
     * 结束动画
     * @param element
     */
    animationFinished: function (element) {
        var func = element.getClient("animation.done.func");
        func && func();
    }
};


/**
 * ToolTip定义
 */
Tooltip = function (keys, values) {
    this.mainContent = document.createElement("div");
    this.keys = keys;
    this.values = values;
    this.init();
};
twaver.Util.ext("Tooltip", Object, {
    init: function () {
        this.mainContent.setAttribute("class", "tooltip");
        this.mainContent.setAttribute("id", "tooltip");
        this.table = document.createElement("table");

        for (var i = 0; i < this.keys.length; i++) {
            var tr = document.createElement("tr");

            var keyTd = document.createElement("td");
            keyTd.setAttribute("class", "tooltip-key");
            keyTd.innerHTML = this.keys[i];

            tr.appendChild(keyTd);

            var valueTd = document.createElement("td");
            valueTd.setAttribute("class", "tooltip-value");
            valueTd.innerHTML = this.values[i];

            tr.appendChild(valueTd);

            this.table.appendChild(tr);
        }

        this.mainContent.appendChild(this.table);
    }, getView: function () {
        return this.mainContent;
    }, setValues: function (values) {
        this.values = values;
        var childNodes = this.table.childNodes;
        for (var i = 0; i < this.values.length; i++) {
            var value = this.values[i];
            var node = childNodes[i];
            node.lastChild.innerHTML = value;
        }
    }
});