//================  twaver3d  开始==========
var box;
var network;
var clickDevNbqBusicode; //保存单击的逆变器id
var currentRunnigDatas;//保存当前的实时数据
var carema;//照相机（查看距离）
var wrjArr = [];

/**
 * 用于保存逆变器的名称
 */
var nbqNameList = [];
/**
 * 用于保存箱变的名称
 */
var xbNameList = [];
$(function () {
    initCss();
    show3DInof();
    //$.Move($("#rotateDivParent"));//注册可以拖动
    //$.Move($("#rotateDivParent"));
//	$("#jdkzDivForLabel").drag_div(event);
    App.divDrag('rotateDivParent', 'jdkzDivForLabel');
});
/**
 * 切换到3D视图
 */
function show3DInof() {
    App.divDrag('rotateDivParent', 'rotateH2Id');//弹出框
    $("#guangGenZhongDiv").html("");
    network = new mono.Network3D();
    box = network.getDataBox();
    network.isSelectable = function (element) {
        return false;
    };
    /*var camera = new mono.PerspectiveCamera(30, 1.5, 30, 30000);
     camera.setPosition(812,2373,1473);
     camera.lookAt(new mono.Vec3(147,997,-91));
     network.setCamera(camera);*/

    var interaction = network.getDefaultInteraction();
    interaction.maxDistance = 20000;//最大的距离
    interaction.minDistance = 52;//最小距离
    interaction.zoomSpeed = 3;//设置滚动条的滚动速度
    interaction.panSpeed = 0.2;
    //设置自动旋转
    nbqNameList = [];
    for (var i = 0; i < nbqNameListAndPosition.length; i++) {//循环创建光伏板和逆变器等信息
        createOneTotalElement(nbqNameListAndPosition[i].x, 0, nbqNameListAndPosition[i].z, i, nbqNameListAndPosition[i].name);
        nbqNameList.push(nbqNameListAndPosition[i].name);
    }

    //创建一个总的内容  箱变的信息
    //创建箱变
    xbNameList = [];
    for (var i = 0; i < xbInfos.length; i++) {
        var totailNode = new mono.Cube(300, 180, 180);
        totailNode.setPosition(xbInfos[i].x, xbInfos[i].y, xbInfos[i].z);
        totailNode.setClient("nodetypeid", "73");
        totailNode.setClient("deviceid", 55);
        totailNode.setName(xbInfos[i].name);
        totailNode.s({
            'm.type': 'phong',
            'm.texture.image': 'images/xiangbianTop.png',//设置长方体6个面的统一图片
            'front.m.texture.image': 'images/xiangbianFront.png',//修改设置长方体正面的图片
            //'bottom.m.texture.image': 'images/gfbbb.png',//修改设置长方体底部的图片
            'left.m.texture.image': 'images/xiangbianLeft.png',//修改设置长方体左部的图片
            'right.m.texture.image': 'images/xiangbianRight.png',//修改设置长方体右部的图片
            //'back.m.texture.image': 'images/biankuang.png',//修改设置长方体背部的图片
            //'front.m.visible':false,//设置透明  即不可见,这样就可以看到他的内部
        });
        box.add(totailNode);
        xbNameList.push(xbInfos[i].name);
    }


    //============== 创建清洗机器人的模型  开始 ============
    createRobot(4285, 0, 1600, "清洗机器人1");
    createRobot(4285, 0, 1800, "清洗机器人2");
    createRobot(4285, 0, 2000, "清洗机器人3");
    createRobot(4285, 0, 2200, "清洗机器人4");
    createRobot(4285, 0, 2400, "清洗机器人5");
    createRobot(4285, 0, 2600, "清洗机器人6");
    createRobot(4285, 0, 2800, "清洗机器人7");
    createRobot(4285, 0, 3000, "清洗机器人8");
    createRobot(4285, 0, 3200, "清洗机器人9");
    createRobot(4285, 0, 3400, "清洗机器人10");
    createRobot(4285, 0, 3800, "清洗机器人11");
    createRobot(4285, 0, 4000, "清洗机器人12");
    createRobot(4285, 0, 4200, "清洗机器人13");
    createRobot(4285, 0, 4400, "清洗机器人14");
    createRobot(4285, 0, 4600, "清洗机器人15");
    createRobot(4285, 0, 4800, "清洗机器人16");
    createRobot(4285, 0, 5000, "清洗机器人17");
    createRobot(4285, 0, 5200, "清洗机器人18");
    createRobot(4285, 0, 5400, "清洗机器人19");
    createRobot(4285, 0, 5600, "清洗机器人20");
    //============== 创建清洗机器人的模型  结束 ============

    //=====================创建无人机 开始=======================
    for (var i = 0; i < wrjInfos.length; i++) {
        createNonePersionRobit(wrjInfos[i].x, wrjInfos[i].y, wrjInfos[i].z, wrjInfos[i].name);
    }
    //=====================创建无人机 结束=======================

    /**
     * 双击事件
     */
    network.getRootView().addEventListener('dblclick', function (e) {
        var firstClickObject = findFirstObjectByMouse(network, e);
        if (firstClickObject) {
            var element = firstClickObject.element;
            var oldPoint = camera.t();
            var newPoint = firstClickObject.point;
            var interaction = network.getDefaultInteraction();
            if (element && element.getClient("nodetypeid") == 74) {//只有逆变器才执行单击的弹出框事件
                if (tempTimer) {
                    clearTimeout(tempTimer);//结束延迟执行事件
                }
                $("#busicodeTextId").val("");//清空数据
                clickDevNbqBusicode = element.getClient("busicode");
                //$("#busicodeTextId").val(clickDevNbqBusicode);//设置设备名称的值
                $("#rotateDivParent").show();
                document.getElementById('overlayXuanZhuanDiv').style.display = "block";
                clientedElement = element;
                $("#rotateInput").val(0);
                /*var tempTrs = $("#kzNBQTable tr");
                 tempTrs.eq(0).find("td").eq(2).html(clientedElement.getName());//设置名称
                 var tempInput = tempTrs.eq(1).find("td").eq(1).find("input");
                 tempInput.val("异常");
                 //修改背景图片
                 tempInput.css("background","url(images/yc.png) 0px 0px no-repeat");//异常图片
                 if(currentRunnigDatas){
                 var temCuData = currentRunnigDatas[clientedElement.getName()];
                 if(temCuData){
                 var tempJd = temCuData[signalForNBQColNames[signalForNBQColNames.length-1]];
                 //对异常正常图片的修改
                 if(temCuData[signalForNBQColNames[signalForNBQColNames.length-2]]==0){
                 var tempInput = tempTrs.eq(1).find("td").eq(1).find("input");
                 tempInput.val("正常");
                 //修改背景图片
                 tempInput.css("background","url(images/zc.png) 0px 0px no-repeat");//正常图片
                 }
                 tempTrs.eq(2).find("td").eq(1).find("input").val(tempJd==null?0+"°":tempJd+"°");//设置角度
                 tempTrs.eq(3).find("td").eq(0).find("input").eq(1).val(tempJd==null?0:tempJd);//设置角度
                 }else{
                 tempTrs.eq(2).find("td").eq(1).find("input").val(0+"°");//设置角度
                 tempTrs.eq(3).find("td").eq(0).find("input").eq(1).val(0);//设置角度
                 }
                 }*/
            } else if (element && element.getClient("nodetypeid") == 76) {//箱变的门旋转
                if (element.getClient("direction")) {
                    animateDoorOpen(element, -Math.PI / 2);
                } else {
                    animateDoorOpen(element, Math.PI / 2);
                }
            } else if (element && element.getClient("nodetypeid") == 77) {//箱变内部的物体位移
                animateXBDrift(element);
            } else if (element.getClient('animation')) {
                make.Default.playAnimation(element, element.getClient('animation'));
            } else {//移动视角
                animateCamera(camera, interaction, oldPoint, newPoint);
            }
        }
    });
    //箱变门的旋转(开门，关门的动作)
    /**
     * @param door 需要打开的门
     * @param toRotation 旋转到的角度
     */
    function animateDoorOpen(door, toRotation) {
        if (door.getClient('animating')) {
            return;
        }
        door.setClient('animating', true);
        var axis = new mono.Vec3(0, 1, 0);
        var axisPosition = new mono.Vec3(-door.getWidth() / 2, 0, 0);//旋转轴在门的左边  即-door.getWidth()/2+5
        if (toRotation > 0) {//旋转轴在右边，选择旋转轴为右边的轴即door.getWidth()/2-5
            axisPosition = new mono.Vec3(door.getWidth() / 2, 0, 0);
        }
        var opened = door.getClient('opened');//获取当前状态：如果当前是打开的状态就需要关闭，如果是关闭的状态就需要打开
        var animation = new twaver.Animate({
            from: 0,
            to: toRotation,
            dur: 1000,
            //easing: 'bounceOut',
            onUpdate: function (value) {
                var angle = value;
                if (opened) {//如果是打开的状态，就用最后到的角度减去到达这个角度的渐进值value
                    angle = toRotation - value;
                }
                var angleStep = angle - door.getRotationY();//旋转的度数到达的度数与已经旋转的度数的差值
                door.rotateFromAxis(axis, axisPosition, angleStep);
            },
            onDone: function () {
                door.setClient('opened', !opened);
                door.setClient('animating', false);
            },
        });
        animation.play();
    }

    /**
     * 箱变内部的元素的位移动画
     * @param xbInnerElement  逆变器内部的方块
     */
    function animateXBDrift(xbInnerElement) {
        if (xbInnerElement.getClient("isMoving")) {//判断当前是否正在移动
            //console.info("this is moving");
            return
        }
        xbInnerElement.setClient("isMoving", true);//设置正在移动  ,如果再点击就不做操作
        var directionVec = new mono.Vec3(0, 0, 1);//沿z轴方向移动
        var size = xbInnerElement.getBoundingBox().size().multiply(xbInnerElement.getScale());
        var isOut = xbInnerElement.getClient("isOut");//判断是否已经移动到里面了true 移动到外面了  false没有移动到外面
        var distance = size.z;//这里只移动z方向的距离
        if (isOut) {//如果是在外面就需要向里面移动了
            distance = -distance;
        }
        var fromPosition = xbInnerElement.getPosition().clone();//克隆位置？？		
        new twaver.Animate({
            from: 0,
            to: 1,
            dur: 500,//完成时间0.5s
            //easing: 'bounceOut',			
            onUpdate: function (value) {
                //don't forget to clone new instance before use them!
                xbInnerElement.setPosition(fromPosition.clone().add(directionVec.clone().multiplyScalar(distance * value)));
            },
            onDone: function () {
                xbInnerElement.setClient("isOut", !isOut);//是否已经移动到外面了
                xbInnerElement.setClient("isMoving", false);//设置正在移动结束
            },
        }).play();
    }

    var findFirstObjectByMouse = function (network, e) {
        var objects = network.getElementsByMouseEvent(e);
        if (objects.length) {
            for (var i = 0; i < objects.length; i++) {
                var first = objects[i];
                var object3d = first.element;
                if (!(object3d instanceof mono.Billboard)) {
                    return first;
                }
            }
        }
        return null;
    }
    /**
     * 移动视线的事件
     */
    var animateCamera = function (camera, interaction, oldPoint, newPoint, onDone) {
        var offset = camera.getPosition().sub(camera.getTarget());
        var animation = new twaver.Animate({
            from: 0,
            to: 1,
            dur: 500,
            easing: 'easeBoth',
            onUpdate: function (value) {
                var x = oldPoint.x + (newPoint.x - oldPoint.x) * value;
                var y = oldPoint.y + (newPoint.y - oldPoint.y) * value;
                var z = oldPoint.z + (newPoint.z - oldPoint.z) * value;
                var target = new mono.Vec3(x, y, z);
                camera.lookAt(target);
                interaction.target = target;
                var position = new mono.Vec3().addVectors(offset, target);
                camera.setPosition(position);
            },
        });
        animation.onDone = onDone;
        animation.play();
    }
    //mouseover事件
    var tempMouseElement;//这个变量用于保存当前是否现象tip信息
    var tempTimer;//用于保存一个timer，如果这个timer存在就清空
    network.getRootView().addEventListener('mousemove', function (e) {
        if (tempTimer) {
            clearTimeout(tempTimer);//结束延迟执行事件
        }
        network.getRootView().style.cursor = 'default';//鼠标变为正常
        var tipDiv = $("#tipToolDiv");
        var objects = network.getElementsByMouseEvent(e);//获取3D中点击中的元素
        var clientedElement;//保存我们需要做相关事件的元素
        if (objects) {
            for (var i = 0; i < objects.length; i++) {
                var object = objects[i];
                var element = object.element;
                if (element && (element.getClient("nodetypeid") == 70 //光伏板
                    || element.getClient("nodetypeid") == 73)//箱变
                    || element.getClient("nodetypeid") == 74//逆变器
                    || element.getClient("nodetypeid") == 76//箱变的门
                    || element.getClient("nodetypeid") == 78//清洗机器人
                    || element.getClient("nodetypeid") == 79//无人机器人
                ) {//获取元素中的自定义属性为指定的属性的信息
                    clientedElement = element;
                    break;
                }
            }
        }
        if (clientedElement) {
            var nodetypeid = clientedElement.getClient("nodetypeid");
            var tempTable = $("#ggzShowTipToolInfosTable");
//					console.info(e);
//					tipDiv[0].style.top=(e.y-40)+'px';
//					tipDiv[0].style.left=(e.x+15)+'px';
            setPostion(e, tipDiv);
            if (nodetypeid == 70 || nodetypeid == 73 || nodetypeid == 74 || nodetypeid == 76 || nodetypeid == 78 || nodetypeid == 79) {
                tempMouseElement = clientedElement;//只有当鼠标移入到有tip的才给他赋值
            } else {
                tempMouseElement = undefined;
            }
            if (nodetypeid == 70 && currentRunnigDatas) {//光伏板的显示内容
                $("#nbqTipToolDiv").css("display", "none");//将逆变器的提示的信息的div隐藏
                $("#xbTipToolDiv").css("display", "none");//将箱变的提示信息的div隐藏
                $("#gfbTipToolDiv").css("display", "block");//显示光伏板的提示信息
                $("#wrjqrTipDiv").css("display", "none");//显示无人机器人的提示信息
                $("#qxjqrTipDiv").css("display", "none");//显示清洗机器人的提示信息
                var data = currentRunnigDatas[clientedElement.getClient("busicode")];//从变量中取得
                var trs = $("#gfbTipToolDiv").find("tr");
                trs.eq(0).find("td").eq(1).html(clientedElement.getClient("busicode"));//所属逆变器名称
                trs.eq(1).find("td").eq(1).html(clientedElement.getName());//设置设备名称
                /*if(data && data!=null){
                 //var tempValue = data[signalForNBQColNames[signalForNBQColNames.length-1]];//取的实时值
                 var tempValue = clientedElement.getRotationX();//取得当前的值
                 trs.eq(2).find("td").eq(1).html(tempValue==null?"N/A":tempValue+"°");//当前方向角
                 }else{
                 trs.eq(2).find("td").eq(1).html("N/A");
                 }*/
                trs.eq(2).find("td").eq(1).html((clientedElement.getRotationX() * 180 / Math.PI).toFixed() + "°");//这里使用的看到的值
            } else if (nodetypeid == 74 && currentRunnigDatas) {//逆变器


                network.getRootView().style.cursor = 'pointer';//鼠标变为手指(手型)
//						if(e.y>530)
//						tipDiv[0].style.top=(e.y-530)+'px';

//						tipDiv[0].style.left=(e.x)+'px';
                $("#gfbTipToolDiv").css("display", "none");//将光伏板的提示信息div隐藏
                $("#xbTipToolDiv").css("display", "none");//将箱变的提示信息div隐藏
                $("#qxjqrTipDiv").css("display", "none");//显示清洗机器人的提示信息
                $("#wrjqrTipDiv").css("display", "none");//显示无人机器人的提示信息
                $("#nbqTipToolDiv").css("display", "block");//显示逆变器的提示信息
                $("#nbqTipToolDiv").find("label").eq(0).html(clientedElement.getName());
                var data = currentRunnigDatas[clientedElement.getName()];
                var trs = $(tempTable).find("tr");
                var tds1 = trs.eq(1).find("td");//电压
                var tds2 = trs.eq(2).find("td");//电流
                var tds5 = trs.eq(5).find("td");//交流电压
                var tds6 = trs.eq(6).find("td");//交流电流等行
                var trsOthers = $("#otherInfoDisplayTableForNBQ tr");//逆变器的其他的数据
                if (data && data != null) {
                    tds1.eq(1).html(data[signalForNBQColNames[0]] == null ? "N/A" : data[signalForNBQColNames[0]]);
                    tds1.eq(2).html(data[signalForNBQColNames[2]] == null ? "N/A" : data[signalForNBQColNames[2]]);
                    tds1.eq(3).html(data[signalForNBQColNames[4]] == null ? "N/A" : data[signalForNBQColNames[4]]);
                    tds1.eq(4).html(data[signalForNBQColNames[6]] == null ? "N/A" : data[signalForNBQColNames[6]]);

                    tds2.eq(1).html(data[signalForNBQColNames[1]] == null ? "N/A" : data[signalForNBQColNames[1]]);
                    tds2.eq(2).html(data[signalForNBQColNames[3]] == null ? "N/A" : data[signalForNBQColNames[3]]);
                    tds2.eq(3).html(data[signalForNBQColNames[5]] == null ? "N/A" : data[signalForNBQColNames[5]]);
                    tds2.eq(4).html(data[signalForNBQColNames[7]] == null ? "N/A" : data[signalForNBQColNames[7]]);

                    tds5.eq(1).html(data[signalForNBQColNames[8]] == null ? "N/A" : data[signalForNBQColNames[8]]);
                    tds5.eq(2).html(data[signalForNBQColNames[10]] == null ? "N/A" : data[signalForNBQColNames[10]]);
                    tds5.eq(3).html(data[signalForNBQColNames[12]] == null ? "N/A" : data[signalForNBQColNames[12]]);

                    tds6.eq(1).html(data[signalForNBQColNames[9]] == null ? "N/A" : data[signalForNBQColNames[9]]);
                    tds6.eq(2).html(data[signalForNBQColNames[11]] == null ? "N/A" : data[signalForNBQColNames[11]]);
                    tds6.eq(3).html(data[signalForNBQColNames[13]] == null ? "N/A" : data[signalForNBQColNames[13]]);
                    var tempNum = 0;//记录其他信息的从属性中获取的个数
                    for (var i = 0; i < trsOthers.length; i++) {
                        if (i == 2) {//编号
                            tempNum++;
                            trsOthers.eq(i).find("td").eq(1).html(clientedElement.getName());
                            continue;
                        }
                        if (i == 3) {//类型
                            tempNum++;
                            trsOthers.eq(i).find("td").eq(1).html(clientedElement.getName());
                            continue;
                        }
                        if ((14 + i - tempNum) == signalForNBQColNames.length - 2) {//逆变器状态
                            if (data[signalForNBQColNames[(14 + i - tempNum)]] == 0) {
                                trsOthers.eq(i).find("td").eq(1).find("img").attr("src", "images/zc.png");
                            } else {
                                trsOthers.eq(i).find("td").eq(1).find("img").attr("src", "images/yc.png");
                            }
                            continue;
                        }
                        trsOthers.eq(i).find("td").eq(1).html(data[signalForNBQColNames[(14 + i - tempNum)]] == null ? "N/A" : data[signalForNBQColNames[(14 + i - tempNum)]]);
                    }
                } else {
                    for (var i = 1; i < tds1.length; i++) {
                        tds1.eq(i).html("N/A");
                        tds2.eq(i).html("N/A")
                    }
                    for (var i = 1; i < tds5.length; i++) {
                        tds5.eq(i).html("N/A");
                        tds6.eq(i).html("N/A")
                    }
                    for (var i = 0; i < trsOthers.length; i++) {
                        if (i == 2) {//编号
                            trsOthers.eq(i).find("td").eq(1).html(clientedElement.getName());
                            continue;
                        }
                        if (i == 3) {
                            trsOthers.eq(i).find("td").eq(1).html(clientedElement.getName());
                            continue;
                        }
                        if (i == trsOthers.length - 1) {//当前状态
                            trsOthers.eq(i).find("td").eq(1).find("img").attr("src", "images/yc.png");
                            continue;
                        }
                        trsOthers.eq(i).find("td").eq(1).html("N/A");
                    }
                }
            } else if ((nodetypeid == 73//箱变
                || nodetypeid == 76//箱变箱变的门
                ) && currentRunnigDatas) {
//						tipDiv[0].style.top=(e.y-270)+'px';
//						tipDiv[0].style.left=(e.x+5)+'px';
//						if(e.y<270)
//							tipDiv[0].style.top=(e.y)+'px';

                $("#gfbTipToolDiv").css("display", "none");//将光伏板的提示信息div隐藏
                $("#nbqTipToolDiv").css("display", "none");//将逆变器的提示信息div隐藏
                $("#qxjqrTipDiv").css("display", "none");//显示清洗机器人的提示信息
                $("#wrjqrTipDiv").css("display", "none");//显示无人机器人的提示信息
                $("#xbTipToolDiv").css("display", "block");//显示箱变的提示信息div显示
                $("#xbTipToolDiv").find("label").eq(0).html(clientedElement.getName());
                var data = currentRunnigDatas[clientedElement.getName()];
                var xbTempTable = $("#xbTipDecilerInfoToolTable");//获取存放箱变信息的table
                var trs = $(xbTempTable).find("tr");//获取存放箱变信息的table下的tr
                if (data && data != null) {
                    //弹出框的右边的信号点信息
                    for (var i = 0; i < trs.length; i++) {
                        var tempVal = data[signalForXBColNames[i]];
                        trs.eq(i).find("td").eq(1).html((!tempVal || tempVal == null) ? "N/A" : tempVal.toFixed(3));
                    }
                    //弹出框的左边的图片的信息
                    //1.  1011开关
                    if (data[signalForXBColNames[signalForXBColNames.length - 3]] == 0) {
                        $("img[name=1011]").attr("src", "images/xbKGRightUp.png");
                    } else {
                        $("img[name=1011]").attr("src", "images/xbKGErrorUp.png");
                    }
                    //2. 1012开关
                    if (data[signalForXBColNames[signalForXBColNames.length - 2]] == 0) {
                        $("img[name=1012]").attr("src", "images/xbButonRightImg.png");
                    } else {
                        $("img[name=1012]").attr("src", "images/xbButonErrorImg.png");
                    }
                    //2. 1012开关
                    if (data[signalForXBColNames[signalForXBColNames.length - 1]] == 0) {
                        $("img[name=1013]").attr("src", "images/xbButonRightImg.png");
                    } else {
                        $("img[name=1013]").attr("src", "images/xbButonErrorImg.png");
                    }
                } else {
                    for (var i = 0; i < trs.length; i++) {
                        trs.eq(i).find("td").eq(1).html("N/A");
                    }
                    $("img[name=1011]").attr("src", "images/xbKGErrorUp.png");
                    $("img[name=1012]").attr("src", "images/xbButonErrorImg.png");
                    $("img[name=1013]").attr("src", "images/xbButonErrorImg.png");
                }
            } else if (nodetypeid == 78) {
                $("#gfbTipToolDiv").css("display", "none");//将光伏板的提示信息div隐藏
                $("#nbqTipToolDiv").css("display", "none");//将逆变器的提示信息div隐藏
                $("#xbTipToolDiv").css("display", "none");//显示箱变的提示信息div显示
                $("#wrjqrTipDiv").css("display", "none");//显示无人机器人的提示信息
                $("#qxjqrTipDiv").css("display", "block");//显示清洗机器人的提示信息
            } else if (nodetypeid == 79) {
                $("#gfbTipToolDiv").css("display", "none");//将光伏板的提示信息div隐藏
                $("#nbqTipToolDiv").css("display", "none");//将逆变器的提示信息div隐藏
                $("#xbTipToolDiv").css("display", "none");//显示箱变的提示信息div显示
                $("#qxjqrTipDiv").css("display", "none");//显示清洗机器人的提示信息
                $("#wrjqrTipDiv").css("display", "block");//显示无人机器人的提示信息
            }
            if (nodetypeid && (nodetypeid == 70 || nodetypeid == 73 || nodetypeid == 74 || nodetypeid == 76 || nodetypeid == 78 || nodetypeid == 79)) {
                tempTimer = setTimeout(function () {//二秒后显示
                    if (tempMouseElement) {//如果这个元素存在才显示，否则表面鼠标上面的没有可用显示的元素
                        tipDiv[0].style.visibility = 'visible';
                    }
                }, 300);
                tipDiv[0].style.visibility = 'hidden';//首先先隐藏
            } else {
                tipDiv[0].style.visibility = 'hidden';//首先先隐藏
            }
        } else {
            tempMouseElement = undefined;
            tipDiv[0].style.visibility = 'hidden';
        }
        tipDiv[0].style.visibility = 'hidden';
    });

    //============ 做鼠标事件的测试   开始=========

    //创建地板
    var floor = new mono.Cube(floorInfos.width, floorInfos.height, floorInfos.depth);
    floor.setStyle('m.texture.image', 'images/caodi.jpg');
    floor.setPosition(floorInfos.x, floorInfos.y, floorInfos.z);
    box.add(floor);
    //创建地板结束
    carema = network.getCamera();
    //设置背景色透明，显示底部背景图片
    network.setClearColor('#000000');
    network.setClearAlpha(0);
    //network.setBackgroundImage("images/samo.jpg");
    carema.setPosition(50, 10, 13000);
    var light = new mono.PointLight(0xFFFFFF, 0.5);
    light.setPosition(50, 380, 15000);
    box.add(light);
    box.add(new mono.AmbientLight(0xffffff));
    document.getElementById('guangGenZhongDiv').appendChild(network.getRootView());
    mono.Utils.autoAdjustNetworkBounds(network, guangGenZhongDiv, 'clientWidth', 'clientHeight');//自动调节大小
    camera = network.getCamera();
    camera.lookAt(-500, 0, 2500);
    camera.setPosition(-500, 300, 6500);
    //获取实时数据
    getDevDatas();
    setInterval(function () {
        getDevDatas();
    }, 5000);
}

