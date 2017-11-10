/**
 * 初始化电站状态（灰色）
 */
function initStationStatus(){
    var dataNodes = box.getDatas();
    dataNodes.forEach(function(e){
        if(68 == e.getClient("nodetypeid")){
            e.setStyle('vector.fill.color', "rgb(128, 128, 128)");
            e.setStyle('vector.outline.color', "rgb(128, 128, 128)");
        }
    });
};

/**
 * 初始化光字牌（灰色）
 */
function initGuangZiPai(){
    var dataNodes = box.getDatas();
    dataNodes.forEach(function(e){
        if(14 == e.getClient("nodetypeid")){
            e.setStyle('vector.fill.color', "#808080");
        }
    });
};

/**
 * 初始化断路器为异常态(箱变，断路器，异常态)
 */
function initDuanLuQiDefault(){
    var dataNodes = self.box.getDatas();
    dataNodes.forEach(function(e){
        if(9 == e.getClient("nodetypeid")){
            var imagename = e.getImage();
            if("duanluqizjxr" == imagename){
                e.setImage("duanluqizjxerror");
            }
            if("duanluqir" == imagename){
                e.setImage("duanluqierror");
            }
        }
    });
};

/**
 * 初始化刀闸（异常态）
 */
function initDaoZha(){
    var dataNodes = box.getDatas();
    dataNodes.forEach(function(e){
        if(31 == e.getClient("nodetypeid")){
            e.setImage("jiedikaiguanzuoerror");
        }
    });
};

/**
 * 初始化手车
 */
function initShouChe(){
    var dataNodes = box.getDatas();
    dataNodes.forEach(function(e){
        if(64 == e.getClient("nodetypeid")){
            e.setImage("shouchemr");
        }
    });
};

/**
 * 初始化远控/就地
 */
function initYuanKong(){
    var dataNodes = box.getDatas();
    dataNodes.forEach(function(e){
        if(65 == e.getClient("nodetypeid")){
            e.setImage("yuankongmr");
        }
    });
};

/**
 * 获取信号点
 */
function getSignalsParams(){
    var dataNodes = box.getDatas();
    paramsObj.box = box;
    dataNodes.forEach(function (e) {
        var nodetypeid = e.getClient("nodetypeid");
        if((7 == nodetypeid) || (14 == nodetypeid) || (9 == nodetypeid) || (31 == nodetypeid) || (64 == nodetypeid)|| (65 == nodetypeid) ||  (28 == nodetypeid)  ||  (68 == nodetypeid)){
            var deviceidtemp = e.getClient("deviceid");
            if(deviceidtemp){
                var dev = {};
                var signalIDs = [];
                var signalidtemp = e.getClient("signalid");
                if(signalidtemp){
                    dev.devID = deviceidtemp;
                    signalIDs.push(signalidtemp);
                    dev.signalIDs = signalIDs;
                    var mapLength = paramsObj.devSignalMap.length;
                    if(mapLength>0){
                        var devIDFlag = true;
                        for(var i = 0; i < mapLength;i++){
                            var mapDevID = paramsObj.devSignalMap[i].devID;
                            if(mapDevID == dev.devID){
                                paramsObj.devSignalMap[i].signalIDs.push(signalidtemp);
                                devIDFlag = false;
                                return;
                            }
                        }
                        if(devIDFlag){
                            paramsObj.devSignalMap.push(dev);
                        }
                    }else{
                        paramsObj.devSignalMap.push(dev);
                    }
                }
            }
        }
    });
};

/**
 * 电站状态图元渲染
 */

function getButtonValues(dataNodes,datas){
    dataNodes.forEach(function (e) {
        var deviceidtemp = e.getClient("deviceid");
        if(deviceidtemp){
            var nodetypeid = e.getClient("nodetypeid");
            if (68 == nodetypeid) {
                var gzpsignaldata = datas[deviceidtemp];
                if(gzpsignaldata){
                    var signalidtemp = e.getClient("signalid");
                    if(signalidtemp != null && signalidtemp != undefined  && signalidtemp != ""){
                        var signalvalue = gzpsignaldata[signalidtemp]
                        if (signalvalue == 1) {
                            e.setStyle('vector.fill.color', "#FF0000");
                            e.setStyle('vector.outline.color', "#FF0000");
                        }
                        else if(signalvalue == 0){
                            e.setStyle('vector.outline.color', "rgb(0, 184, 18)");
                            e.setStyle('vector.fill.color', "rgb(44, 44, 68)");
                        }
                        else {
                            e.setStyle('vector.fill.color', "rgb(128, 128, 128)");
                            e.setStyle('vector.outline.color', "rgb(128, 128, 128)");
                        }
                    }
                    else{
                        e.setStyle('vector.fill.color', "rgb(128, 128, 128)");
                        e.setStyle('vector.outline.color', "rgb(128, 128, 128)");
                    }
                }
                else{
                    e.setStyle('vector.fill.color', "rgb(128, 128, 128)");
                    e.setStyle('vector.outline.color', "rgb(128, 128, 128)");
                }
            }
        }
    });
};
/**
 * 文本节点信号值（渲染TEXT信号点的值）
 */
