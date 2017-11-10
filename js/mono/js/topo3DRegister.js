/***************************************************************************
 * 图元注册
 ***************************************************************************/
/**
 * 注册构造器
 */
// 立方体
topo3D.registerCreator("cube", function (data) {
    var translate = data.translate || [0, 0, 0];
    var width = data.width, height = data.height, depth = data.depth,
        sideColor = data.sideColor, topColor = data.topColor;

    var cube = new mono.Cube(width, height, depth);
    cube.s({
        "m.color": sideColor,
        "m.ambient": sideColor,
        "top.m.color": topColor,
        "top.m.ambient": topColor,
        "bottom.m.color": topColor,
        "bottom.m.ambient": topColor,
        "left.m.lightmap.image": topo3D.getRes("inside_lightmap.jpg"),
        "right.m.lightmap.image": topo3D.getRes("outside_lightmap.jpg"),
        "front.m.lightmap.image": topo3D.getRes("outside_lightmap.jpg"),
        "back.m.lightmap.image": topo3D.getRes("inside_lightmap.jpg")
    });
    cube.setPosition(translate[0], translate[1] + height / 2, translate[2]);

    return cube;
});
// TODO 柱体
topo3D.registerCreator('cylinder', function (data) {
    var translate = data.translate || [0, 0, 0];
    var radiusTop = data.radiusTop, radiusBottom = data.radiusBottom, height = data.height;
    var segmentsR = data.segmentsR, segmentsH = data.segmentsH,
        openTop = data.openTop, openBottom = data.openBottom, arcLength = data.arcLength, arcStart = data.arcStart;
    var cylinder = new mono.Cylinder(radiusTop, radiusBottom, height, segmentsR, segmentsH, openTop, openBottom, arcLength, arcStart);

    cylinder.setPosition(translate[0], translate[1] + height / 2, -translate[2]);

    return cylinder;
});
// TODO 球体
topo3D.registerCreator('sphere', function (data) {
    var translate = data.translate || [0, 0, 0];
    var radius = data.radius;
    var segmentsW = data.segmentsW, segmentsH = data.segmentsH,
        longitudeStart = data.longitudeStart, longitudeLength = data.longitudeLength,
        latitudeStart = data.latitudeStart, latitudeLength = data.latitudeLength;
    var sphere = new mono.Sphere(radius, segmentsW, segmentsH, longitudeStart, longitudeLength, latitudeStart, latitudeLength);

    sphere.setPosition(translate[0], translate[1] + radius, -translate[2]);

    return sphere;
});
// TODO 形状块
topo3D.registerCreator('shapeNode', function (data) {
    var translate = data.translate || [0, 0, 0];
    var curveSegments = data.curveSegements, amount = data.amount, horizontal = data.horizontal, repeat = data.repeat;

    var shapes = topo3D.create3DPath(data.shape);
    //shapes - 块图形状
    //curveSegments - 轮廓边缘分片数量
    //amount - 块图的厚度（深度）
    //vertical - 形状是水平方向还是垂直方向。true为垂直，false为水平。默认true，垂直
    //repeat - 重复纹理块的尺寸大小。越大，纹理图片重复次数越少
    var shapeNode = new mono.ShapeNode(shapes, curveSegments, amount, horizontal, repeat);

    shapeNode.setPosition(translate[0], translate[1], -translate[2]);

    return shapeNode;
});
// 路径方块
topo3D.registerCreator("pathCube", function (data) {
    var translate = data.translate || [0, 0, 0];
    var width = data.width, height = data.height;
    var insideColor = data.insideColor, outsideColor = data.outsideColor, topColor = data.topColor;

    var path = topo3D.create3DPath(data.path);
    var pathCube = new mono.PathCube(path, width, height);
    pathCube.s({
        "inside.m.type": "basic",
        "inside.m.color": insideColor,
        "outside.m.color": outsideColor,
        "aside.m.color": outsideColor,
        "zside.m.color": outsideColor,
        "top.m.color": topColor,
        "bottom.m.color": topColor,
        "inside.m.lightmap.image": topo3D.getRes("inside_lightmap.jpg"),
        "outside.m.lightmap.image": topo3D.getRes("outside_lightmap.jpg"),
        "aside.m.lightmap.image": topo3D.getRes("outside_lightmap.jpg"),
        "zside.m.lightmap.image": topo3D.getRes("outside_lightmap.jpg")
    });
    pathCube.setPosition(translate[0], translate[1], -translate[2]);
    pathCube.shadow = data.shadow;

    return pathCube;
});
// 路径体
topo3D.registerCreator('pathNode', function (data) {
    var translate = data.translate || [0, 0, 0];
    var width = data.width, height = data.height, depth = data.depth;
    var startCapStyle = data.startCapStyle, endCapStyle = data.endCapStyle;

    var path = topo3D.create3DPath(data.path);
    var shape = data.shape && topo3D.create3DPath(data.shape);
    var node = new mono.PathNode(path, width, height, depth, startCapStyle, endCapStyle, shape);
    node.setStartCapSize(5);
    node.setEndCapSize(1);
    node.s({
        'm.type': 'phong',
        'm.side': mono.DoubleSide,
        'm.repeat': new mono.Vec2(1, 1)
    });
    node.setPosition(translate[0], translate[1], -translate[2]);
    node.shadow = data.shadow;

    return node;
});
// 地形对象
topo3D.registerCreator('terrain', function (data) {
    var translate = data.translate || [0, 0, 0];
    var width = data.width, depth = data.depth;
    var segmentsW = data.segmentsW, segmentsD = data.segmentsD,
        heightUnit = data.heightUnit, heightMap = data.heightMap, baseLayerHeight = data.baseLayerHeight;

    var terrain = new mono.Terrain({
        width : width,
        depth : depth,
        segmentsW : segmentsW,
        segmentsD : segmentsD,
        heightUnit : heightUnit || 1,
        heightMap : heightMap || topo3D.getRes('terrain_heights.jpg'),
        baseLayerHeight : baseLayerHeight || 60
    });
    terrain.setPosition(translate[0], translate[1], -translate[2]);

    return terrain;
});