function setPostion(e, div) {
    $(div)[0].style.top = (e.y - $(div)[0].offsetHeight) + "px";
    $(div)[0].style.left = (e.x - $(div)[0].offsetWidth) + "px";

    if (e.y - $(div)[0].offsetHeight < 20) {
        $(div)[0].style.top = (e.y) + "px";
    }
    if (e.x - $(div)[0].offsetWidth < 0) {
        $(div)[0].style.left = (e.x) + "px";
    }

}

/**
 * 创建一组逆变器组成的基本图元：1个逆变器2个电机4块光伏板
 * @param x 位置x
 * @param y 位置y
 * @param z 位置z
 * @param devId 设备id
 * @param name 设备名称
 */
function createOneTotalElement(x, y, z, devId, name) {
    var door1 = creatGuanghuBan(x, y, z, name, "PV1", z);
    var dj1 = new mono.Cylinder(5, 5, zhuZhiHieght);
    dj1.setPosition(x + 600, y - zhuZhiHieght / 2 - 10, z);
    dj1.setClient("nodetypeid", "71");
    dj1.setClient("deviceid", devId);
    dj1.setName(name + "(电机1)");
    dj1.setStyle("side.m.texture.image", "images/zhuziSide.png");
    box.add(dj1);
    var dj1Big = new mono.Cylinder(20, 20, 15, 35);
    dj1Big.setStyle("m.texture.image", "images/djTop.png");
    //dj1Big.setStyle("side.m.texture.image","images/zhuziSide.png");//柱子颜色  灰色
    dj1Big.setStyle("side.m.texture.image", "images/zhuziSide.png");//柱子颜色  灰色
    dj1Big.setPosition(x + 600, y - 5, z);
    dj1Big.setClient("nodetypeid", "71");
    dj1Big.setClient("deviceid", devId);
    dj1Big.setName(name + "(电机1)");
    dj1Big.setRotationX(Math.PI / 2);
    dj1Big.setRotationZ(Math.PI / 2);
    box.add(dj1Big);
    //电机的轴1（中间横着的柱子）
    var axis1 = new mono.Cylinder(5, 5, 2202);
    axis1.s({
        'top.m.texture.image': 'images/xuanzhuanzhu.png',
        'bottom.m.texture.image': 'images/xuanzhuanzhu.png',
        'side.m.texture.image': 'images/zhuziSide.png',
    });
    //axis1.setStyle("side.m.texture.image","images/zhuziSide.png");//'side.m.texture.image':'images/zhuziSide.png',
    axis1.setRotationZ((Math.PI / 2));//旋转90°
    axis1.setPosition(x + 600, y - 5, z);
    box.add(axis1);

    //逆变器
    var door1 = new mono.Cube(100, 50, 30);
    door1.s({
        'm.type': 'phong',
        'm.texture.image': 'images/nibianqiTop.png',//设置长方体6个面的统一图片
        'front.m.texture.image': 'images/nibianqiFront.png',//修改设置长方体顶部的图片
        //'bottom.m.texture.image': 'images/gfbbb.png',//修改设置长方体底部的图片
        'left.m.texture.image': 'images/nibianqiLeft.png',//修改设置长方体左部的图片
        'right.m.texture.image': 'images/nibianqiRight.png',//修改设置长方体右部的图片
        'back.m.texture.image': 'images/nibianqiBack.png',//修改设置长方体背部的图片
    });
    door1.setPosition(x + 600, y - zhuZhiHieght / 2 - 10, z + 20);
    door1.setClient("nodetypeid", "74");
    door1.setClient("deviceid", devId);
    door1.setClient("busicode", name);
    door1.setName(name);
    box.add(door1);


    //电机2
    var dj2Big = new mono.Cylinder(20, 20, 15, 35);
    dj2Big.setStyle("m.texture.image", "images/djTop.png");
    dj2Big.setStyle("side.m.texture.image", "images/zhuziSide.png");
    dj2Big.setPosition(x + 600, y - 5, z - 200);
    dj2Big.setClient("nodetypeid", "71");
    dj2Big.setClient("deviceid", devId);
    dj2Big.setName(name + "(电机2)");
    dj2Big.setRotationX(Math.PI / 2);
    dj2Big.setRotationZ(Math.PI / 2);
    box.add(dj2Big);
    var dj2 = new mono.Cylinder(5, 5, zhuZhiHieght);
    dj2.setStyle("side.m.texture.image", "images/zhuziSide.png");
    dj2.setPosition(x + 600, y - zhuZhiHieght / 2 - 10, z - 200);
    dj2.setClient("nodetypeid", "71");
    dj2.setClient("deviceid", devId);
    dj2.setName(name + "(电机2)");
    box.add(dj2);
    //电机的轴1（中间横着的柱子）
    var axis2 = new mono.Cylinder(5, 5, 2202);
    axis2.s({
        'top.m.texture.image': 'images/xuanzhuanzhu.png',
        'bottom.m.texture.image': 'images/xuanzhuanzhu.png',
        'side.m.texture.image': 'images/zhuziSide.png',
    });
    //axis2.setStyle("m.color","#8fa1ad");
    axis2.setRotationZ((Math.PI / 2));//旋转90°
    axis2.setPosition(x + 600, y - 5, z - 200);
    box.add(axis2);

    var door2 = creatGuanghuBan(x + 1200, y, z, name, "PV2", z);
    var door3 = creatGuanghuBan(x, y, z - 200, name, "PV3", z);
    var door4 = creatGuanghuBan(x + 1200, y, z - 200, name, "PV4", z);
}