function getTextValues(dataNodes,datas){
    dataNodes.forEach(function (e) {
        var deviceidtemp = e.getClient("deviceid");
        if(deviceidtemp){
            var nodetypeid = e.getClient("nodetypeid");
            if((7 == nodetypeid) && e.getClient("texttype")== undefined ) {
                var textsignaldata = datas[deviceidtemp];
//                var textsignalcolor = colors[deviceidtemp];
                if (textsignaldata) {
                    var signalidtemp = e.getClient("signalid");
//                    var colName = e.getClient("signalcolname");
                    var signtypetemp = e.getClient("signaltype");
                    if (textsignaldata[signalidtemp] !=null && textsignaldata[signalidtemp] !=undefined && textsignaldata[signalidtemp][0]!=null && textsignaldata[signalidtemp][0]!=undefined ) {
                        if('number' == typeof(textsignaldata[signalidtemp][0])){
                            if((-1 == (textsignaldata[signalidtemp][0]+'').indexOf('.'))){
                                if(signtypetemp == 7){                                                       //时间类型
                                    e.setName(parseDate(textsignaldata[signalidtemp][0]*1000));
                                }
                                else{
                                    e.setName(textsignaldata[signalidtemp][0]+" "+ e.getClient("signalunit"));
                                    if(!colorsMap.hasOwnProperty(e.getId()+signalidtemp)){
                                        colorsMap[e.getId()+signalidtemp] = e.getStyle("label.color");
                                    }
                                    if(textsignaldata[signalidtemp][1]){
                                        e.setStyle("label.color",textsignaldata[signalidtemp][1]);
                                    }else{
                                        e.setStyle("label.color",colorsMap[e.getId()+signalidtemp]);
                                    }
                                }
                            }
                            else{
                                e.setName(parseFloat(textsignaldata[signalidtemp][0]).toFixed(2) +" "+ e.getClient("signalunit"));
                                if(!colorsMap.hasOwnProperty(e.getId()+signalidtemp)){
                                    colorsMap[e.getId()+signalidtemp] = e.getStyle("label.color");
                                }
                                if(textsignaldata[signalidtemp][1]){
                                    e.setStyle("label.color",textsignaldata[signalidtemp][1]);
                                }else{
                                    e.setStyle("label.color",colorsMap[e.getId()+signalidtemp]);
                                }
                            }
                        }
                        else{
                            e.setName(textsignaldata[signalidtemp][0] +" "+ e.getClient("signalunit"));
                            if(!colorsMap.hasOwnProperty(e.getId()+signalidtemp)){
                                colorsMap[e.getId()+signalidtemp] = e.getStyle("label.color");
                            }
                            if(textsignaldata[signalidtemp][1]){
                                e.setStyle("label.color",textsignaldata[signalidtemp][1]);
                            }else{
                                e.setStyle("label.color",colorsMap[e.getId()+signalidtemp]);
                            }
                        }
                    }
                    else if(textsignaldata[signalidtemp] !=null && textsignaldata[signalidtemp][0]==null){
                        e.setName("#"+" "+ e.getClient("signalunit"));
                    }
                }
            }
        }
    });
}

/**
 * 光字牌渲染
 */
function getGZPValues(dataNodes,datas){
    dataNodes.forEach(function (e) {
        var deviceidtemp = e.getClient("deviceid");
        if(deviceidtemp){
            var nodetypeid = e.getClient("nodetypeid");
            if (14 == nodetypeid) {
                var gzpsignaldata = datas[deviceidtemp];
                if(gzpsignaldata){
                    var signalidtemp = e.getClient("signalid");
                    if(signalidtemp != null && signalidtemp != undefined  && signalidtemp != ""){
                        var signalvalue = gzpsignaldata[signalidtemp][0]
                        if (signalvalue == 1) {
                            e.setStyle('vector.fill.color', "#FF0000");
                        }
                        else if(signalvalue == 0){
                            e.setStyle('vector.fill.color', "#00FF00");
                        }
                        else {
                            e.setStyle('vector.fill.color', "#808080");
                        }
                    }
                    else{
                        e.setStyle('vector.fill.color', "#808080");
                    }
                }
                else{
                    e.setStyle('vector.fill.color', "#808080");
                }
            }
        }
    });
};

/**
 * 断路器渲染
 */
