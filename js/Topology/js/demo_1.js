/**
 * Created by p00422 on 2017/8/7.
 */
(function ($) {
    CanvasRenderingContext2D.prototype.JtopoDrawPointPath = function (a, b, c, d, e, f) {
        var animespeed = (new Date()) / 20;
        var xs = c - a,
            xy = d - b,
            l = Math.floor(Math.sqrt(xs * xs + xy * xy)),
            colorlength = 10,
            j = l,
            xl = xs / l,
            yl = xy / l;

        var colorpoint = animespeed % (l + colorlength) - colorlength;
        for (var i = 0; i < j; i++) {
            if (((i) > colorpoint) && ((i) < (colorpoint + colorlength))) {
                this.beginPath();
                this.strokeStyle = e;
                this.moveTo(a + (i - 1) * xl, b + (i - 1) * yl);
                this.lineTo(a + i * xl, b + i * yl);
                this.stroke();
            } else {
                this.beginPath();
                this.strokeStyle = f;
                this.moveTo(a + (i - 1) * xl, b + (i - 1) * yl);
                this.lineTo(a + i * xl, b + i * yl);
                this.stroke();
            }
        }
    };

    var canvas = document.getElementById('canvas');
    var stage = new JTopo.Stage(canvas);

    var scene = new JTopo.Scene(stage);
    scene.alpha = 1;

    function addNode(text, icon, x, y, wid, hei) {
        var node = new JTopo.Node(text);
        node.setImage('./images/' + icon + '.png', true);
        node.fontColor = '7,105,173';
        node.fillColor = '238,238,238';
        node.setLocation(x + (84 - wid) / 2, y + (84 - hei) / 2);
        node.setSize(82, 85);
        node.dragable = false;
        scene.add(node);

        return node;
    }

    function addLink(nodeA, nodeZ, type, addY) {

        var link;
        if (type === 'FoldLink') {
            link = new JTopo.FoldLink(nodeA, nodeZ)
        } else {
            link = new JTopo.Link(nodeA, nodeZ)
        }
        link.strokeColor = '195,46,63';
        link.PointPathColor = "rgb(25,206,136)";
        link.lineWidth = 1;
        link.arrowsRadius = 7; //箭头大小
        //link.dashedPattern = 5; // 虚线
        !addY ? addY = 0 : addY;
        console.log('[addY]', addY);
        link.paintPath = function (a, b) {
            if (this.nodeA === this.nodeZ) return void this.paintLoop(a);
            a.beginPath();
            a.moveTo(b[0].x, b[0].y);
            for (var c = 1; c < b.length; c++) {
                null == this.dashedPattern ? (
                    (null == this.PointPathColor ? a.lineTo(b[c].x, b[c].y) : a.JtopoDrawPointPath(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, a.strokeStyle, this.PointPathColor))
                ) : a.JTopoDashedLineTo(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, this.dashedPattern)
            }
            if (a.stroke(), a.closePath(), null != this.arrowsRadius) {
                var d = b[b.length - 2],
                    e = b[b.length - 1];
                this.paintArrow(a, d, e)
            }
        };

        link.getStartPosition = function () {
            var a;
            return (a = (function (thisl) {
                debugger;
                var b = thisl.nodeA, c = thisl.nodeZ;
                var d = JTopo.util.lineF(b.cx, b.cy, c.cx, c.cy),
                    e = b.getBound(),
                    f = JTopo.util.intersectionLineBound(d, e);
                f.y -= addY;
                return f
            })(this)),
            null == a && (a = {
                x: this.nodeZ.cx,
                y: this.nodeZ.cy
            }), a

        };
        scene.add(link);
        return link;
    }

    function addFoldLink(nodeA, nodeZ) {
        var link = new JTopo.FoldLink(nodeA, nodeZ);
        link.strokeColor = '25,206,136';
        link.lineWidth = 1;
        link.arrowsRadius = 7; //箭头大小
        //link.dashedPattern = 5; // 虚线
        scene.add(link);
        return link;
    }

    var zcNode = addNode('光伏发电', 'zc', 50, 225, 85, 80);
    var nbqNode = addNode('逆变器', 'nbq', 200, 225, 64, 64);
    var dbNode = addNode('智能功率传感器', 'db', 350, 225, 46, 58);
    var dwNode = addNode('电网', 'dw', 500, 225, 79, 84);
    var ydfhNode = addNode('用电负荷', 'ydfh', 150, 400, 57, 55);
    //rootNode.alarm = 'Warrning';
    //rootNode.alarmColor = '255,0,0';
    //rootNode.alarmAlpha = 0.9;

    addLink(nbqNode, zcNode);
    addLink(nbqNode, dbNode);
    addLink(dbNode, dwNode);
    addLink(nbqNode, ydfhNode, 'FoldLink', 25);
    //offsetLink.direction = 'vertical';
    //offsetLink.bundleGap = 10; // 线条之间的间隔
    //offsetLink.textOffsetY = 10; // 文本偏移量（向下3个像素）
    /*var icons = ['green', 'blue', 'red1', 'red2'];
     for(var i=0; i<icons.length; i++){
     var node = addNode('input_' + i, icons[i], 231, 150 + i * 50);
     var link = new JTopo.FlexionalLink(rootNode, node);
     link.direction = 'horizontal';
     link.strokeColor = '204,204,204';
     link.lineWidth = 1;
     scene.add(link);
     }

     var fwNode = addNode('fw_1', 'nbq', 338 + 50, 184);
     addLink(rootNode, fwNode);

     var cloudNode = addNode('cloud', 'cloud', 340 + 100, 218);
     addLink(fwNode, cloudNode);

     var fw2Node = addNode('fw2Node', 'rect', 339 + 200, 184);
     addLink(cloudNode, fw2Node);

     var hostNode = addNode('host', 'gray', 339 + 250, 225);
     addLink(fw2Node, hostNode);

     for(var i=0; i<icons.length-1; i++){
     var node = addNode('vm_' + i, icons[i], 339 + 300, 175 + i * 50);
     var link = new JTopo.FoldLink(hostNode, node);
     link.direction = 'vertical';
     link.strokeColor = '204,204,204';
     link.lineWidth = 1;
     scene.add(link);
     }*/
})(jQuery);