/**
 * 创建光伏板
 * @param x 光伏板所在的为x
 * @param y 光伏板所在的位置y
 * @param z 光伏板所在的位置z
 * @param nbqName 逆变器名称
 * @param name 光伏板名称
 * @returns {mono.Cube}
 */
function creatGuanghuBan(x, y, z, nbqName, name, tempZ) {
    var door1 = new mono.Cube(1000, 4, 150);
    door1.s({
        'm.type': 'phong',
        'm.texture.image': 'images/gfbzm.png',//设置长方体6个面的统一图片
        'front.m.texture.image': 'images/gfbFront.png',//修改设置长方体顶部的图片
        'bottom.m.texture.image': 'images/gfbbb.png',//修改设置长方体底部的图片
        'left.m.texture.image': 'images/gfbRight.png',//修改设置长方体左部的图片
        'right.m.texture.image': 'images/gfbRight.png',//修改设置长方体右部的图片
        'back.m.texture.image': 'images/gfbFront.png',//修改设置长方体背部的图片
    });
    door1.setPosition(x, y, z);
    door1.setRotationX(Math.PI / 180 * (45));
    door1.setName(name);
    door1.setClient("nodetypeid", "70");//设置光伏板的一个客户端标识
    door1.setClient("busicode", nbqName);//设置设备id,后面整合的时候由后台查询出来获取有哪些光伏板的设备 
    door1.setClient("sameZ", tempZ);
    if (name == "PV1") {//PV1寄存器地址  设置colName
        door1.setClient("pvdy", signalForNBQColNames[0]);//设置电压的colName
        door1.setClient("pvdl", signalForNBQColNames[1]);//设置电流的colName
    } else if (name == "PV2") {//PV2寄存器地址  设置colName
        door1.setClient("pvdy", signalForNBQColNames[2]);//设置电压的colName
        door1.setClient("pvdl", signalForNBQColNames[3]);//设置电流的colName
    } else if (name == "PV3") {//PV3寄存器地址  设置colName
        door1.setClient("pvdy", signalForNBQColNames[4]);//设置电压的colName
        door1.setClient("pvdl", signalForNBQColNames[5]);//设置电流的colName
    } else {//PV4寄存器地址  设置colName
        door1.setClient("pvdy", signalForNBQColNames[6]);//设置电压的colName
        door1.setClient("pvdl", signalForNBQColNames[7]);//设置电流的colName
    }
    var pillar = new mono.Cylinder(5, 5, zhuZhiHieght);
    pillar.s({//设置多个样式
        //'m.type':'phong',
        //'m.color':'#8fa1ad',
        'side.m.texture.image': 'images/zhuziSide.png',
    });

    pillar.setPosition(x, y - zhuZhiHieght / 2 - 8, z);
    var pillar2 = new mono.Cylinder(10, 10, 10);
    pillar2.s({//设置多个样式
        //'m.type':'phong',
        //'m.color':'#8fa1ad',
        'side.m.texture.image': 'images/zhuziBigSide.png',
    });

    pillar2.setPosition(x, y - zhuZhiHieght - 5, z);

    //将元素添加到box中，这样才是在box中创建了元素
    box.add(door1);
    box.add(pillar);
    box.add(pillar2);

    var zhu21 = new mono.Cylinder(5, 5, zhuZhiHieght);
    zhu21.s({//设置多个样式
        //'m.type':'phong',
        //'m.color':'#8fa1ad',
        'side.m.texture.image': 'images/zhuziSide.png',
    });

    zhu21.setPosition(x - 400, y - zhuZhiHieght / 2 - 8, z);
    var zhu22 = new mono.Cylinder(10, 10, 10);
    zhu22.s({//设置多个样式
        //'m.type':'phong',
        //'m.color':'#8fa1ad',
        'side.m.texture.image': 'images/zhuziBigSide.png',
    });

    zhu22.setPosition(x - 400, y - zhuZhiHieght - 5, z);
    box.add(zhu21);
    box.add(zhu22);

    var zhu31 = new mono.Cylinder(5, 5, zhuZhiHieght);
    zhu31.s({//设置多个样式
        //'m.type':'phong',
        //'m.color':'#8fa1ad',
        'side.m.texture.image': 'images/zhuziSide.png',
    });

    zhu31.setPosition(x + 400, y - zhuZhiHieght / 2 - 8, z);
    var zhu32 = new mono.Cylinder(10, 10, 10);
    zhu32.s({//设置多个样式
        //'m.type':'phong',
        //'m.color':'#8fa1ad',
        'side.m.texture.image': 'images/zhuziBigSide.png',
    });

    zhu32.setPosition(x + 400, y - zhuZhiHieght - 5, z);
    box.add(zhu31);
    box.add(zhu32);

    return door1;
}

