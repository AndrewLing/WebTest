/**
 * Created by p00034 on 2017-08-08.
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return factory(root);
        });
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.Topology = factory(root);
    }
})(this, function (root) {
    'use strict';

    function Topology(container, options) {
        if (!container || $(container).length <= 0) return;

        this.container = $(container).addClass("Topology");
        this.options = $.extend(true, {
            width: 800,
            height: 600,
            data: null,
            opacity: 1
        }, options);

        var p = this.options;

        if (p.color && p.color.font) {
            this.container.css("color", p.color.font);
        }

        this.canvas = document.createElement('canvas');
        if (!this.canvas.getContext) {
            window.G_vmlCanvasManager.initElement(this.canvas);
        }
        this.canvas.width = p.width;
        this.canvas.height = p.height;

        this.container.append(this.canvas);

        this.Render();

        return this;
    }

    Topology.prototype = {
        /**
         * 绘制场景
         */
        Render: function () {
            if (!this.canvas)
                return;
            var p = this.options;

            if (p.data == "-1") {
                this.stage = new JTopo.Stage(this.canvas);
                this.scene = new JTopo.Scene(this.stage);
            } else {
                this.canvas.width = p.data.width;
                this.canvas.height = p.data.height;
                this.stage = JTopo.createStageFromJson(p.data, this.canvas);
                this.scene = this.stage.childs[0];
            }

            //禁用滚轮缩放
            this.stage.wheelZoom = 0;
            this.stage.frames = -24;
            this.scene.mode = "select";
            this.scene.alpha = p.opacity;
            this.stage.centerAndZoom();
            this.scene.childs.forEach(function (n) {
                if (n) {
                    if ('node' == n.elementType) {
                        n.dragable = false;
                        n.selected = false;
                    }
                    else if ('link' == n.elementType) {
                        n.dragable = false;
                        n.selected = false;
                        n.showSelected = false;
                    }
                }
            });
            var self = this;
            this.scene.click(function (e) {
                if (e.target)
                    self.currentNode = e.target;
                else
                    return;
                if (e.target != null && e.target instanceof JTopo.Node) {
                    if (p.events && p.events.click && p.events.click instanceof Function) {
                        p.events.click(e.target);
                    }
                }
            });
        },

        /**
         * 取消除参数节点外所有节点的选中状态
         * @param node
         */
        unSelectAllNodeExcept: function (node) {
            editor.stage.childs.forEach(function (s) {
                s.childs.forEach(function (n) {
                    if (n.id != node.id) {
                        n.selected = false;
                    }
                });
            });
        },

        /**
         * 根据节点 ID 获取节点
         * @param nodeId 节点 ID
         */
        getNodeById: function (nodeId) {
            var node = this.scene.find(function (e) {
                return e.id == nodeId;
            });
            return node[0];
        },

        toJson: function () {
            return this.stage.toJson();
        }
    };

    /**
     * 注册图元
     * @param elementName 图元名称
     * @param elementType 图元类型（node，link）
     * @param properties 图元属性
     */
    Topology.registerElement = function (elementName, elementType, properties) {
        JTopo.Element.SerializedProperties[elementType || "node"][elementName] = properties;
    };

    // 逆变器
    Topology.registerElement('inverter', 'node', {
        width: 100,
        height: 100,
        nodeImage: 'inverter.png'
    });
    // 电表
    Topology.registerElement('meter', 'node', {
        width: 77,
        height: 97,
        nodeImage: 'meter.png'
    });
    // 储能
    Topology.registerElement('energyStore', 'node', {
        width: 80,
        height: 72,
        nodeImage: 'energy_store.png'
    });
    // 低压电网
    Topology.registerElement('grid-low', 'node', {
        width: 105,
        height: 120,
        nodeImage: 'grid-l.png'
    });
    // 安全关断盒
    Topology.registerElement('cutOffBox', 'node', {
        width: 65,
        height: 60,
        nodeImage: 'cutOffBox.png'
    });
    // 优化器
    Topology.registerElement('optimizer', 'node', {
        width: 47,
        height: 40,
        nodeImage: 'optimizer-group.png'
    });

    $.fn.Topology = function (options) {
        return new Topology(this, options);
    };

    return Topology;
});