function getDLQValues(dataNodes,datas){
    dataNodes.forEach(function (e) {
        var deviceidtemp = e.getClient("deviceid");
        if(deviceidtemp){
            var nodetypeid = e.getClient("nodetypeid");
            if(nodetypeid == 9) {
                var imagenametemp = e.getImage();
                var flag = (imagenametemp.indexOf("duanluqizjx") == -1);         //true:箱变断路器，false:主接线断路器
                var gzpsignaldata = datas[deviceidtemp];
                if(gzpsignaldata ){
                    var signalidtemp = e.getClient("signalid");
                    if(signalidtemp != null && signalidtemp != undefined  && signalidtemp != ""){
                        var signalvalue = gzpsignaldata[signalidtemp][0];
                        if (signalvalue == 0) {
                            if(flag){
                                e.setImage("duanluqirreal");
                            }
                            else{
                                e.setImage("duanluqizjxr");
                            }
                        }
                        else if(signalvalue == 1){
                            if(flag){
                                e.setImage("duanluqifull");
                            }
                            else{
                                e.setImage("duanluqizjxfull");
                            }
                        }
                        else{
                            if(flag){
                                e.setImage("duanluqierror");
                            }
                            else{
                                e.setImage("duanluqizjxerror");
                            }
                        }
                    }
                    else{
                        if(flag){
                            e.setImage("duanluqierror");
                        }
                        else{
                            e.setImage("duanluqizjxerror");
                        }
                    }
                }
                else{
                    if(flag){
                        e.setImage("duanluqierror");
                    }
                    else{
                        e.setImage("duanluqizjxerror");
                    }
                }
            }
        }
    });
};

/**
 * 刀闸渲染
 */
function getDZValues(dataNodes,datas){
    dataNodes.forEach(function (e) {
        var deviceidtemp = e.getClient("deviceid");
        if(deviceidtemp){
            var nodetypeid = e.getClient("nodetypeid");
            if(31 == nodetypeid) {
                var gzpsignaldata = datas[deviceidtemp];
                if(gzpsignaldata ){
                    var signalidtemp = e.getClient("signalid");
                    if(signalidtemp != null && signalidtemp != undefined  && signalidtemp != ""){
                        var signalvalue = gzpsignaldata[signalidtemp][0];
                        if(0 == signalvalue) {
                            e.setImage("jiedikaiguanzuor");
                        }
                        else if(1 == signalvalue){
                            e.setImage("jiedikaiguanzuohe");
                        }
                        else{
                            e.setImage("jiedikaiguanzuoerror");
                        }
                    }
                    else{
                        e.setImage("jiedikaiguanzuoerror");
                    }
                }
                else{
                    e.setImage("jiedikaiguanzuoerror");
                }
            }
        }
    });
};

/**
 * 手车渲染
 */
function getSCValues(dataNodes,datas){
    dataNodes.forEach(function (e) {
        var deviceidtemp = e.getClient("deviceid");
        if(deviceidtemp){
            var nodetypeid = e.getClient("nodetypeid");
            if(64 == nodetypeid) {
                var gzpsignaldata = datas[deviceidtemp];
                if(gzpsignaldata ){
                    var signalidtemp = e.getClient("signalid");
                    if(signalidtemp != null && signalidtemp != undefined  && signalidtemp != ""){
                        var signalvalue = gzpsignaldata[signalidtemp][0];
                        if(0 == signalvalue) {
                            e.setImage("shoucher");
                        }
                        else if(1 == signalvalue){
                            e.setImage("shoucheyc");
                        }
                        else{
                            e.setImage("shouchemr");
                        }
                    }
                    else{
                        e.setImage("shouchemr");
                    }
                }
                else{
                    e.setImage("shouchemr");
                }
            }
        }
    });
}

/**
 * 远控/就地渲染
 */
function getYKValues(dataNodes,datas){
    dataNodes.forEach(function (e) {
        var deviceidtemp = e.getClient("deviceid");
        if(deviceidtemp){
            var nodetypeid = e.getClient("nodetypeid");
            if(65 == nodetypeid) {
                var gzpsignaldata = datas[deviceidtemp];
                if(gzpsignaldata ){
                    var signalidtemp = e.getClient("signalid");
                    if(signalidtemp != null && signalidtemp != undefined  && signalidtemp != ""){
                        var signalvalue = gzpsignaldata[signalidtemp][0];
                        if(0 == signalvalue) {
                            e.setImage("yuankongr");
                        }
                        else if(1 == signalvalue){
                            e.setImage("yuankongyc");
                        }
                        else{
                            e.setImage("yuankongmr");
                        }
                    }
                    else{
                        e.setImage("yuankongmr");
                    }
                }
                else{
                    e.setImage("yuankongmr");
                }
            }
        }
    });
}