/***
 * 创建清洗机器人
 * @param x
 * @param y
 * @param z
 */
function createRobot(x, y, z, name) {
    var door1 = new mono.Cube(30, 8, 154);
    door1.setStyle('top.m.texture.image', 'images/gfbzm.png');
    var cutDoor1 = new mono.Cube(30, 6, 150);
    cutDoor1.setPositionY(-2);//-(8-4)/2

    var csg1 = new mono.CSG(door1);
    var csg2 = new mono.CSG(cutDoor1);
    var csg = csg1.substract(csg2);//相减
    csg = csg.toMesh();//生成的残余对象必须要进行toMesh后才能够添加到box中进行显示
    csg.setClient("nodetypeid", 78);
    csg.setName(name);
    csg.setPosition(x, y + 2, z);
    csg.setRotationX(Math.PI / 180 * (45));
    csg.setClient("sameZ", z);
    box.add(csg);
}


var currentInterval;//清洗的timer
var isClearGlob = false;
var isCancelGlob = false;
/**
 * 清洗机器人的移动
 * @param begin 开始位置
 * @param end 结束位置
 * @param 移动的时间(单位s)
 * @param isNeedBack确定是否需要移动回去
 */
function playRobot(begin, end, time, isNeedBack) {
    var allNum = end - begin;//总共需要移动的距离
    if (Math.abs(allNum) <= 1) {
        App.myMsg("移动距离太小，不做移动");
        return;
    }
    if (isClearGlob && isNeedBack) {
        App.myMsg("正在清理中请稍后执行清理。。。。");
        return;
    }
    isClearGlob = true;
    var jgTime = 50;//间隔时间执行
    var evryNum = allNum / (time * (1000 / jgTime)) * 2;//每次移动的距离,去除执行的时间(计算1秒移动的距离) *2因为需要来回一共执行的时间是time，每一次的移动的距离就需要加倍
    var alreadNumArr = [];//记录每一个移动的距离
    var needPlays = [];//保存需要移动的清洗机器人
    var datas = box.getDatas();
    for (var i = 0; i < datas.size(); i++) {
        var robot = datas.get(i);
        var nodetypeid = datas.get(i).getClient("nodetypeid");
        if (nodetypeid == 78) {
            needPlays.push(robot);
            alreadNumArr.push(0);//添加元素，已经移动了的距离,初始化为0
        }
    }
    var isStop = false;
    currentInterval = setInterval(function () {
        for (var i = 0; i < needPlays.length; i++) {
            var robot = needPlays[i];
            robot.setPosition(robot.getPositionX() + evryNum, robot.getPositionY(), robot.getPositionZ());//做位移操作
            alreadNumArr[i] = (alreadNumArr[i] + evryNum);
            if (Math.abs(alreadNumArr[i] - allNum) < 1) {//停止timer
                clearInterval(currentInterval);//停止后再移动回去的timer
                isStop = true;
                alreadNumArr[i] = 0;
                if (!isNeedBack) {//这个是清理的标志，如果不成立就是正在执行停止清理的事情,完成之后不会去执行其他的事情了
                    currentInterval = undefined;
                    isClearGlob = false;
                    isCancelGlob = false;
                }
            }
        }
        if (isNeedBack && isStop) {//再执行移动回去
            currentInterval = setInterval(function () {
                for (var i = 0; i < needPlays.length; i++) {
                    var robot = needPlays[i];
                    robot.setPosition(robot.getPositionX() - evryNum, robot.getPositionY(), robot.getPositionZ());//做位移操作,移动回去
                    alreadNumArr[i] = alreadNumArr[i] + evryNum;
                    if (Math.abs(alreadNumArr[i] - allNum) < 1) {//停止timer
                        clearInterval(currentInterval);//停止后再移动回去的timer
                        currentInterval = undefined;
                        isClearGlob = false;
                    }
                }
            }, jgTime);
        }
    }, jgTime);

}