/**
 * 注册过滤器
 */
// 托盘，水面
topo3D.registerFilter("floor", function (dataBox, data) {
    return {
        type: "cube",
        shadowHost: true,
        op: "+",
        style: {
            "m.type": "phong",
            "m.color": "#BEC9BE",
            "m.ambient": "#BEC9BE",
            "m.texture.repeat": new mono.Vec2(1, 1)
        }
    };
});
// 地面
topo3D.registerFilter("terrain", function (dataBox, data) {
    return {
        type: "terrain",
        shadow: true,
        style: {
            "m.type": "basic",
            "m.texture.image": [topo3D.getRes('water.jpg'), topo3D.getRes('grass.jpg')],
            "m.texture.repeat": new mono.Vec2(1, 1)
        }
    };
});
// 山
topo3D.registerFilter("massif", function (dataBox, data) {
    return {
        type: "cylinder",
        style: {
            "m.type": "phong",
            "m.color": "#ccff66",
            "m.texture.image": topo3D.getRes("rock.jpg")
        }
    };
});
topo3D.registerFilter("sun", function (dataBox, data) {
    return {
        type: "sphere",
        style: {
            "m.type": "phong",
            "m.color": "#ff6600",
            "m.texture.image": topo3D.getRes("rock.jpg")
        }
    };
});
topo3D.registerFilter("erection1", function (dataBox, data) {
    return {
        type: "cylinder",
        style: {
            "m.type": "phong",
            "m.color": "#ff6600",
            "m.texture.image": topo3D.getRes("guangfuban.jpg")
        }
    };
});
topo3D.registerFilter("erection2", function (dataBox, data) {
    return {
        type: "cube",
        style: {
            "m.type": "phong",
            "m.color": "#ff6600",
            "m.texture.image": topo3D.getRes("guangfuban.jpg")
        }
    };
});