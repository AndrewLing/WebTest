/**
 * Created by PL02053 on 2016/2/2.
 */
(function () {

    twaver.Util.validateLicense(
        "l=1.0\n" +
        "type=3\n" +
        "gis=0\n" +
        "3d=0\n" +
        "start=2015-05-22\n" +
        "licensee=Chengdu TD Tech Ltd.\n" +
        "licensedUser=1 USER\n" +
        "periodofValidity=PERMANENT\n" +
        "maintenanceandUpgrade=12 MONTH\n" +
        "buyer=Chengdu TD Tech Ltd.\n" +
        "signature=4fdb7472d59c99b2d12af2b6635807b462bfdc082d7bad65a6d675c080e17b5022bd0523b5a1a4a90b15ef8869864e9a360f7bd14fba390344e6e74074b293ae0341838c7e9830c947dd8a61ca901ce95ae1077b48284d3052fcd63ef4e72ee93ea688bac7093bbe8d3c075a502ec0e055b68aaf68a33aaf2448f7cc366038fc1cd5169ab69829bd649a529952cfbf02960af890e17eef9f5a0e8f5ad0c9bfb01cd3273ba9f929634d08c70a397a001bc553a2d94e242f9fc181642feecb5ce7466708e6af7f569c927b146718db7d9b31e550def5b1ad4d794c99b31b34cd252b4d2913ad685b2b6f95f8c23ca7382ee17fea28c806dc6d28ef293f91a4a0e6"
    );

    window.topo = {};

    window.topo.Util = {

        /**
         * 注册用户自定义的图片
         *
         * @param url {String} 图片主URL（以‘/’结束）
         * @param name {String} 图片相对地址
         * @param network {twaver.Network} TWaver画布容器
         */
        registerImage: function (url, name, network) {
            var image = new Image();
            image.src = url + name;
            var views = arguments;
            image.onload = function () {
                twaver.Util.registerImage(topo.Util.getImageName(name), image, image.width, image.height);
                image.onload = null;
                for (var i = 1; i < views.length; i++) {
                    var view = views[i];
                    if (view.invalidateElementUIs) {
                        view.invalidateElementUIs();
                    }
                    if (view.invalidateDisplay) {
                        view.invalidateDisplay();
                    }
                }
            };
        },
        /**
         * 从图片URL中获取图片名
         *
         * @param url {String} 图片相对URL
         * @returns {String}
         */
        getImageName: function (url) {
            var index = url.lastIndexOf('/');
            var name = url;
            if (index >= 0) {
                name = url.replace('/', '_');
            }
            index = name.lastIndexOf('.');
            if (index >= 0) {
                name = name.substring(0, index);
            }
            return name;
        },

        getDeviceId: function (node) {
            return node.getClient('deviceid');
        },

        getNodeTypeId: function (node) {
            return node.getClient('nodetypeid');
        },

        getTopographId: function (node) {
            return node.getClient('topographid');
        },

        /**
         * 所有图元图片注册
         * @param network
         */
        registerImages: function (network) {
            var imagesPath = "./js/topo/images/topoNodeIcon/";
            /*********************** 图元注册 ****************************/
            this.registerImage(imagesPath, "3d-zlHLX.png", network);
            this.registerImage(imagesPath, "3d-zlHLXr.png", network);
            this.registerImage(imagesPath, "3d-zlHLXrgreen.png", network);
            this.registerImage(imagesPath, "3d-zlHLXrred.png", network);
            this.registerImage(imagesPath, "bileizhenr.png", network);
            this.registerImage(imagesPath, "busNode.png", network);
            this.registerImage(imagesPath, "cyd_factorydianbiaor.png", network);
            this.registerImage(imagesPath, "cyd_factorynondianbiaor.png", network);
            this.registerImage(imagesPath, "duanluqir.png", network);
            this.registerImage(imagesPath, "duanluqirreal.png", network);
            this.registerImage(imagesPath, "duanluqierror.png", network);
            this.registerImage(imagesPath, "duanluqi3dr.png", network);
            this.registerImage(imagesPath, "duanluqifull.png", network);
            this.registerImage(imagesPath, "duanluqizjxfull.png", network);
            this.registerImage(imagesPath, "duanluqizjxr.png", network);
            this.registerImage(imagesPath, "duanluqizjxerror.png", network);
            this.registerImage(imagesPath, "dixianyour.png", network);
            this.registerImage(imagesPath, "dixianzuor.png", network);
            this.registerImage(imagesPath, "duanluqi3d.png", network);
            this.registerImage(imagesPath, "dianbiaor.png", network);
            this.registerImage(imagesPath, "daidianzzr.png", network);
            this.registerImage(imagesPath, "dianrongr.png", network);
            this.registerImage(imagesPath, "diankangr.png", network);
            this.registerImage(imagesPath, "tongyong.png", network);
            this.registerImage(imagesPath, "sanxiang.png", network);
            this.registerImage(imagesPath, "sanxiangr.png", network);
            this.registerImage(imagesPath, "zizhen.png", network);
            this.registerImage(imagesPath, "zizhenr.png", network);
            this.registerImage(imagesPath, "guangzipai.png", network);
            this.registerImage(imagesPath, "jiaoliuhuiliuxiang.png", network);
            this.registerImage(imagesPath, "jiaoliuhuiliuxiangr.png", network);
            this.registerImage(imagesPath, "xiangbian.png", network);
            this.registerImage(imagesPath, "xiangbianr.png", network);
            this.registerImage(imagesPath, "nibianqizc.png", network);
            this.registerImage(imagesPath, "nibianqizcr.png", network);
            this.registerImage(imagesPath, "nibianqiyc.png", network);
            this.registerImage(imagesPath, "nibianqiycg.png", network);
            this.registerImage(imagesPath, "nibianqiycr.png", network);
            this.registerImage(imagesPath, "nibianqi3d.png", network);
            this.registerImage(imagesPath, "nibianqi3dgreen.png", network);
            this.registerImage(imagesPath, "nibianqi3dred.png", network);
            this.registerImage(imagesPath, "shujucaijiqi.png", network);
            this.registerImage(imagesPath, "shujucaijiqir.png", network);
            this.registerImage(imagesPath, "shujucaijiqig.png", network);
            this.registerImage(imagesPath, "shujucaijiqired.png", network);
            this.registerImage(imagesPath, "text_icon.png", network);
            this.registerImage(imagesPath, "zuchuanlan.png", network);
            this.registerImage(imagesPath, "zuchuanhong.png", network);
            this.registerImage(imagesPath, "zuchuanhui.png", network);
            this.registerImage(imagesPath, "zuchuanhei.png", network);
            this.registerImage(imagesPath, "zuchuan23r.png", network);
            this.registerImage(imagesPath, "zuchuan22r.png", network);
            this.registerImage(imagesPath, "table.png", network);
            this.registerImage(imagesPath, "zuchuan3dr.png", network);
            this.registerImage(imagesPath, "jiaoliuhuiliuxiang3dr.png", network);
            this.registerImage(imagesPath, "huanjingyir.png", network);
            this.registerImage(imagesPath, "sanxiang3dr.png", network);
            this.registerImage(imagesPath, "ptr.png", network);
            this.registerImage(imagesPath, "imagenoder.png", network);
            this.registerImage(imagesPath, "jiedikaiguanzuor.png", network);
            this.registerImage(imagesPath, "jiedikaiguanzuohe.png", network);
            this.registerImage(imagesPath, "jiedikaiguanzuoerror.png", network);
            this.registerImage(imagesPath, "jiedikaiguanyour.png", network);
            this.registerImage(imagesPath, "gelidaozhashangr.png", network);
            this.registerImage(imagesPath, "gelidaozhaxiar.png", network);
            this.registerImage(imagesPath, "shangjiantour.png", network);
            this.registerImage(imagesPath, "xiajiantour.png", network);
            this.registerImage(imagesPath, "gk_dianbiaor.png", network);
            this.registerImage(imagesPath, "hjz_dianbiaor.png", network);
            this.registerImage(imagesPath, "zizhenxjr.png", network);
            this.registerImage(imagesPath, "liangxiangljr.png", network);
            this.registerImage(imagesPath, "liangxiangsjr.png", network);
            this.registerImage(imagesPath, "liangxiang3dljr.png", network);
            this.registerImage(imagesPath, "liangxiang3dsjr.png", network);
            this.registerImage(imagesPath, "duanluqizjxr.png", network);
            this.registerImage(imagesPath, "toumingpic.png", network);
            this.registerImage(imagesPath, "zlHLX.png", network);
            this.registerImage(imagesPath, "zlHLXr.png", network);
            this.registerImage(imagesPath, "newzlHLXrgreen.png", network);
            this.registerImage(imagesPath, "newzlHLXred.png", network);
            this.registerImage(imagesPath, "jzNBQ3D.png", network);
            this.registerImage(imagesPath, "jzNBQ3Dgreen.png", network);
            this.registerImage(imagesPath, "jzNBQ3Dred.png", network);
            this.registerImage(imagesPath, "jzNBQ-left.png", network);
            this.registerImage(imagesPath, "jzNBQ-right.png", network);
            this.registerImage(imagesPath, "jzNBQ-rightred.png", network);
            this.registerImage(imagesPath, "jzNBQ-rightgreen.png", network);
            this.registerImage(imagesPath, "jzZuChuan.png", network);
            this.registerImage(imagesPath, "xiangbian3D.png", network);
            this.registerImage(imagesPath, "powerRegulation.png", network);
            this.registerImage(imagesPath, "xbljzt3.png", network);
            this.registerImage(imagesPath, "xbljft1.png", network);
            this.registerImage(imagesPath, "xbljzt1.png", network);
            this.registerImage(imagesPath, "xbljft2.png", network);
            this.registerImage(imagesPath, "xbljzt2.png", network);
            this.registerImage(imagesPath, "xbljft3.png", network);
            this.registerImage(imagesPath, "xbljzt4.png", network);
            this.registerImage(imagesPath, "xbljft4.png", network);
            this.registerImage(imagesPath, "xbljzt5.png", network);
            this.registerImage(imagesPath, "xbljft5.png", network);
            this.registerImage(imagesPath, "xbsjzt1.png", network);
            this.registerImage(imagesPath, "xbsjft1.png", network);
            this.registerImage(imagesPath, "xbsjzt2.png", network);
            this.registerImage(imagesPath, "xbsjft2.png", network);
            this.registerImage(imagesPath, "xbsjzt3.png", network);
            this.registerImage(imagesPath, "xbsjft3.png", network);
            this.registerImage(imagesPath, "xbsjzt4.png", network);
            this.registerImage(imagesPath, "xbsjft4.png", network);
            this.registerImage(imagesPath, "xbsjzt5.png", network);
            this.registerImage(imagesPath, "xbsjft5.png", network);
            this.registerImage(imagesPath, "xbsjzt6.png", network);
            this.registerImage(imagesPath, "xbsjft6.png", network);
            this.registerImage(imagesPath, "tgjr.png", network);
            this.registerImage(imagesPath, "tgjd.png", network);
            this.registerImage(imagesPath, "tgjerror.png", network);
            this.registerImage(imagesPath, "indexnode.png", network);
            this.registerImage(imagesPath, "fldiankangr.png", network);
            this.registerImage(imagesPath, "dianganr.png", network);
            this.registerImage(imagesPath, "yuankongr.png", network);
            this.registerImage(imagesPath, "yuankongmr.png", network);
            this.registerImage(imagesPath, "yuankongyc.png", network);
            this.registerImage(imagesPath, "pidTopoImg.png", network);
            this.registerImage(imagesPath, "pidTopoImgN.png", network);
            this.registerImage(imagesPath, "pidTopoImgY.png", network);
            this.registerImage(imagesPath, "pidTopoImg3D.png", network);
            this.registerImage(imagesPath, "pidTopoImg3DN.png", network);
            this.registerImage(imagesPath, "pidTopoImg3DY.png", network);
            this.registerImage(imagesPath, "zuchuan24r.png", network);
            this.registerImage(imagesPath, "nibianqikaiguanr.png", network);
            this.registerImage(imagesPath, "NBQkgerror.png", network);
            this.registerImage(imagesPath, "nibianqi_kai.png", network);
            this.registerImage(imagesPath, "RCLCG.png", network);
            this.registerImage(imagesPath, "RCLCR.png", network);

            this.registerImage(imagesPath, "C176-10.png", network);
            this.registerImage(imagesPath, "C176-110.png", network);
            this.registerImage(imagesPath, "C176-220.png", network);
            this.registerImage(imagesPath, "C176-35.png", network);
            this.registerImage(imagesPath, "C176-500.png", network);
            this.registerImage(imagesPath, "C176-sy.png", network);
            this.registerImage(imagesPath, "T176-10.png", network);
            this.registerImage(imagesPath, "T176-110.png", network);
            this.registerImage(imagesPath, "T176-220.png", network);
            this.registerImage(imagesPath, "T176-35.png", network);
            this.registerImage(imagesPath, "T176-500.png", network);
            this.registerImage(imagesPath, "T176-sy.png", network);
            this.registerImage(imagesPath, "Y176-10.png", network);
            this.registerImage(imagesPath, "Y176-110.png", network);
            this.registerImage(imagesPath, "Y176-220.png", network);
            this.registerImage(imagesPath, "Y176-35.png", network);
            this.registerImage(imagesPath, "Y176-500.png", network);
            this.registerImage(imagesPath, "Y176-sy.png", network);

            this.registerImage(imagesPath, "fivePreventG.png", network);
            this.registerImage(imagesPath, "fivePreventR.png", network);
            this.registerImage(imagesPath, "pt1.png", network);
            this.registerImage(imagesPath, "skip_green.png", network);
            this.registerImage(imagesPath, "skip_red.png", network);
            this.registerImage(imagesPath, "skip_grey.png", network);
            this.registerImage(imagesPath, "stationStatus.png", network);
            this.registerImage(imagesPath, "station_pic.png", network);
            this.registerImage(imagesPath, "substation.png", network);

            this.registerImage(imagesPath, "centralizedCC.png", network);
            this.registerImage(imagesPath, "lineframe.png", network);
            this.registerImage(imagesPath, "manualsettingDE.png", network); //人工置位默认
            this.registerImage(imagesPath, "manualsettingON.png", network); //人工置位开
            this.registerImage(imagesPath, "manualsettingOFF.png", network); //人工置位关
            this.registerImage(imagesPath, "manualsettingButton.png", network); //人工置位按键

            this.registerImage(imagesPath, "zhujiButton.png", network);//主机图标
            this.registerImage(imagesPath, "beijiButton.png", network);//备机图标
            this.registerImage(imagesPath, "zbDefault.png", network);//主备默认状态
            this.registerImage(imagesPath, "zbwork.png", network);//主备正常状态
            this.registerImage(imagesPath, "zbwrong.png", network);//主备异常状态

            this.registerImage(imagesPath, "blq1_static_32.png", network);
            this.registerImage(imagesPath, "blq2_static_32.png", network);
            this.registerImage(imagesPath, "Breakdown_gap_static_32.png", network);
            this.registerImage(imagesPath, "DC_xiaoxie_static_32.png", network);
            this.registerImage(imagesPath, "xiaohu_static_32.png", network);
            this.registerImage(imagesPath, "ct_gd_static_32.png", network);
            this.registerImage(imagesPath, "ct_static_32.png", network);
            this.registerImage(imagesPath, "PT_32.png", network);
            this.registerImage(imagesPath, "PT1gd_static_32.png", network);
            this.registerImage(imagesPath, "PT1_32.png", network);
            this.registerImage(imagesPath, "pt2_32.png", network);
            this.registerImage(imagesPath, "pt3_32.png", network);
            this.registerImage(imagesPath, "PT4-_GD_32.png", network);
            this.registerImage(imagesPath, "pt5_static_32.png", network);
            this.registerImage(imagesPath, "pt5gd_static_32.png", network);
            this.registerImage(imagesPath, "bldk_static_32.png", network);
            this.registerImage(imagesPath, "cldk_32.png", network);
            this.registerImage(imagesPath, "dk_GD_32.png", network);
            this.registerImage(imagesPath, "rk_GD_32.png", network);
            this.registerImage(imagesPath, "xbsj7.png", network);
            this.registerImage(imagesPath, "xbsj8.png", network);

            this.registerImage(imagesPath, "shoucher.png", network);
            this.registerImage(imagesPath, "shouchemr.png", network);
            this.registerImage(imagesPath, "shoucheyc.png", network);
            this.registerImage(imagesPath, "sigle_Hand-car_break-off_32.png", network);
            this.registerImage(imagesPath, "sigle_Hand-car_Close_32.png", network);
            this.registerImage(imagesPath, "sh_sigle_Hand-car_break-off.png", network);
            this.registerImage(imagesPath, "SH_Hand-car_Close.png", network);
            this.registerImage(imagesPath, "Hand-car_Close_32.png", network);
            this.registerImage(imagesPath, "Hand-car_break-off_32.png", network);
            this.registerImage(imagesPath, "Hand-car_break-off_button.png", network);

            this.registerImage(imagesPath, "transfer_up_32.png", network);
            this.registerImage(imagesPath, "transfer_down_32.png", network);
            this.registerImage(imagesPath, "transfer_stop_32.png", network);

            this.registerImage(imagesPath, "stationSkip.png", network);
            this.registerImage(imagesPath, "stationSkipButton.png", network);

            this.registerImage(imagesPath, "LJB.png", network);
            this.registerImage(imagesPath, "ruanyafenr.png", network);
            this.registerImage(imagesPath, "yingyafenr.png", network);
            this.registerImage(imagesPath, "motorr.png", network);
            this.registerImage(imagesPath, "dynamotorr.png", network);
            this.registerImage(imagesPath, "tongyongyaokong.png", network);

            //注册天气图元
            this.registerImage(imagesPath, "weatherIcons/0.png", network);
            this.registerImage(imagesPath, "weatherIcons/1.png", network);
            this.registerImage(imagesPath, "weatherIcons/2.png", network);
            this.registerImage(imagesPath, "weatherIcons/3.png", network);
            this.registerImage(imagesPath, "weatherIcons/4.png", network);
            this.registerImage(imagesPath, "weatherIcons/5.png", network);
            this.registerImage(imagesPath, "weatherIcons/6.png", network);
            this.registerImage(imagesPath, "weatherIcons/7.png", network);
            this.registerImage(imagesPath, "weatherIcons/8.png", network);
            this.registerImage(imagesPath, "weatherIcons/9.png", network);
            this.registerImage(imagesPath, "weatherIcons/10.png", network);
            this.registerImage(imagesPath, "weatherIcons/11.png", network);
            this.registerImage(imagesPath, "weatherIcons/12.png", network);
            this.registerImage(imagesPath, "weatherIcons/13.png", network);
            this.registerImage(imagesPath, "weatherIcons/14.png", network);
            this.registerImage(imagesPath, "weatherIcons/15.png", network);
            this.registerImage(imagesPath, "weatherIcons/16.png", network);
            this.registerImage(imagesPath, "weatherIcons/17.png", network);
            this.registerImage(imagesPath, "weatherIcons/18.png", network);
            this.registerImage(imagesPath, "weatherIcons/19.png", network);
            this.registerImage(imagesPath, "weatherIcons/20.png", network);
            this.registerImage(imagesPath, "weatherIcons/21.png", network);
            this.registerImage(imagesPath, "weatherIcons/22.png", network);
            this.registerImage(imagesPath, "weatherIcons/23.png", network);
            this.registerImage(imagesPath, "weatherIcons/24.png", network);
            this.registerImage(imagesPath, "weatherIcons/25.png", network);
            this.registerImage(imagesPath, "weatherIcons/26.png", network);
            this.registerImage(imagesPath, "weatherIcons/27.png", network);
            this.registerImage(imagesPath, "weatherIcons/28.png", network);
            this.registerImage(imagesPath, "weatherIcons/29.png", network);
            this.registerImage(imagesPath, "weatherIcons/30.png", network);
            this.registerImage(imagesPath, "weatherIcons/31.png", network);
            this.registerImage(imagesPath, "weatherIcons/32.png", network);
            this.registerImage(imagesPath, "weatherIcons/33.png", network);
            this.registerImage(imagesPath, "weatherIcons/34.png", network);
            this.registerImage(imagesPath, "weatherIcons/35.png", network);
            this.registerImage(imagesPath, "weatherIcons/36.png", network);
            this.registerImage(imagesPath, "weatherIcons/37.png", network);
            this.registerImage(imagesPath, "weatherIcons/38.png", network);
            this.registerImage(imagesPath, "weatherIcons/99.png", network);
            //图元注册
            registerCustomImage();
        },
        /**
         * 绘图
         * @param id {String} DOM容器 ID
         * @param data {String} 数据字符串
         * @param fn {Function} 点击图元回调方法
         * @param editable {Boolean} 是否可编辑
         * @param type {String} 数据类型 'json'|'xml'，默认‘xml’
         */
        render: function (id, data, fn, editable, type) {
            var self = this;
            editable = editable || false;
            var dom = document.getElementById(id);
            dom.innerHTML = "";

            var network = new twaver.network.Network();
            network.setEditableFunction(function () {
                return editable;
            });
            network.setMovableFunction(function () {
                return editable;
            });
            network.setKeyboardRemoveEnabled(false);
            //network.setPanInteractions(); // 启用抓图模式
            network.setEditInteractions(true);
            network.setRectSelectEnabled(false);
            network.addInteractionListener(function (e) {
                if (e.kind == "doubleClickElement") {
                    var node = e.element;
                    fn && fn(node);
                }
            });
            self.registerImages(network);
            self.setPopupMenu(network);

            var networkDom = network.getView();
            networkDom.style.width = "100%";
            networkDom.style.height = "100%";
            networkDom.style.backgroundColor = "rgba(0,0,0,0)";
            //networkDom.addEventListener('mousemove', function (e) {
            //var element = network.getElementAt(e);
            // 图元鼠标样式是否手型
            //if (
            //    element instanceof topo.NiBianQi
            //    || element instanceof topo.JZNiBianQi
            //    || element instanceof topo.ZiZhen
            //    || element instanceof topo.ZiZhenXJ
            //    || element instanceof topo.SkipButton
            //    || element instanceof topo.StatusButton
            //    || element instanceof topo.JUMP
            //    ||  element instanceof topo.skipTopoPic
            //) {
            //    networkDom.style.cursor = 'pointer';
            //}
            //else {
            //    networkDom.style.cursor = 'default';
            //}
            //});
            networkDom.style.cursor = 'default';
            dom.appendChild(networkDom);

            $(dom).resize(function (e) {
                network.invalidate();
            });

            var box = network.getElementBox();
            var setting = new twaver.SerializationSettings();
            self.setClientPropertyType(setting);
            if (type && type.toLowerCase() == 'json')
                new twaver.JsonSerializer(box, setting).deserialize(data, null);
            else
                new twaver.XmlSerializer(box, setting).deserialize(data, null);

            return box;
        },

        /**
         * 设置右键菜单
         * @param network
         */
        setPopupMenu: function (network) {
            var popupMenu = new twaver.controls.PopupMenu(network);
            popupMenu.setMenuItems([]);
            popupMenu.onAction = function (menuItem) {
            };
            popupMenu.isVisible = function (menuItem) {
                return false;
            };
        },

        /**
         * 设置客户属性类型
         * @param setting
         */
        setClientPropertyType: function (setting) {
            setting.setPropertyType("id", "string");
            setting.setPropertyType("image", "cdata");
            setting.setPropertyType("angle", "number");


            setting.setStyleType("component.width", "cdata");
            setting.setStyleType("component.height", "cdata");
            setting.setStyleType("component.fillcolor", "cdata");
            setting.setStyleType("circleChart.color", "cdata");
            setting.setStyleType("wholeColor", "cdata");
            setting.setStyleType('ljbAlign', "cdata");


            setting.setClientType("anotherName", "cdata");
            setting.setClientType("nodetypeid", "cdata");
            setting.setClientType("nodetypename", "cdata");
            setting.setClientType("deviceid", "cdata");
            setting.setClientType("devicename", "cdata");
            setting.setClientType("hostnodeid", "cdata");
            setting.setClientType("hostnodename", "cdata");
            setting.setClientType("signalid", "cdata");
            setting.setClientType("signalname", "cdata");
            setting.setClientType("signalcolname", "cdata");
            setting.setClientType("signalunit", "cdata");
            setting.setClientType("signaltype", "cdata");
            setting.setClientType("yksignalid", "cdata");
            setting.setClientType("yksignalname", "cdata");
            setting.setClientType("yksignalcolname", "cdata");
            setting.setClientType("yksignalunit", "cdata");
            setting.setClientType("yksignaltype", "cdata");
            setting.setClientType("ykkqsignalid", "cdata");
            setting.setClientType("ykkqsignalname", "cdata");
            setting.setClientType("ykkqsignalcolname", "cdata");
            setting.setClientType("ykkqsignalunit", "cdata");
            setting.setClientType("ykkqsignaltype", "cdata");
            setting.setClientType("schemaBindInfoID", "cdata");
            setting.setClientType("ykschemaBindInfoID", "cdata");
            setting.setClientType("ykkqschemaBindInfoID", "cdata");
            setting.setClientType("ykgbschemaBindInfoID", "cdata");
            setting.setClientType("ykgbsignalcolname", "cdata");
            setting.setClientType("ykgbsignalid", "cdata");
            setting.setClientType("ykgbsignalname", "cdata");
            setting.setClientType("ykgbsignalunit", "cdata");
            setting.setClientType("ykgbsignaltype", "cdata");
            setting.setClientType("bussinessCode", "cdata");
            setting.setClientType("ESN", "cdata");
            setting.setClientType("name", "cdata");
            setting.setClientType("ip", "cdata");
            setting.setClientType("modelVersionID", "cdata");
            setting.setClientType("topographid", "cdata");
            setting.setClientType("picpath", "cdata");
            setting.setClientType("secondaddress", "cdata");
            setting.setClientType("topographname", "cdata");
            setting.setClientType("modelVersionName", "cdata");
            setting.setClientType("highvswitch", "cdata");
            setting.setClientType("lowvcircuitbreaker1", "cdata");
            setting.setClientType("lowvcircuitbreaker2", "cdata");
            setting.setClientType("kksCode", "cdata");
            setting.setClientType("capacity", "cdata");
            setting.setClientType("parentdevid", "cdata");
            setting.setClientType("parentdevName", "cdata");
            setting.setClientType("devProColName", "cdata");
            setting.setClientType("devProName", "cdata");
            setting.setClientType("texttype", "cdata");
            setting.setClientType("devProId", "cdata");
            setting.setClientType("relationKeyId", "cdata");
            setting.setClientType("devicePort", "cdata");
            setting.setClientType("signalobject", "cdata");
            setting.setClientType("signalkind", "cdata");

            setting.setClientType("stationNumber", "cdata");
            setting.setClientType("stationIp", "cdata");
            setting.setClientType("stationId", "cdata");
            setting.setClientType("stationSendUrl", "cdata");

            setting.setClientType("status", "cdata");

            setting.setClientType("colorTop", "cdata");
            setting.setClientType("colorTopzdy", "cdata");
            setting.setClientType("colorBelow", "cdata");
            setting.setClientType("colorBelowzdy", "cdata");
            setting.setClientType("colorJiantou", "cdata");

            setting.setClientType("leftColor", "cdata");
            setting.setClientType("leftColorzdy", "cdata");
            setting.setClientType("rightColor", "cdata");
            setting.setClientType("topColor", "cdata");
            setting.setClientType("topColorzdy", "cdata");

            setting.setClientType("wholeColorgd", "cdata");
            setting.setClientType("wholeColorgdzdy", "cdata");
            setting.setClientType("wholeColor", "cdata");
            setting.setClientType("wholeColorzdy", "cdata");
            setting.setClientType("wholeColorJT", "cdata");

            setting.setClientType("lineColors", "cdata");
            setting.setClientType("jiudiColor", "cdata");
            setting.setClientType("yuanfangColor", "cdata");

            setting.setClientType("optType", "cdata");
            setting.setClientType("lLimitValue", "cdata");
            setting.setClientType("hLimitValue", "cdata");
            setting.setClientType("xbAlign", "cdata");
            setting.setClientType("ljbAlign", "cdata");
        },

        /**
         * 获取TOPO图中设备信号点绑定关系
         * @param box {twaver.ElementBox}
         * @param deviceId {String}
         */
        getSignalsParams: function (box, deviceId) {
            var self = this;
            var dataNodes = box.getDatas();
            if (deviceId) {
                return self.getSignalsByDivceId(dataNodes, deviceId);
            }
            return self.getSignals(dataNodes);
        },

        /**
         * 从数据节点中获取所有的电站Id
         */
        getSids: function (box) {
            var dataNodes = box.getDatas();
            var sIds = [];
            dataNodes.forEach(function (e) {
                if (e instanceof topo.WEATHER) {
                    var sid = e.getClient("stationNumber");
                }
                if (sid) {
                    sIds.push(sid);
                }
                if (e instanceof topo.YXB1 || e instanceof topo.YXB2 || e instanceof topo.YXB3) {
                    var picvalue = e.getImage();
                    if (picvalue) {
                        e.setImage(picvalue)
                    }
                }
            });
            return sIds;
        },

        /**
         * 获取跳转到监控的IP和Id
         */
        getIpAndSid: function (e) {
            var result = new Array();
            if (e instanceof topo.JUMP) {
                var sid = e.getClient("stationNumber");
            }
            if (sid) {
                result.push(sid);
            }
            return result;
        },

        /**
         * 从数据节点中获取设备信号点绑定关系
         * @param dataNodes 数据节点集合
         * @returns {Array}
         */
        getSignals: function (dataNodes) {
            var devSignalMap = [];
            dataNodes.forEach(function (e) {
                var deviceID = e.getClient("deviceid");
                if (deviceID) {
                    var dev = {};
                    dev.devID = deviceID;
                    var signalIDs = [];
                    var nodeType = e.getClient("nodetypeid");
                    // 获取设备属性绑定关系
                    if (7 == nodeType && e.getClient("texttype") && e.getClient("texttype") == 1) {
                        var devProName = e.getClient("devProName");
                        var devProColName = e.getClient("devProColName");
                        var devProId = e.getClient("devProId");
                        if (devProName && devProColName && deviceID && devProId) {
                            dev.name = devProName;
                            dev.colName = devProColName;
                            signalIDs = devProId;
                        }
                        dev.signalIDs = signalIDs;
                        devSignalMap.push(dev);
                    }
                    // 获取设备信息号点绑定关系
                    else {
                        var signalID = e.getClient("signalid");
                        if (signalID) {
                            var temps = signalID.split(",");
                            if (7 == nodeType) {
                                if (temps.length > 1) {
                                    for (var item = 0; item < temps.length; item++) {
                                        if (temps[item] > 0) { //组串未关联时signalID负数，此时不将此id放入信号点查询的map中
                                            signalIDs.push(temps[item]);
                                        }
                                    }
                                } else {
                                    signalIDs.push(signalID);
                                }
                            }
                            else if ((14 == nodeType) || (9 == nodeType) || (31 == nodeType)
                                || (64 == nodeType) || (65 == nodeType) || (28 == nodeType) || (68 == nodeType)) {
                                signalIDs.push(signalID);
                            }
                            else if (6 == nodeType || 8 == nodeType || 46 == nodeType || 67 == nodeType) {
                                for (var item = 0; item < temps.length; item++) {
                                    if (temps[item] > 0) { //组串未关联时signalID负数，此时不将此id放入信号点查询的map中
                                        signalIDs.push(temps[item]);
                                    }
                                }
                            }
                        }
                    }
                    dev.signalIDs = signalIDs;
                    var mapLength = devSignalMap.length;
                    if (mapLength > 0) {
                        var devIDFlag = true;
                        for (var i = 0; i < mapLength; i++) {
                            var mapDevID = devSignalMap[i].devID;
                            if (mapDevID == dev.devID) {
                                if (devSignalMap[i].signalIDs instanceof Array) {
                                    devSignalMap[i].signalIDs = devSignalMap[i].signalIDs.concat(signalIDs);
                                } else {
                                    devSignalMap[i].signalIDs = signalIDs;
                                }
                                devIDFlag = false;
                                return;
                            }
                        }
                        if (devIDFlag) {
                            devSignalMap.push(dev);
                        }
                    } else {
                        devSignalMap.push(dev);
                    }
                }
            });
            return devSignalMap;
        },

        /**
         * 从数据节点中获取指定设备的所有绑定信号点
         * @param dataNodes 数据节点集合
         * @param deviceId 设备ID
         * @returns {Array}
         */
        getSignalsByDivceId: function (dataNodes, deviceId) {
            var devSignalMap = [];
            dataNodes.forEach(function (e) {
                var dev = {};
                dev.devID = deviceId;
                var signalIDs = [];
                var signalID = e.getClient("signalid");
                if (signalID) {
                    var nodeType = e.getClient("nodetypeid");
                    //if ((7 == nodeType) || (14 == nodeType) || (9 == nodeType) || (31 == nodeType)
                    //    || (64 == nodeType) || (65 == nodeType) || (28 == nodeType) || (68 == nodeType)
                    //    || (46 == nodeType)) {
                    signalIDs.push(signalID);
                    //}
                }
                dev.signalIDs = signalIDs;
                var mapLength = devSignalMap.length;
                if (mapLength > 0) {
                    var devIDFlag = true;
                    for (var i = 0; i < mapLength; i++) {
                        var mapDevID = devSignalMap[i].devID;
                        if (mapDevID == dev.devID) {
                            devSignalMap[i].signalIDs = devSignalMap[i].signalIDs.concat(signalIDs);
                            devIDFlag = false;
                            return;
                        }
                    }
                    if (devIDFlag) {
                        devSignalMap.push(dev);
                    }
                } else {
                    devSignalMap.push(dev);
                }
            });
            return devSignalMap;
        },

        /**
         * 得到拓扑图序列化 XML 数据
         * @param box {twaver.ElementBox}
         */
        getCurXMLData: function (box) {
            var setting = new twaver.SerializationSettings();
            this.setClientPropertyType(setting);
            var serializer = new twaver.XmlSerializer(box, setting);
            return serializer.serialize();
        },

        /**
         * TOPO图上信号点数据更新渲染
         * @param box {twaver.ElementBox}
         * @param data {Object}
         * <pre>
         *     {
         *          'deviceId1':
         *          {'signalId1': signalValue1, … ,'signalIdN': signalVlaueN},
          *          … ,
          *         'deviceIdN':
          *         {'signalId1': signalValue1, … ,'signalIdN': signalVlaueN}
          *    }
         * </pre>
         */
        updateData: function (box, data) {
            var self = this;
            var nodes = box.getDatas();
            nodes.forEach(function (e) {
                var deviceID = e.getClient("deviceid");
                if (data && data[deviceID]) {
                    self.setSignalsValue(e, data[deviceID]);
                }
            });
        },
        /**
         * TOPO图上设备属性数据更新渲染
         * @param box {twaver.ElementBox}
         * @param data {Object}
         * <pre>
         *     {
         *          'deviceId1':
         *          {'decProId1': devProValue1, … ,'decProIdN': devProValueN},
          *          … ,
          *         'deviceIdN':
          *         {'decProId1': devProValue1, … ,'decProIdN': devProValueN}
          *    }
         * </pre>
         */
        updateDevProData: function (box, data) {
            var nodes = box.getDatas();
            nodes.forEach(function (e) {
                var deviceID = e.getClient("deviceid");
                if (data && data[deviceID]) {
                    var nodeType = e.getClient("nodetypeid");
                    if (7 == nodeType) {
                        var devProId = e.getClient("devProId");
                        if (devProId) {
                            e.setName(data[deviceID] && data[deviceID][devProId] ? data[deviceID][devProId] : "#");
                        }
                    }
                }
            });
        },
        /**
         * TOPO图上设备状态数据更新渲染
         * @param box
         * @param data
         * @param deviceID
         * @param deviceName
         */
        updateDevData: function (box, data, deviceID, deviceName) {
            var self = this;
            var nodes = box.getDatas();
            nodes.forEach(function (e) {
                if (deviceID instanceof Array) {
                    for (var i = 0; i < deviceID.length; i++) {
                        if (e.getClient("deviceid") != undefined
                            && e.getClient("deviceid") == deviceID[i]
                            && data && data[deviceID[i]]) {
                            self.setDevStatusValue(e, data[deviceID[i]]);
                            self.setSignalsValue(e, data[deviceID[i]]);
                        }
                    }
                } else {
                    if (data && data[deviceID]) {
                        self.setDevStatusValue(e, data[deviceID], deviceName);
                        self.setSignalsValue(e, data[deviceID]);
                    }
                }
            });
        },
        /**
         * TOPO图上组串数据更新渲染
         * @param box
         * @param data
         * @param colors
         * @param pvAlarms
         */
        updateZCData: function (box, data, colors, pvAlarms) {
            var self = this;
            var nodes = box.getDatas();
            nodes.forEach(function (e) {
                var deviceID = e.getClient("deviceid");
                if (data && data[deviceID]) {
                    var nodeType = e.getClient("nodetypeid");
                    if (
                        nodeType == 6 // 组串 2*3
                        || nodeType == 8 // 组串 2*2
                        || nodeType == 46 // 组串 2*8
                        || nodeType == 67 // 组串2*4
                    ) {
                        var rows = e.getStyle("grid.row.count");//获取行数
                        var columns = e.getStyle("grid.column.count");//获取列数
                        self.setZCValue(box, e, data[deviceID], colors[deviceID], pvAlarms[deviceID], rows, columns, nodeType == 46);
                    }
                }
            });
        },

        /**
         * TOPO图上主备机状态数据渲染
         * @param box
         * @param data
         */
        updateMainBackData: function (box, data) {
            var dataNodes = box.getDatas();
            dataNodes.forEach(function (e) {
                var nodeType = e.getClient("nodetypeid");
                if (122 == nodeType || 123 == nodeType) {
                    var mainInfo = data.mainInfo;
                    var backInfo = data.backInfo;
                    var blank = "               ", offset = 0;
                    // 主机
                    if (122 == e.getClient("nodetypeid")) {
                        var mainIP = mainInfo.ip;
                        var mainStatus = mainInfo.status;
                        var nameSetMain = Msg.topocfg.machineInfo.mainState;
                        var mainState = '';
                        if (mainStatus && mainStatus == "WORKING") {
                            offset = (11 - mainIP.length) * 4 + Number(Msg.topocfg.machineInfo.offset);
                            mainState = Msg.topocfg.machineInfo.normal;
                            image = "zbwork";
                        } else if (mainStatus && mainStatus == "WRONG") {
                            offset = (11 - mainIP.length) * 4 + Number(Msg.topocfg.machineInfo.eroffset);
                            mainState = Msg.topocfg.machineInfo.error;
                            image = "zbwrong";
                        }
                        e.setImage(image);
                        e.setName(nameSetMain + mainIP + blank + mainState);
                    }
                    // 备机
                    else if (123 == e.getClient("nodetypeid")) {
                        var nameSetBack = Msg.topocfg.machineInfo.backState;
                        var backIP = backInfo.ip;
                        var backStatus = backInfo.status;
                        var backState = '', image;
                        if (backStatus && backStatus == "WORKING") {
                            offset = (11 - backIP.length) * 4 + Number(Msg.topocfg.machineInfo.offset);
                            backState = Msg.topocfg.machineInfo.normal;
                            image = "zbwork";
                        } else if (backStatus && backStatus == "WRONG") {
                            offset = (11 - backIP.length) * 4 + Number(Msg.topocfg.machineInfo.eroffset);
                            backState = Msg.topocfg.machineInfo.error;
                            image = "zbwrong";
                        }
                        e.setImage(image);
                        e.setName(nameSetBack + backIP + blank + backState);
                    }
                    e.setStyle('label.xoffset', offset);
                    e.setStyle('label.yoffset', 0);
                    e.setStyle('label.color', "#ff0000");
                    e.setStyle('label.position', "center");
                    e.setStyle('label.font', Msg.topocfg.font14);
                }
            });
        },

        /**
         * 信号点数据更新渲染
         * @param e 图元
         * @param data 数据
         */
        setSignalsValue: function (e, data) {
            var self = this;
            var nodeType = e.getClient("nodetypeid");
            switch (+nodeType) {
                case 7: // 文本
                    self.setTextValue(e, data);
                    break;
                case 9: // 断路器
                    self.setDLQValue(e, data);
                    break;
                case 14: // 光字牌
                    self.setGZPValue(e, data);
                    break;
                case 31: // 刀闸
                    self.setDZValue(e, data);
                    break;
                case 64: // 手车
                    self.setSCValue(e, data);
                    break;
                case 65: // 远控/就地
                    self.setYKValue(e, data);
                    break;
                case 28: //
                    break;
                case 68: // 电站状态
                    self.setButtonValue(e, data);
                    break;
                case 40:// 逆变器开关
                    self.setNBQValue(e, data);
                    break;
                case 81://集控新增电站状态跳转
                    self.setSKpiValue(e, data);
                    break;
                case 97: // 单手车
                    self.setSingleSCValue(e, data);
                    break;
                case 113: // 隔离手车
                    self.setSecondSCValue(e, data);
                    break;
                case 116: // 软压板
                    self.setRYBValue(e, data);
                    break;
                case 117: // 硬压板
                    self.setYYBValue(e, data);
                    break;
                case 119: // 远控/就地2
                    self.setYKNewValues(e, data);
                    break;
                case 120: // 远控/就地3
                    self.setRCValues(e, data);
                    break;    
                default:
            }
        },

        /**
         * 天气图源
         */
        setWeatherIcon: function (box, data) {
            var iconName = 'weatherIcons_';
            var nodes = box.getDatas();
            if (data) {
                nodes.forEach(function (e) {
                    if (e instanceof topo.WEATHER) {
                        var sid = e.getClient("stationNumber");
                        if (data[sid]) {
                            e.setImage(iconName + data[sid]);
                        }
                    }
                });
            }
        },

        /**
         * 拆分箱变图元为3个图元
         */
        setDepartIcon: function (box) {
            var nodes = box.getDatas();
            nodes.forEach(function (e) {
                if (e instanceof topo.YXB1 || e instanceof topo.YXB2 || e instanceof topo.YXB3) {
                    var picvalue = e.getImage();
                    if (picvalue) {
                        e.setImage(picvalue)
                    }
                }
            });
        },

        /**
         * 逆变器开关数据渲染
         */
        setNBQValue: function (e, data) {
            if (data) {
                var signalId = e.getClient("signalid");
                if (signalId != null && signalId != undefined && signalId != ""
                    && data[signalId]) {
                    var signalValue = data[signalId][0];
                    if (signalValue != null && signalValue != undefined && signalValue != "") {
                        switch (+signalValue) {
                            case 768:
                            case 769:
                                e.setImage("nibianqikaiguanr");
                                break;
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                            case 256:
                            case 512:
                            case 513:
                            case 1025:
                            case 1026:
                            case 40960:
                                e.setImage("nibianqi_kai");
                                break;
                            default:
                                e.setImage("NBQkgerror");
                        }
                    } else {
                        e.setImage("NBQkgerror");
                    }
                }
            }
        },

        /**
         * 组串数据渲染
         * @param box
         * @param e
         * @param data
         * @param colors
         * @param alarm
         * @param rows
         * @param columns
         * @param isJZ 是否是集中式组串
         */
        setZCValue: function (box, e, data, colors, alarm, rows, columns, isJZ) {
            var num = 0;
            var signalids = e.getClient("signalid");
            if (signalids) {
                var signalidsArry = signalids.split(",");
                for (var i = 0; i < rows; i++) {
                    for (var j = 0; j < columns; j++) {
                        var childCell = e.getChildAt(isJZ ? rows * j + i : num);
                        var cell;
                        if (childCell) {
                            cell = childCell;
                        } else {
                            cell = new twaver.Grid();
                            cell.setLayerId(e.getLayerId());
                            cell.setStyle("follower.column.index", j);
                            cell.setStyle("follower.row.index", i);
                            cell.setHost(e);
                            e.addChild(cell);
                            box.add(cell);
                        }
                        if (signalidsArry[num] < 0) {
                            cell.setImage("zuchuanhei");
                            num = num + 1;
                            continue;
                        }
                        if (signalidsArry.length < rows * columns && num + 1 > signalidsArry.length) {
                            cell.setImage("zuchuanhei");
                            num = num + 1;
                            continue;
                        }
                        var cellname = columns * i + (j + 1);
                        cell.setToolTip("Pv" + cellname);
                        var value = data[signalidsArry[num]];
                        var hasAlarm = false;
                        if (alarm) {
                            for (var m = 0; m < alarm.length; m++) {
                                if (alarm[m] == cellname) {
                                    cell.setImage("zuchuanhong");
                                    hasAlarm = true;
                                    break;
                                }
                            }
                        }
                        if (!hasAlarm && (value != null && value >= 0)) {
                            // < 0.01 灰色
                            if (value < 0.0001) {
                                cell.setImage("zuchuanhui");
                                // < 70% 平均 红色
                            } else {
                                // 其他 蓝色
                                cell.setImage("zuchuanlan");
                            }
                        }
                        if ((!hasAlarm && !value) || value < 0) {
                            // kong  灰色
                            cell.setImage("zuchuanhui");
                        }
                        num = num + 1;
                    }
                }
            }
        },

        /**
         * 文本节点信号值（渲染TEXT信号点的值）
         */
        setTextValue: function (e, data) {
            var self = this;
            var signalId = e.getClient("signalid");
            var signalType = e.getClient("signaltype");
            if (signalId && signalType && data && data[signalId]) {
                if (data[signalId][0] || data[signalId][0] == 0) {
                    if ('number' == typeof (+data[signalId][0])) {
                        if ((-1 == (data[signalId][0] + '').indexOf('.'))) {
                            if (signalType == 7) { // 时间类型
                                e.setName(self.parseDate(data[signalId][0] * 1000));
                            } else {
                                e.setName(data[signalId][0] + " " + e.getClient("signalunit"));
                            }
                        } else {
                            if (e.getClient("signalunit").toUpperCase().trim() == 'KWH'
                                || e.getClient("signalunit").toUpperCase().trim() == 'KW.H'
                                || e.getClient("signalunit").toUpperCase().trim() == 'KW·H') {

                                if (mac.Lang != 'zh') {
                                    e.setName(parseFloat(data[signalId][0]).fixed(3) + " " + e.getClient("signalunit"))
                                }
                                else {
                                    if (data[signalId][0] >= 10000) {
                                        e.setName(parseFloat(data[signalId][0] / 10000).fixed(3) + " " + Msg.unit.powerUnit)
                                    }
                                    else {
                                        e.setName(parseFloat(data[signalId][0]).fixed(3) + " " + Msg.unit.topPowerUnit);
                                    }
                                }

                            }
                            else {
                                e.setName(parseFloat(data[signalId][0]).fixed(3) + " " + e.getClient("signalunit"));
                            }
                        }
                    } else {
                        e.setName(data[signalId][0] + " " + e.getClient("signalunit"));
                    }
                } else {
                    e.setName("#" + " " + e.getClient("signalunit"));
                }
                e.setStyle("label.color", data[signalId][2] || data[signalId][1] || e.getStyle('label.color') || '#FFFFFF');
            }
        },
        /**
         * 断路器渲染
         */
        setDLQValue: function (e, data) {
            var imageName = e.getImage();
            var flag = (imageName.indexOf("duanluqizjx") == -1); // true:箱变断路器，false:主接线断路器
            if (data) {
                var signalId = e.getClient("signalid");
                if (signalId != null && signalId != undefined && signalId != ""
                    && data[signalId]) {
                    var signalValue = data[signalId][0];
                    if (signalValue == undefined || signalValue == null) {
                        return;
                    }
                    switch (+signalValue) {
                        case 0:
                            if (flag) {
                                e.setImage("duanluqirreal");
                            } else {
                                e.setImage("duanluqizjxr");
                            }
                            break;
                        case 1:
                            if (flag) {
                                e.setImage("duanluqifull");
                            } else {
                                e.setImage("duanluqizjxfull");
                            }
                            break;
                        default:
                            if (flag) {
                                e.setImage("duanluqierror");
                            } else {
                                e.setImage("duanluqizjxerror");
                            }
                    }
                }
            }
        },
        /**
         * 光字牌渲染
         */
        setGZPValue: function (e, data) {
            var signalId = e.getClient("signalid");
            if (signalId != null && signalId != undefined && signalId != "" && data && data[signalId]) {
                var signalValue = data[signalId][0];
                if (signalValue || signalValue == 0) {
                    if (signalValue == 1) {
                        e.setStyle('vector.fill.color', "#FF0000");
                    } else if (signalValue == 0) {
                        e.setStyle('vector.fill.color', "#00FF00");
                    } else {
                        e.setStyle('vector.fill.color', "#808080");
                    }
                } else {
                    e.setStyle('vector.fill.color', "#808080");
                }
            }
        },
        /**
         * 刀闸渲染
         */
        setDZValue: function (e, data) {
            var signalId = e.getClient("signalid");
            if (signalId != null && signalId != undefined && signalId != "" && data && data[signalId]) {
                var signalValue = data[signalId][0];
                if (signalValue || signalValue == 0) {
                    if (0 == signalValue) {
                        e.setImage("jiedikaiguanzuor");
                    } else if (1 == signalValue) {
                        e.setImage("jiedikaiguanzuohe");
                    } else {
                        e.setImage("jiedikaiguanzuoerror");
                    }
                } else {
                    e.setImage("jiedikaiguanzuoerror");
                }
            }
        },
        /**
         * 手车渲染
         */
        setSCValue: function (e, data) {
            var signalId = e.getClient("signalid");
            if (signalId != null && signalId != undefined && signalId != "" && data && data[signalId]) {
                var signalValue = data[signalId][0];
                if (signalValue || signalValue == 0) {
                    if (0 == signalValue) {
                        e.setImage("shoucher");
                    }
                    else if (1 == signalValue) {
                        e.setImage("shoucheyc");
                    }
                    else {
                        e.setImage("shouchemr");
                    }
                }
                else {
                    e.setImage("shouchemr");
                }
            }
        },
        /**
         * 单手车渲染
         */
        setSingleSCValue: function (e, data) {
            var signalId = e.getClient("signalid");
            if (signalId != null && signalId != undefined && signalId != "" && data && data[signalId]) {
                var signalValue = data[signalId][0];
                if (signalValue || signalValue == 0) {
                    if (0 == signalValue) {
                        e.setImage("sigle_Hand-car_break-off_32");
                    }
                    else if (1 == signalValue) {
                        e.setImage("sigle_Hand-car_Close_32");
                    }
                    else {
                        e.setImage("sh_sigle_Hand-car_break-off");
                    }
                }
                else {
                    e.setImage("sh_sigle_Hand-car_break-off");
                }
            }
        },

        /**
         * 隔离手车渲染
         */
        setSecondSCValue: function (e, data) {
            var signalId = e.getClient("signalid");
            if (signalId != null && signalId != undefined && signalId != "" && data && data[signalId]) {
                var signalValue = data[signalId][0];
                if (signalValue || signalValue == 0) {
                    if (0 == signalValue) {
                        e.setImage("Hand-car_break-off_32");
                    }
                    else if (1 == signalValue) {
                        e.setImage("Hand-car_Close_32");
                    }
                    else {
                        e.setImage("SH_Hand-car_Close");
                    }
                } else {
                    e.setImage("SH_Hand-car_Close");
                }
            }
        },

        /**
         * 远控/就地渲染，这是旧远控就地图元
         */
        setYKValue: function (e, data) {
            var signalId = e.getClient("signalid");
            if (signalId != null && signalId != undefined && signalId != "" && data && data[signalId]) {
                var signalValue = data[signalId][0];
                if (signalValue || signalValue == 0) {
                    if (0 == signalValue) {
                        e.setImage("yuankongr");
                        //e.setImage("jiudiNew");
                    } else if (1 == signalValue) {
                        e.setImage("yuankongyc");
                        //e.setImage("yuanfangNew");
                    } else {
                        e.setImage("yuankongmr");
                        //e.setImage("yuanfangNewError");
                    }
                } else {
                    e.setImage("yuankongmr");
                    //e.setImage("yuanfangNewError");
                }
            }
        },

        setSKpiValue: function (e, data) {
            var signalId = e.getClient("signalid");
            if (signalId != null && signalId != undefined && signalId != "" && data && data[signalId]) {
                var signalValue = data[signalId][0];
                if (signalValue || signalValue == 0) {
                    if (signalValue == 1) {
                        e.setImage("skip_red");
                    } else if (signalValue == 0) {
                        e.setImage("skip_green");
                    } else {
                        e.setImage("skip_grey");
                    }
                } else {
                    e.setImage("skip_grey");
                }
            }
        },
        /**
         * 电站状态图元渲染
         */
        setButtonValue: function (e, data) {
            var signalId = e.getClient("signalid");
            if (signalId != null && signalId != undefined && signalId != "" && data && data[signalId]) {
                var signalValue = data[signalId][0];
                if (signalValue || signalValue == 0) {
                    if (signalValue == 1) {
                        e.setStyle('vector.fill.color', "#FF0000");
                        e.setStyle('vector.outline.color', "#FF0000");
                    } else if (signalValue == 0) {
                        e.setStyle('vector.outline.color', "rgb(0, 184, 18)");
                        e.setStyle('vector.fill.color', "rgb(44, 44, 68)");
                    } else {
                        e.setStyle('vector.fill.color', "rgb(128, 128, 128)");
                        e.setStyle('vector.outline.color', "rgb(128, 128, 128)");
                    }
                } else {
                    e.setStyle('vector.fill.color', "rgb(128, 128, 128)");
                    e.setStyle('vector.outline.color', "rgb(128, 128, 128)");
                }
            }
        },

        /**
         * 设备状态数据渲染
         * @param e
         * @param data
         */
        setDevStatusValue: function (e, data, deviceName) {
            var nodetypeid = e.getClient("nodetypeid");
            var state = data;
            if (nodetypeid == 5) { // 组串式逆变器
                if (state == "CONNECTED") {
                    if (e instanceof topo.NiBianQi3D) {
                        e.setImage("nibianqi3dgreen");
                    } else {
                        e.setImage("nibianqiycg");
                    }
                } else if (state == "DISCONNECTED") {
                    if (e instanceof topo.NiBianQi3D) {
                        e.setImage("nibianqi3dred");
                    } else {
                        e.setImage("nibianqiycr");
                    }
                } else {
                }
                deviceName && e.setName(deviceName || '');
            }
            if (nodetypeid == 18) { // 数采
                if (state == "CONNECTED") {
                    e.setImage("shujucaijiqig");
                } else if (state == "DISCONNECTED") {
                    e.setImage("shujucaijiqired");
                }
            }
            if (nodetypeid == 41) { // 集中式逆变器3D
                if (state == "CONNECTED") {
                    e.setImage("jzNBQ3Dgreen");
                } else if (state == "DISCONNECTED") {
                    e.setImage("jzNBQ3Dred");
                }
                deviceName && e.setName(deviceName || '');
            }
            if (nodetypeid == 42) { // 集中式逆变器
                if (state == "CONNECTED") {
                    e.setImage("jzNBQ-rightgreen");
                } else if (state == "DISCONNECTED") {
                    e.setImage("jzNBQ-rightred");
                }
                deviceName && e.setName(deviceName || '');
            }
            if (nodetypeid == 44) { // 直流汇流箱
                if (state == "CONNECTED") {
                    e.setImage("newzlHLXrgreen");
                } else if (state == "DISCONNECTED") {
                    e.setImage("newzlHLXred");
                }
            }
            /*
             * if(nodetypeid == 45){//直流汇流箱3D if (state == "CONNECTED") {
             * e.setImage("3d-zlHLXrgreen"); } else if (state == "DISCONNECTED") {
             * e.setImage("3d-zlHLXrred"); } }
             */
            if (nodetypeid == 54) { // 通管机
                if (state == "CONNECTED") {
                    e.setImage("tgjr");
                } else if (state == "DISCONNECTED") {
                    e.setImage("tgjerror");
                }
            }
            if (nodetypeid == 56) { // pid
                if (state == "CONNECTED") {
                    e.setImage("pidTopoImgY");
                } else if (state == "DISCONNECTED") {
                    e.setImage("pidTopoImgN");
                }
            }
        },

        /**
         * 软压板渲染
         */
        setRYBValue: function (e, data) {
            var signalId = e.getClient("signalid");
            if (signalId != null && signalId != undefined && signalId != "" && data[signalId][0] != null && data[signalId][0] != undefined) {
                var signalValue = data[signalId][0];
                if (0 == signalValue || 45056 == signalValue) {
                    e.setImage("ruanyafen");
                }
                else if (1 == signalValue || 45057 == signalValue) {
                    e.setImage("ruanyahe");
                }
                else {
                    e.setImage("ruanyaerror");
                }
            }
            else if (data[signalId] != null && data[signalId][0] == null) {
                e.setImage("ruanyaerror");
            }
        },

        /**
         * 硬压板渲染
         */
        setYYBValue: function (e, data) {
            var signalId = e.getClient("signalid");
            if (signalId != null && signalId != undefined && signalId != "" && data[signalId][0] != null && data[signalId][0] != undefined) {
                var signalValue = data[signalId][0];
                if (0 == signalValue) {
                    e.setImage("yingyafen");
                }
                else if (1 == signalValue) {
                    e.setImage("yingyahe");
                } else {
                    e.setImage("yingyaerror");
                }
            }
            else if (data[signalId] != null && data[signalId][0] == null) {
                e.setImage("yingyaerror");
            }
        },

        /**
         * 远控/就地2渲染
         */
        setYKNewValues:function (e, data) {
        	var signalId = e.getClient("signalid");
            if (signalId != null && signalId != undefined && signalId != "" && data && data[signalId]) {
                var signalValue = data[signalId][0];
                if (signalValue || signalValue == 0) {
                    if (0 == signalValue) {
                        e.setImage("jiudiNew");
                    } else if (1 == signalValue) {
                        e.setImage("yuanfangNew");
                    } else {
                        e.setImage("yuanfangNewError");
                    }
                } else {
                    e.setImage("yuanfangNewError");
                }
            }
        },
        
        /**
         * 远控/就地3渲染
         */
        setRCValues:function (e, data) {
        	var signalId = e.getClient("signalid");
            if (signalId != null && signalId != undefined && signalId != "" && data && data[signalId]) {
                var signalValue = data[signalId][0];
                if (signalValue || signalValue == 0) {
                    if (0 == signalValue) {
                        e.setImage("localNew");
                    } else if (1 == signalValue) {
                        e.setImage("remoteNew");
                    } else {
                        e.setImage("localNew");
                    }
                } else {
                    e.setImage("localNew");
                }
            }
        },
        /**
         * 时间转换
         */
        parseDate: function (millisecond) {
            if (millisecond == null || millisecond == undefined) {
                return "#";
            }
            var devoteDate = new Date(parseInt(millisecond));
            var month = devoteDate.getMonth() + 1;
            if (month < 10) {
                month = '0' + month;
            }
            var day = devoteDate.getDate();
            if (day < 10) {
                day = '0' + day;
            }
            var hours = devoteDate.getHours();
            if (hours < 10) {
                hours = '0' + hours;
            }
            var minutes = devoteDate.getMinutes();
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            var seconds = devoteDate.getSeconds();
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            return devoteDate.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        }
    };

})();