/**
 * 单击清洗按钮的事件
 */
function startClear() {
    playRobot(4285, -4800, 40, true);//移动回去
}
/**
 * 停止清洗
 */
function endClear() {
    if (isCancelGlob) {
        App.myMsg("正在停止清洗中。。。");
        return;
    }
    isCancelGlob = true;
    if (currentInterval) {
        clearInterval(currentInterval);
    } else {//没有清洗的就直接结束
        App.myMsg("没有正在工作的机器人，已经停止了!");
        return;
    }
    var datas = box.getDatas();
    var nowX;
    for (var i = 0; i < datas.size(); i++) {
        if (datas.get(i).getClient("nodetypeid") == 78) {
            nowX = datas.get(i).getPositionX();
            break;
        }
    }
    playRobot(nowX, 4285, 1);//移动回去5s时间移动回去,4285是开始的位置
}
/**
 * 绑定关闭的事件
 */
$("#rotateCurveClose").bind('click', closeRotationDialog);
/**
 * 关闭弹出的调节角度的对话框
 */
function closeRotationDialog() {
    $("#rotateDivParent").hide();
    $("#overlayXuanZhuanDiv").css("display", "none");
    $("#rotateInput").val("");//清空输入框
}
/**
 * 点击确定后需要旋转---后面需要把这个参数写到后台去，然后由后返回旋转的角度来确定旋转
 */
function xuanZhuanButtonClient() {
    var jd = $("#rotateInput").val();
    var flag = !isNaN(jd);//校验是否是数字，true：是数字  false：非数字
    if (!flag) {
        App.myMsg("请输入数字！");
    }
    if ((jd - 0) > 90) {
        App.myMsg("旋转角度不能大于90°");
    }
    if ((jd - 0) < -90) {
        App.myMsg("旋转角度不能小于-90°");
    }
    /*
     * 这里是到后台控制
     * var paraObj = {};
     paraObj.busicode = clickDevNbqBusicode;
     paraObj.dirAngle = jd*gainDerivativeGlob;//因为有增益，这里为了使得设置的值与我们输入的相同，这里就需要乘于增益的导数,这个导数的变量如需需改在monoDataInfos.js中修改
     paraObj.type = "signal";
     paraObj.count = countFor3DGlob;
     $.omcAjax("/optical/tracking/directionOperate3D",paraObj, function(res) {
     if(res.success){
     App.myMsg("控制成功！");
     closeRotationDialog();//关闭窗口
     }else{
     App.myMsg("控制失败！");
     }
     });*/

    //===这里是前台空控制（测试）  获取需要旋转的光伏板  制动测试，这里获取直接控制光伏板
    closeRotationDialog();//关闭窗口
    var boxDatas = box.getDatas();//获取光伏板
    var sameZValue1 = undefined;
    var sameZValue2 = undefined;
    for (var i = 0; i < boxDatas.size(); i++) {
        var el1 = boxDatas.get(i);
        var nodtypeid = el1.getClient("nodetypeid");
        var buCode = el1.getClient("busicode");
        if (nodtypeid == 70 && buCode == clickDevNbqBusicode) {//旋转  (根据名称找到当前点击的逆变器的光伏板，就控制他们的旋转角度)
            if (!sameZValue1) {//获取到当前的值
                sameZValue1 = el1.getClient("sameZ");
                sameZValue2 = el1.getClient("sameZ") - 200;
            }
            playX(el1.getRotationX(), jd / 180 * Math.PI, el1);
            continue;
        }
    }
    //===这里是前台空控制（测试）  获取需要旋转的光伏板  制动测试，这里获取直接控制光伏板
    /*
     //这里做这个主要是为了保证每一排都进行相同的的角度
     for(var i=0;i<boxDatas.size();i++){
     var el1 = boxDatas.get(i);
     var nodetypeid = el1.getClient("nodetypeid");
     var buCode = el1.getClient("busicode");
     if(nodetypeid==70 && buCode!=clickDevNbqBusicode && sameZValue1 && sameZValue1 ==el1.getClient("sameZ")){//旋转
     playX(el1.getRotationX(),jd/180*Math.PI,el1);
     }
     if(nodetypeid==78&& (el1.getClient("sameZ")==sameZValue1||el1.getClient("sameZ")==sameZValue2)){
     playX(el1.getRotationX(),jd/180*Math.PI,el1);
     }
     }*/
}
/*
 *X轴旋转的动画 
 **/
function playX(oldValue, newValue, tempDoor) {
    if (tempDoor.getClient("isRoting")) {//正在转动的需要等到转动完了之后再转动
        //console.info("this door is rotating,busicode is "+tempDoor.getClient("busicode")+" ,pv name is "+tempDoor.getName());
        return;
    }
    var hight = 2;//机器人的设置为2
    if (tempDoor.getClient("nodetypeid") != 78) {//非清洗机器人的设置他们的高度
        hight = tempDoor.getHeight() / 2
    }
    //console.info("begin roting!");
    tempDoor.setClient("isRoting", true);//设置正在转动
    var axis = new mono.Vec3(1, 0, 0);
    var axisPosition = new mono.Vec3(hight, 0, 0);//设置旋转的围绕的轴，这里是围绕x轴的一个中心点旋转
    //做的是平移操作，防止在选择到90度以后出现下面的横柱子镶在光伏板中
    //==========  计算需要在在z的方向平移板子的 距离  开始=============
    var oldP = oldValue > Math.PI / 4 ? ((oldValue - Math.PI / 4) * 180 / Math.PI) / 5 : 0;
    if (oldValue < -Math.PI / 4) {
        oldP = (oldValue + Math.PI / 4) * 180 / Math.PI / 5;
    }
    var newP = newValue > Math.PI / 4 ? ((newValue - Math.PI / 4) * 180 / Math.PI) / 5 : 0;
    if (newValue < -Math.PI / 4) {
        newP = (newValue + Math.PI / 4) * 180 / Math.PI / 5;
    }
    var pyJl = (newP - oldP) * 0.5;//平移的距离
    var alPyJl = 0;//保存已经平移了的距离
    //==========  计算需要在在z的方向平移板子的 距离  结束=============
    var animation = new twaver.Animate({
        from: oldValue,
        to: newValue,
        dur: 1000,
//			easing: 'bounceOut',
        onUpdate: function (value) {
            var angle = value;
            var angleStep = angle - tempDoor.getRotationX();
            tempDoor.rotateFromAxis(axis, axisPosition, angleStep);
            if (Math.abs(alPyJl - pyJl) > 0) {//判断是否需要平移,等于0是结束的条件 
                tempDoor.setPositionZ(tempDoor.getPositionZ() + pyJl / 40);//做平移的操作
                alPyJl += pyJl / 40;//对已经平移的距离做累加
            }
        },
        onDone: function () {
            if (Math.abs(alPyJl - pyJl) > 0) {//没有平移够，还需要平移,在做旋转的时候也在左（>45的时候）（或者右<-45时候）平移
                tempDoor.setPositionZ(tempDoor.getPositionZ() + (pyJl - alPyJl));
            }
            tempDoor.setClient("isRoting", false);//设置转动完成
        },
    });
    animation.play();
}
/**
 * 获取实时数据
 */
