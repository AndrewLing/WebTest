/**
 * Created by lWX242305 on 2015/12/22.
 */
var $G, $O, $M, $L, $I;
(function () {
    O = function (id) {
        return "string" == typeof id ? document.getElementById(id) : id;
    };
    MP = {
        y: 39.9,
        x: 116.4,
        point: function (y, x) {
            return new google.maps.LatLng(y, x);
        },
        getCanvas: function (id) {
            var mapid = id ? id : 'map_canvas';
            return document.getElementById(mapid);
        },
        options: function (center, z) {
            return {
                zoom: z ? z : 14,
                center: center ? center : this.getCenter(),
                navigationControl: true,
                scaleControl: true,
                streetViewControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
        }
    };

    M = {
        mark: function (map, latLng, title) {
            if (title)
                return new google.maps.Marker({
                    icon: this.icon,
                    position: latLng,
                    map: map,
                    title: title
                });
            else
                return new google.maps.Marker({
                    //icon: this.icon,
                    position: latLng,
                    map: map
                });
        }
    };

    I = {
        infos: [],
        add: function (info, latLng, w, h) {
            if (w && h)
                return new google.maps.InfoWindow({
                    content: info,
                    size: new google.maps.Size(w, h),
                    position: latLng
                });
            else if (latLng)
                return new google.maps.InfoWindow({
                    content: info,
                    position: latLng
                });
            else
                return new google.maps.InfoWindow({
                    content: info
                });
        }
    };

//event 事件
    L = {
        listen: null,
        add: function (dom, event, fn) {
            return google.maps.event.addDomListener(dom, event, fn);
        }
    };

    $G = MP;
    $O = O;
    $M = M;
    $L = L;
    $I = I;
})();
/*

//初始化坐标
$G.y=39.9126328872148;
$G.x=116.44053633792112;

var inf = "どこ?";
var point = $G.point($G.y,$G.x);
var info = $I.add(inf,point);
var map;
function initialize(){
    map = new google.maps.Map($G.getCanvas("map_canvas"), $G.options(point,15));    //初始化地图
    var mark = $M.mark(map,point,"ここにいるよう");
    info.open(map);
    $L.listen = $L.add(mark,"click",function(){info.open(map)});    //给标记点添加一个点击事件
}

*/