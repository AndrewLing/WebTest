var sysBbh = '38.0.2125.0';
var brower={};
var agent = navigator.userAgent.toLowerCase();
brower.getName = function(){
    var name="";
    if(agent.indexOf("msie")>0){
        name = "ie";
    }else if(agent.indexOf("chrome")>0){
        name =  "chrome";
    }else if(agent.indexOf("firefox")>0){
        name =  "firefox";
    }else if(agent.indexOf("safari")>0 && agent.indexOf("chrome")<=0){
        name =  "safari";
    }
    return name;
};
brower.getBbh = function(){
    var bbh="";
    var ie = /msie[\d.]+/gi;
    var ff = /firefox[\d.]+/gi;
    var chrome = /chrome\/[\d.]+/gi;
    var saf = /safari\[\d.]+/gi;
    if(agent.indexOf("msie")>0){
        var nameandBbh = agent.match(ie);
        bbh = (nameandBbh+"").replace(/[^0-9.]/ig,"");
    }else if(agent.indexOf("chrome")>0){
        var nameandBbh = agent.match(chrome);
        bbh = (nameandBbh+"").replace(/[^0-9.]/ig,"");
    }else if(agent.indexOf("firefox")>0){
        var nameandBbh = agent.match(ff);
        bbh = (nameandBbh+"").replace(/[^0-9.]/ig,"");
    }else if(agent.indexOf("safari")>0 && agent.indexOf("chrome")<=0){
        var nameandBbh = agent.match(saf);
        bbh = (nameandBbh+"").replace(/[^0-9.]/ig,"");
    }
    return bbh;
};
brower.getSysBbh = function(){
    if(sysBbh!=null && sysBbh!=''){
        return sysBbh;
    }else{
        return '';
    }
};