function getDevDatas() {
    //TODO 获取这些信息的实时数据
    $.omcAjax("/cm/dev/getDev3DRunningData", {
        busiCodeNames: nbqNameList,
        colNames: signalForNBQColNames,
        xbBusiCodeNames: signalForXBColNames,
        xbNames: xbNameList
    }, function (res) {
        if (res && res.success) {
            currentRunnigDatas = res.data;
            //循环去控制角度  做旋转的操作
            var datas = box.getDatas();
            for (var i = 0; i < datas.size(); i++) {
                var data = datas.get(i);
                var nodetypeid = data.getClient("nodetypeid");
                if (nodetypeid == 70) {//光伏板,对光伏板做旋转的操作
                    var gfData = currentRunnigDatas[data.getClient("busicode")];
                    if (gfData && gfData != null) {
                        var jd = gfData[signalForNBQColNames[signalForNBQColNames.length - 1]];//获取控制角度的变量，这里取得是signalColNames的最后一个变量
                        if (jd && jd != null) {
                            //这个是为了解决模拟器读取的值不正确的情况  开始
                            if (jd > 90) {
                                jd = 90;
                            }
                            if (jd < -90) {
                                jd = -90;
                            }
                            //解决模拟器读取值超出范围的情况  结束
                            jd = Math.PI / 180 * (jd - 0);
                            var oldV = data.getRotationX();
                            if ((Math.abs(oldV - jd)) * 180 / Math.PI >= 1) {//当角度变化大于等一1°的才去旋转
                                playX(oldV, jd, data);
                            }
                        }
                    }
                }
            }
        }
    });
}

/**
 *  点击垂直水平按钮的事件
 * @param opera
 */
function rotateInputAddFun(opera) {
    var cunValue = $("#rotateInput").val();
    if (opera == "+") {
        if ((cunValue - 0) == 90) {
            App.myMsg("垂直角度最大90°,已达最大值");
            return;
        }
        $("#rotateInput").val((cunValue - 0) + 1);
    }
    if (opera == "-") {
        if ((cunValue - 0) == -90) {
            App.myMsg("垂直角度最小-90°,已达最小值");
            return;
        }
        $("#rotateInput").val((cunValue - 1));
    }
}

/**
 * 将非数值替换，只能是整数
 * @param value
 * @returns
 */
function deleteAllNotNumChar(value, max, min) {
    var isMinus = false;//判断是否是负数
    if (value.indexOf("-") == 0) {
        isMinus = true;
    }
    value = value.replace(/\D/g, '');//替换非数字
    if (isMinus) {
        var isHasZero = true;
        while (isHasZero) {
            if (value.length > 0 && value.indexOf("0") == 0) {
                value = value.substring(1);
            } else {
                isHasZero = false;
            }
        }
        value = "-" + value;
    } else {
        var isHasZero = true;
        while (isHasZero) {
            if (value.length > 1 && value.indexOf("0") == 0) {
                value = value.substring(1);
            } else {
                isHasZero = false;
            }
        }
    }
    //数字范围替换
    if (max && value > max) {
        value = max;
    }
    if (min && value < min) {
        value = min;
    }
    return value;
}
/**
 * 当输入框失去鼠标的时候，当只有-或者空字符串修改为0,其他的原来值是多少就显示多少
 * @param value
 * @returns
 */
function setNotNumWithNum(value) {
    if (value == "" || value == "-") {//如果是空或者
        return 0;
    }
    return value;
}
//================  twaver3d  结束==========

function initCss() {
    parent.hideHead = false;
    document.getElementById('yincang').className = "yincang";
    document.getElementById('index-top').style.display = "block";
    document.getElementById('yincang').style.display = "block";
    if (document.getElementById('mainMenu') != null) {
        document.getElementById('mainMenu').className = 'daohang';
    }
}

/**
 * 选择控制方式
 * @param $
 */
function kzfsChangeSelect() {
    var val = $("#ksfsSelect").val();
    if (val == 1) {//控制角度
        $("#jdkzDivForLabel label").html("角度控制");
        $("#jdkzTable").css("display", "block");
        $("#nbqkzTable").css("display", "none");
    } else {//控制逆变器
        $("#jdkzDivForLabel label").html("逆变器控制");
        $("#jdkzTable").css("display", "none");
        $("#nbqkzTable").css("display", "block");
    }
}
/**
 * 开关机控制
 */
function kgjKz() {
    closeRotationDialog();
}


//=======================无人机的相关代码  开始===============================

/**
 * *管理无人机的状态等数据  用于保存无人机的数据，避免太多变量导致参数污染的情况
 //用于保存无人机的参数  var curentWrjRobit ;wrjParam.curentWrjRobit//保存当前页面的无人机
 //var wrjCurrentInterval //无人机的线程  wrjParam.wrjCurrentInterval
 //var currentPoint = 1;//确定当前所在的点  wrjParam.currentPoint
 //maxMoveDistance: 10, //最大移动的距离 wrjParam.maxMoveDistance
 **/
var wrjParam = {
    curentWrjRobit: undefined, //保存当前页面的无人机 
    wrjCurrentInterval: undefined,//无人机巡航的线程
    backMoveDistance: 100,	//点击取消的时候的回去的距离（速度）
    maxMoveDistance: 10, //最大移动的距离(速度)
    currentPoint: 1,
    isPlaying: false, //是否正在巡航
    isBacking: false //是否正在返回结束巡航
}
/**
 * 创建无人机的代码
 * @param x
 * @param y
 * @param z
 * @param name
 */
function createNonePersionRobit(x, y, z, name) {

    //画球体
    /*var bigSphere = new mono.Sphere(100,22,22,0,Math.PI,0,Math.PI);
     var door1 = new mono.Cube(40, 40, 40);
     door1.setStyle('m.texture.image','images/gfbzm.png');
     door1.setPositionY(70);
     var cutDoor1 = new mono.Cube(100,100,100);


     var csg1=new mono.CSG(door1);
     var csg2=new mono.CSG(cutDoor1);
     var csg = csg1.union(csg2);//合并
     csg = csg.toMesh();//生成的残余对象必须要进行toMesh后才能够添加到box中进行显示
     csg.setClient("nodetypeid",79);
     csg.setName(name);
     csg.setPosition(x,y,z);
     //csg.setRotationX( Math.PI/180 *(45));
     */
    //大圆
    var bigSphere = new mono.Sphere(80, 22, 50, 0, Math.PI * 2, 0, Math.PI * 2);
    bigSphere.s({
        'm.type': 'phong',
        'm.color': 'yellow',
        'm.ambient': 'yellow',
    })
    //box.add(bigSphere);

    //圆柱
    var mylinder = new mono.Cylinder(10, 10, 500, 40, 1, false, false, Math.PI * 2, 0);
    mylinder.s({
        'm.type': 'phong',
        'm.color': 'yellow',
        'm.ambient': 'yellow',
    });
    mylinder.setRotationX(Math.PI / 2);

    var csg1 = new mono.CSG(bigSphere);
    var csg2 = new mono.CSG(mylinder);
    var csg = csg1.union(csg2);//合并


    //圆柱
    var mylinder2 = new mono.Cylinder(10, 10, 500, 40, 1, false, false, Math.PI * 2, 0);
    mylinder2.s({
        'm.type': 'phong',
        'm.color': 'yellow',
        'm.ambient': 'yellow',
    });
    mylinder2.setRotationX(Math.PI / 2);
    mylinder2.setRotationZ(Math.PI / 3);
    var csg3 = new mono.CSG(mylinder2);
    csg = csg.union(csg3);

    var mylinder3 = new mono.Cylinder(10, 10, 500, 40, 1, false, false, Math.PI * 2, 0);
    mylinder3.s({
        'm.type': 'phong',
        'm.color': 'yellow',
        'm.ambient': 'yellow',
    });
    mylinder3.setRotationX(Math.PI / 2);
    mylinder3.setRotationZ(Math.PI * 2 / 3);
    var csg4 = new mono.CSG(mylinder3);
    csg = csg.union(csg4);


    csg = csg.toMesh();//生成的残余对象必须要进行toMesh后才能够添加到box中进行显示
    csg.setRotationY(Math.PI / 4);
    //csg = csg.toMesh();//生成的残余对象必须要进行toMesh后才能够添加到box中进行显示
    csg.setClient("nodetypeid", 79);
    csg.setName(name);
    csg.setPosition(x, y, z);
    box.add(csg);
    wrjArr.push(csg);//将无人机保存到数组中
}

/**
 * 创建路径体(无人机的)，并显示出来  nodetypeid ==80
 */
function createNonePersionPath() {
    var path = new mono.Path();
    path.moveTo(wrjPath[0].x, wrjPath[0].y, wrjPath[0].z);
    for (var i = 1; i < wrjPath.length; i++) {
        path.lineTo(wrjPath[i].x, wrjPath[i].y, wrjPath[i].z);
    }
    var node = new mono.PathNode(path, 20, 10, 20, 'round', 'round', null, Math.PI * 1.5, Math.PI / 2, 'center');
    node.setStartCapSize(2);
    node.setEndCapSize(2);
    node.s({
        'm.type': 'phong',
        'm.color': 'red',
        'm.ambient': 'red',
    })
    //node.setStyle('m.texture.image','../images/wall01_inner_3d.png').setStyle('m.type','phong').setStyle('m.side',mono.DoubleSide).setStyle
    node.setClient("nodetypeid", 80);
    box.add(node);
}

/**
 * 查看航行路线
 */
function movePathClient() {
    if (wrjParam.isBacking || wrjParam.isPlaying) {
        return;
    }
    var datas = box.getDatas();
    var isHasPath = false;
    var tempPath;
    for (var i = 0; i < datas.size(); i++) {
        if (datas.get(i).getClient("nodetypeid") == 80) {
            tempPath = datas.get(i);
            isHasPath = true;
        }
    }
    if (isHasPath) {//如果有路线就关闭
        box.remove(tempPath);
    } else {//创建路线
        createNonePersionPath();
    }
}
/**
 * 无人机的运动
 */
function playNonePersonRobit() {
    if (wrjParam.isPlaying) {//正在航行
        App.myMsg("正在航行中，请稍后操作！");
        return;
    }

    if (wrjParam.isBacking) {//正在返回巡航
        App.myMsg("正在结束巡航中，不能巡航！");
        return;
    }
    wrjParam.isPlaying = true;
    removePathNode();//删除路径体,如果有先删除路径
    createNonePersionPath();//创建路径
    camera.lookAt(300, 0, 4800);
    camera.setPosition(300, 13000, 4800);
    onePointNonePerson(wrjPath[0], wrjPath[1], wrjArr[0], false);//调用巡航
}


/**
 * 开始一步一步的航行
 * @param point1
 * @param point2
 * @param wrj
 * @param isDec :是否递减
 */
function onePointNonePerson(point1, point2, wrj, isDec) {
    var doTime = 100;//每一个位置移动的次数
    //计算每一次移动的距离  如果小于就是他本身 如果是0就不移动
    var xM = Math.abs((point2.x - point1.x) / doTime) > wrjParam.maxMoveDistance ? wrjParam.maxMoveDistance * ((point2.x - point1.x) / Math.abs((point2.x - point1.x))) : (point2.x - point1.x) / doTime;//当前x需要移动的距离(每次移动的距离)
    var yM = Math.abs((point2.y - point1.y) / doTime) > wrjParam.maxMoveDistance ? wrjParam.maxMoveDistance * ((point2.y - point1.y) / Math.abs((point2.y - point1.y))) : (point2.y - point1.y) / doTime;//当前y需要移动的距离
    var zM = Math.abs((point2.z - point1.z) / doTime) > wrjParam.maxMoveDistance ? wrjParam.maxMoveDistance * ((point2.z - point1.z) / Math.abs((point2.z - point1.z))) : (point2.z - point1.z) / doTime;//当前z需要移动的距离
    if (isDec) {//如果是返航需要设置为我们给的速度，更加快
        xM = (xM == 0) ? 0 : xM / Math.abs(xM) * wrjParam.backMoveDistance;
        yM = (yM == 0) ? 0 : yM / Math.abs(yM) * wrjParam.backMoveDistance;
        zM = (zM == 0) ? 0 : zM / Math.abs(zM) * wrjParam.backMoveDistance;
    }
    if (!wrjParam.curentWrjRobit) {
        var datas = box.getDatas();
        for (var i = 0; i < datas.size(); i++) {
            var robot = datas.get(i);
            var nodetypeid = datas.get(i).getClient("nodetypeid");
            if (nodetypeid == 79 && wrj.getName() == robot.getName()) {
                wrjParam.curentWrjRobit = robot;//给保存的变量赋值
                break;
            }
        }
    }
    var playWrj = wrjParam.curentWrjRobit;
    if (!playWrj) {
        App.myMsg("没有找到无人机！");//需要移动的无人机
    }
    var endValue = 11;//结束的值
//	var offset=camera.getPosition().sub(camera.getTarget());//偏移量
    wrjParam.wrjCurrentInterval = setInterval(function () {//总共时间time每一次执行time/30
        //结束的标准是 wrj.x = point2.x, wrj.y=point2.y ,wrj.z = point2.z;
        if (((!isDec && wrjParam.currentPoint < wrjPath.length - 1) || (isDec && wrjParam.currentPoint >= 1) ) && Math.abs(playWrj.getPositionX() - wrjPath[wrjParam.currentPoint].x) <= Math.abs(xM)
            && Math.abs(playWrj.getPositionY() - wrjPath[wrjParam.currentPoint].y) <= Math.abs(yM)
            && Math.abs(playWrj.getPositionZ() - wrjPath[wrjParam.currentPoint].z) <= Math.abs(zM)) {//开始下一个点的操作
            playWrj.setPosition(wrjPath[wrjParam.currentPoint].x, wrjPath[wrjParam.currentPoint].y, wrjPath[wrjParam.currentPoint].z);
            /*offset = camera.getPosition().sub(camera.getTarget());*/

            wrjParam.currentPoint = isDec ? (wrjParam.currentPoint - 1) : (wrjParam.currentPoint + 1);//移动到下一个点
            //console.info(wrjParam.currentPoint);
            var symbol = 1;//当前的符号  (如果是递减，我们这里的差值需要使用无人机的减去上一个点的，否则使用下一个点减去上一个点的)
            xM = Math.abs((wrjPath[wrjParam.currentPoint].x - playWrj.getPositionX()) / doTime) > wrjParam.maxMoveDistance ? wrjParam.maxMoveDistance * ((wrjPath[wrjParam.currentPoint].x - playWrj.getPositionX()) * symbol / Math.abs((wrjPath[wrjParam.currentPoint].x - playWrj.getPositionX()))) : (wrjPath[wrjParam.currentPoint].x - playWrj.getPositionX()) * symbol / doTime;//当前x需要移动的距离(每次移动的距离)
            yM = Math.abs((wrjPath[wrjParam.currentPoint].y - playWrj.getPositionY()) / doTime) > wrjParam.maxMoveDistance ? wrjParam.maxMoveDistance * ((wrjPath[wrjParam.currentPoint].y - playWrj.getPositionY()) * symbol / Math.abs((wrjPath[wrjParam.currentPoint].y - playWrj.getPositionY()))) : (wrjPath[wrjParam.currentPoint].y - playWrj.getPositionY()) * symbol / doTime;//当前y需要移动的距离
            zM = Math.abs((wrjPath[wrjParam.currentPoint].z - playWrj.getPositionZ()) / doTime) > wrjParam.maxMoveDistance ? wrjParam.maxMoveDistance * ((wrjPath[wrjParam.currentPoint].z - playWrj.getPositionZ()) * symbol / Math.abs((wrjPath[wrjParam.currentPoint].z - playWrj.getPositionZ()))) : (wrjPath[wrjParam.currentPoint].z - playWrj.getPositionZ()) * symbol / doTime;//当前z需要移动的距离
            if (isDec) {//如果是返航需要设置为我们给的速度，更加快
                xM = (xM == 0) ? 0 : xM / Math.abs(xM) * wrjParam.backMoveDistance;
                yM = (yM == 0) ? 0 : yM / Math.abs(yM) * wrjParam.backMoveDistance;
                zM = (zM == 0) ? 0 : zM / Math.abs(zM) * wrjParam.backMoveDistance;
            }
            //console.info("xM="+xM+",yM="+yM+",zM="+zM);
            /*xM = (wrjPath[ wrjParam.currentPoint].x - playWrj.getPositionX())/doTime> wrjParam.maxMoveDistance? wrjParam.maxMoveDistance*doTime : (wrjPath[ wrjParam.currentPoint].x - playWrj.getPositionX());
             yM = (wrjPath[ wrjParam.currentPoint].y - playWrj.getPositionY())/doTime >wrjParam.maxMoveDistance? wrjParam.maxMoveDistance*doTime : (wrjPath[ wrjParam.currentPoint].y - playWrj.getPositionY());
             zM = (wrjPath[ wrjParam.currentPoint].z - playWrj.getPositionZ())/doTime >wrjParam.maxMoveDistance? wrjParam.maxMoveDistance*doTime : (wrjPath[ wrjParam.currentPoint].z - playWrj.getPositionZ());*/
            //console.info(playWrj.getPosition());
            //console.info(wrjPath[ wrjParam.currentPoint]);
        } else if (((!isDec && wrjParam.currentPoint >= wrjPath.length - 1) || (isDec && wrjParam.currentPoint <= 1)) && Math.abs(playWrj.getPositionX() - wrjPath[wrjPath.length - 1].x) <= Math.abs(xM)
            && Math.abs(playWrj.getPositionY() - wrjPath[wrjPath.length - 1].y) <= Math.abs(yM)  //这里因为最后一个点与第一个点重复了，这里就不去判断是取第一个点还是最后一个点了
            && Math.abs(playWrj.getPositionZ() - wrjPath[wrjPath.length - 1].z) <= Math.abs(zM)) {//到了结束的时候，已经把最后一个点做完了
            playWrj.setPosition(wrjPath[wrjParam.currentPoint].x, wrjPath[wrjParam.currentPoint].y, wrjPath[wrjParam.currentPoint].z);
            App.myMsg("巡检结束！");
            //console.info("结束");
            camera.lookAt(-500, 0, 2500);
            camera.setPosition(-500, 300, 6500);
            wrjParam.currentPoint = 1;
            clearInterval(wrjParam.wrjCurrentInterval);//结束线程
            removePathNode();//删除路径体
            /*wrjParam.isPlaying && (wrjParam.isPlaying = false);
             wrjParam.isBacking && (wrjParam.isBacking = false);*/
            wrjParam.isPlaying = false;//一定返回false
            wrjParam.isBacking = false;//一定返回false
        } else {
            if (xM != 0 && Math.abs(playWrj.getPositionX() - wrjPath[wrjParam.currentPoint].x) >= Math.abs(xM)) {
                playWrj.setPositionX(playWrj.getPositionX() + xM);
            }
            if (yM != 0 && Math.abs(playWrj.getPositionY() - wrjPath[wrjParam.currentPoint].y) >= Math.abs(yM)) {
                playWrj.setPositionY(playWrj.getPositionY() + yM);
            }
            if (zM != 0 && Math.abs(playWrj.getPositionZ() - wrjPath[wrjParam.currentPoint].z) >= Math.abs(zM)) {
                playWrj.setPositionZ(playWrj.getPositionZ() + zM);
            }
            /*var target=new mono.Vec3(playWrj.getPositionX()+xM/doTime,playWrj.getPositionY()+yM/doTime,playWrj.getPositionZ()+zM/doTime);
             var position=new mono.Vec3().addVectors(offset, target);
             camera.setPosition(position);*/
        }
    }, 10);

}

/**
 * 删除路径体 无人机的路径体
 */
function removePathNode() {
    var datas = box.getDatas();
    for (var i = 0; i < datas.size(); i++) {
        if (datas.get(i).getClient("nodetypeid") == 80) {//路径体，就删除
            wrjParam.pathNode = datas.get(i);
            box.remove(datas.get(i));
            break;
        }
    }
}
/**
 * 结束无人机的巡检
 */
function endPlayNonePersonRobit() {
    if (!wrjParam.isPlaying) {
        App.myMsg("没有需要结束的巡航！");
        return;
    }
    if (wrjParam.isBacking) {//正在返回巡航
        App.Msg("正在结束巡航中。。。。");
        return;
    }
    wrjParam.isBacking = true;
    //wrjParam.isPlaying = false;
    if (wrjParam.wrjCurrentInterval) {
        clearInterval(wrjParam.wrjCurrentInterval);//结束线程
    }
    wrjGoBackOrigPlace();
    //无人机原路返回

    /*removePathNode();
     wrjParam.currentPoint = 1;
     camera.lookAt(-500,0,2500);
     camera.setPosition(-500,300,6500);
     //设置无人机到开始的点
     var datas = box.getDatas();
     if(!wrjParam.curentWrjRobit){
     for(var i=0;i<datas.size();i++){
     if(datas.get(i).getClient("nodetypeid")==79){
     wrjParam.curentWrjRobit = datas.get(i);
     break;
     }
     }
     }*/
    //wrjParam.curentWrjRobit.setPosition(wrjPath[0].x,wrjPath[0].y,wrjPath[0].z);
}

/**
 * 无人机原路返回到起始点
 */
function wrjGoBackOrigPlace() {
    //TODO 无人机返回到原来位置的代码  当前到了哪一个点了，我们应该到当前点的前面一个点
    if (wrjParam.isPlaying && wrjParam.currentPoint > 1) {//开始回去(还是需要做线程)
        var point1 = {
            x: wrjParam.curentWrjRobit.getPositionX(),
            y: wrjParam.curentWrjRobit.getPositionY(),
            z: wrjParam.curentWrjRobit.getPositionZ()
        }
        var point2 = wrjPath[--wrjParam.currentPoint];
        onePointNonePerson(point1, point2, wrjParam.curentWrjRobit, true);//递减的
    } else if (wrjParam.currentPoint <= 1) {
        wrjParam.curentWrjRobit.setPosition(wrjPath[0].x, wrjPath[0].y, wrjPath[0].z);//直接回去
        removePathNode();
        wrjParam.isBacking = false;
        App.myMsg("巡检结束！");
    }
    wrjParam.isPlaying = false;
    //wrjParam.curentWrjRobit;

}


//=======================无人机的相关代码  结束===============================


// 拖动div的插件
/*(function($){
 //拖拽插件,参数:id或object
 $.Move = function(_this){
 if(typeof(_this)=='object'){
 _this=_this;
 }else{
 _this=$("#"+_this);
 }
 if(!_this){return false;}

 _this.css({'position':'absolute'}).hover(function(){$(this).css("cursor","move");},function(){$(this).css("cursor","default");})
 _this.mousedown(function(e){//e鼠标事件
 var offset = $(this).offset();
 var x = e.pageX - offset.left;
 var y = e.pageY - offset.top;
 _this.css({'opacity':'0.3'});
 $(document).bind("mousemove",function(ev){//绑定鼠标的移动事件，因为光标在DIV元素外面也要有效果，所以要用doucment的事件，而不用DIV元素的事件
 _this.bind('selectstart',function(){return false;});
 var _x = ev.pageX - x;//获得X轴方向移动的值
 var _y = ev.pageY - y;//获得Y轴方向移动的值
 _this.css({'left':_x+"px",'top':_y+"px"});
 });
 });

 $(document).mouseup(function(){
 $(this).unbind("mousemove");
 _this.css({'opacity':''});
 })
 };
 })(jQuery)*/

//拖动的插件2
(function ($) {
    $.Move = function (_this) {
        if (typeof(_this) == 'object') {
            _this = _this;
        } else {
            _this = $("#" + _this);
        }
        if (!_this || _this.length == 0) {
            return false;
        }
        _this.mousedown(function (e)//e鼠标事件 
        {
            $(this).css("cursor", "move");//改变鼠标指针的形状 

            var offset = $(this).offset();//DIV在页面的位置 
            var x = e.pageX - offset.left;//获得鼠标指针离DIV元素左边界的距离 
            var y = e.pageY - offset.top;//获得鼠标指针离DIV元素上边界的距离 
            $(document).bind("mousemove", function (ev)//绑定鼠标的移动事件，因为光标在DIV元素外面也要有效果，所以要用doucment的事件，而不用DIV元素的事件 
            {
                _this.stop();//加上这个之后 
                var _x = ev.pageX - x;//获得X轴方向移动的值 
                var _y = ev.pageY - y;//获得Y轴方向移动的值 
                _this.animate({left: _x + "px", top: _y + "px"}, 10);
            });

        });

        $(document).mouseup(function () {
            $(".show").css("cursor", "default");
            $(this).unbind("mousemove");
        });
    }
})(jQuery);

//拖动的插件3
(function ($) {
    $.fn.drag_div = function (event) {
        //$(this).css({'position':'absolute'}).hover(function(){$(this).css("cursor","move");},function(){$(this).css("cursor","default");});
        var parent = $(this).parent();//查找他需要拖动的父节点（弹出框最外层div）
        return this.mousedown(function (event) {
            //当鼠标点击时鼠标的坐标-被拖动元素的left
            var x = event.pageX - parseInt($(parent).css('left'));

            //当鼠标点击时鼠标的坐标-被拖动元素的top
            var y = event.pageY - parseInt($(parent).css('top'));

            //点击不放开鼠标移动鼠标时触发事件
            $(parent).mousemove(function (event) {
                //移动鼠标时，层的left和top,width,height
                var _x = parseInt($(parent).css('left'));

                var _y = parseInt($(parent).css('top'));

                var width = parseInt($(parent).width());

                var height = parseInt($(parent).height());

                //当鼠标的坐标在层内部时.为了解决快速移动鼠标而出现的bug
                if (event.pageX > _x && event.pageX < (_x + width) && event.pageY > _y && event.pageY < (_y + height)) {

                    var pagex = event.pageX;

                    var pagey = event.pageY;

                    var now_x = event.pageX - x;

                    var now_y = event.pageY - y;

                    $(parent).css({left: now_x, top: now_y});

                    //else解绑事件
                }
                else {

                    $(parent).unbind('mousemove');

                }

            });

            //鼠标弹起解绑事件
        }).mouseup(function () {
            $(parent).unbind('mousemove');
        });

    };

})(jQuery);

