window.google = window.google || {};
google.maps = google.maps || {};
(function () {
    var js = document.scripts;
    js = js[js.length - 1].src.substring(0, js[js.length - 1].src.lastIndexOf("/") + 1);
    if (window.MapTools && window.MapTools._path)
        js = MapTools._path() + 'gmapv3/';
    var $lang = 'en-US' || navigator.language || navigator.browserLanguage;
    //var $lang = navigator.language || navigator.browserLanguage;
    var $langList = {
        'zh-CN': {
            googleMap : {
                // controls.js
                controls: {
                    tilt: "\u663e\u793a 45 \u5ea6\u89c6\u56fe", // ��ʾ45����ͼ
                    tiltM: "\u653e\u5927\u4ee5\u663e\u793a 45 \u5ea6\u89c6\u89d2\u7684\u89c6\u56fe", // �Ŵ�����ʾ45���ӽǵ���ͼ
                    terrain: "\u7f29\u5c0f\u4ee5\u663e\u793a\u542b\u5730\u5f62\u7684\u8857\u9053\u5730\u56fe", // ��С����ʾ�����εĽֵ���ͼ
                    hybrid: "\u5730\u540d", // ����
                    close: "\u5173\u95ed", // �ر�
                    zoomIn: "\u653e\u5927", // �Ŵ�
                    zoomOut: "\u7f29\u5c0f", // ��С
                    clickZoom: "\u70b9\u51fb\u4ee5\u7f29\u653e", // ���������
                    dragZoom: "\u62d6\u52a8\u4ee5\u7f29\u653e", // �϶�������
                    clickShow: "\u70b9\u51fb\u4ee5\u5728 Google \u5730\u56fe\u4e0a\u67e5\u770b\u6b64\u533a\u57df", // �������Google��ͼ�ϲ鿴������
                    changeMapType: "\u66f4\u6539\u5730\u56fe\u6837\u5f0f", // ���ĵ�ͼ��ʽ
                    mtLeft: "\u5411\u5de6\u5e73\u79fb", // ����ƽ��
                    mtRight: "\u5411\u53f3\u5e73\u79fb", // ����ƽ��
                    mtUp: "\u5411\u4e0a\u5e73\u79fb", // ����ƽ��
                    mtDown: "\u5411\u4e0b\u5e73\u79fb", // ����ƽ��
                    rotate: "\u5c06\u5730\u56fe\u65cb\u8f6c\u5ea6", // ����ͼ��ת90��
                    unit: {
                        km: "\u5343\u7c73", // ǧ��
                        m: "\u7c73", // ��
                        miles: "\u82f1\u91cc", // Ӣ��
                        feet: "\u82f1\u5c3a" // Ӣ��
                    },
                    mapData: "\u5730\u56fe\u6570\u636e", // ��ͼ����
                    terms: "\u4f7f\u7528\u6761\u6b3e", // ʹ������
                    closeOverview: "\u5173\u95ed\u603b\u89c8\u56fe", // �ر�����ͼ
                    openOverview: "\u6253\u5f00\u603b\u89c8\u56fe" // ������ͼ
                },

                // map.js
                map: {
                    noImage: "\u62b1\u6b49\uff0c\u6b64\u5904\u65e0\u56fe\u50cf\u3002", // ��Ǹ���˴���ͼ��
                    satellite: "\u536b\u661f", // ����
                    satelliteImagery: "\u663e\u793a\u536b\u661f\u56fe\u50cf", // ��ʾ����ͼ��
                    hybrid: "\u6df7\u5408", // ���
                    streetImagery: "\u663e\u793a\u5e26\u6709\u8857\u9053\u540d\u79f0\u7684\u56fe\u50cf", // ��ʾ���нֵ����Ƶ�ͼ��
                    terrain: "\u5730\u5f62", // ����
                    terrainImagery: "\u663e\u793a\u5e26\u5730\u5f62\u7684\u8857\u9053\u5730\u56fe", // ��ʾ�����εĽֵ���ͼ
                    roadmap: "\u5730\u56fe", // ��ͼ
                    roadmapImagery: "\u663e\u793a\u8857\u9053\u5730\u56fe" // ��ʾ�ֵ���ͼ
                },

                // onion.js
                onion: {
                    author: "\u4f5c\u8005\uff1a", // ���ߣ�
                    be: "\u5728 ", // ��
                    view: "\u4e2d\u67e5\u770b" // �в鿴
                },

                // place_impl.js
                places: {
                    noSpecified: "\u672a\u6307\u5b9a\u201c", // δָ����
                    nature: "\u201d\u5c5e\u6027", // ������
                    findNear: "\u67e5\u627e\u60a8\u9644\u8fd1\u7684\u5730\u65b9", // �����������ĵط�
                    clickLocal: "\u70b9\u6309\u9009\u62e9\u4f4d\u7f6e", // �㰴ѡ��λ��
                    noLocal: "\u672a\u63d0\u4f9b\u4efb\u4f55\u4f4d\u7f6e", // δ�ṩ�κ�λ��
                    clickReset: "\u70b9\u6309\u5373\u53ef\u66f4\u6539\u4f4d\u7f6e", // �㰴���ɸ���λ��
                    where: "\u60a8\u662f\u4e0d\u662f\u5728", // ���ǲ�����
                    qMark: "\uff1f", // ��
                    near: "\u9644\u8fd1\u7684\u5730\u65b9", // �����ĵط�
                    merchantsInfo: "\u5546\u5bb6\u4fe1\u606f\u6570\u636e", // �̼���Ϣ����
                    morePlaces: "\u663e\u793a\u66f4\u591a\u5730\u65b9", // ��ʾ����ط�
                    hideLocation: "\u4e0d\u663e\u793a\u4f4d\u7f6e", // ����ʾλ��
                    lastSearchPlace: "\u56e0\u6b64\uff0c\u76ee\u524d\u663e\u793a\u7684\u662f\u4e0a\u6b21\u6210\u529f\u641c\u7d22\u5230\u7684\u5730\u65b9\u3002", // ��ˣ�Ŀǰ��ʾ�����ϴγɹ��������ĵط���
                    refreshLocation: "\u70b9\u51fb\u5237\u65b0\u6309\u94ae\u4ee5\u91cd\u8bd5\uff0c\u6216\u8005\u5728\u4e0b\u9762\u8f93\u5165\u60a8\u7684\u4f4d\u7f6e\u3002", // ���ˢ�°�ť�����ԣ�������������������λ�á�
                    usePlace: "\u4f7f\u7528\u6b64\u5730\u70b9", // ʹ�ô˵ص�
                    searchingLocation: "\u6b63\u5728\u641c\u7d22\u60a8\u7684\u4f4d\u7f6e...", // ������������λ��...
                    searchingNear: "\u6b63\u5728\u641c\u7d22\u9644\u8fd1\u7684\u5730\u65b9...", // �������������ĵط�...
                    noFound: "\u672a\u627e\u5230\u4f4d\u7f6e", // δ�ҵ�λ��
                    noFoundAny: "\u672a\u627e\u5230\u4efb\u4f55\u5730\u65b9", // δ�ҵ��κεط�
                    rating: "\u8bc4\u7ea7\uff1a ", // ������
                    levelTotal: "\uff08\u5171\u7ea7\uff09", // ����5����
                    category: "\u7c7b\u522b", // ���
                    more: "\u66f4\u591a\u4fe1\u606f >>", // ������Ϣ >>
                    prevPage: "\u4e0a\u4e00\u9875", // ��һҳ
                    nextPage: "\u4e0b\u4e00\u9875", // ��һҳ
                    destination: "\u8f93\u5165\u5730\u70b9", // ����ص�
                    enterLocation: "\u8f93\u5165\u60a8\u6240\u5728\u7684\u5730\u70b9" // ���������ڵĵص�
                }
            }
        },
        'en-US': {
            googleMap : {
                // controls.js
                controls: {
                    tilt: "According to 45 degrees view", // ��ʾ45����ͼ
                    tiltM: "Zoom to display the 45 degree Angle of view", // �Ŵ�����ʾ45���ӽǵ���ͼ
                    terrain: "Shrink to display the street map of terrain", // ��С����ʾ�����εĽֵ���ͼ
                    hybrid: "Place Name", // ����
                    close: "Close", // �ر�
                    zoomIn: "Zoom In", // �Ŵ�
                    zoomOut: "Zoom Out", // ��С
                    clickZoom: "Click to zoom", // ���������
                    dragZoom: "Drag to zoom", // �϶�������
                    clickShow: "Click to view this area on the Google Map", // �������Google��ͼ�ϲ鿴������
                    changeMapType: "Change the style of map", // ���ĵ�ͼ��ʽ
                    mtLeft: "Move to the Left", // ����ƽ��
                    mtRight: "Move to the Right", // ����ƽ��
                    mtUp: "Move to the Up", // ����ƽ��
                    mtDown: "Move to the Down", // ����ƽ��
                    rotate: "The map rotated 90 degrees", // ����ͼ��ת90��
                    unit: {
                        km: "km", // ǧ��
                        m: "m", // ��
                        miles: "miles", // Ӣ��
                        feet: "feet" // Ӣ��
                    },
                    mapData: "Map Data", // ��ͼ����
                    terms: "The terms of use", // ʹ������
                    closeOverview: "Close the overview diagram", // �ر�����ͼ
                    openOverview: "Open the overview diagram" // ������ͼ
                },

                // map.js
                map: {
                    noImage: "Sorry, here no image", // ��Ǹ���˴���ͼ��
                    satellite: "Satellite", // ����
                    satelliteImagery: "According to satellite image", // ��ʾ����ͼ��
                    hybrid: "Hybrid", // ���
                    streetImagery: "Display images with road name", // ��ʾ���нֵ����Ƶ�ͼ��
                    terrain: "Terrain", // ����
                    terrainImagery: "Show with the road map of terrain", // ��ʾ�����εĽֵ���ͼ
                    roadmap: "Road Map", // ��ͼ
                    roadmapImagery: "Display road map" // ��ʾ�ֵ���ͼ
                },

                // onion.js
                onion: {
                    author: "The Author", // ���ߣ�
                    be: "in ", // ��
                    view: "to viewed" // �в鿴
                },

                // place_impl.js
                places: {
                    noSpecified: "No Specified \"", // δָ����
                    nature: "\" nature", // ������
                    findNear: "Find you near", // �����������ĵط�
                    clickLocal: "Click on the select location", // �㰴ѡ��λ��
                    noLocal: "No provide any location", // δ�ṩ�κ�λ��
                    clickReset: "Click to change position", // �㰴���ɸ���λ��
                    where: "Are you in", // ���ǲ�����
                    qMark: "?", // ��
                    near: "Near the places", // �����ĵط�
                    merchantsInfo: "Merchants information data", // �̼���Ϣ����
                    morePlaces: "According to more places", // ��ʾ����ط�
                    hideLocation: "Don`t show the location", // ����ʾλ��
                    lastSearchPlace: "As a result, the display is the last time to search", // ��ˣ�Ŀǰ��ʾ�����ϴγɹ��������ĵط���
                    refreshLocation: "Click on the refresh button to try again, or enter your location below", // ���ˢ�°�ť�����ԣ�������������������λ�á�
                    usePlace: "Use this place", // ʹ�ô˵ص�
                    searchingLocation: "Trying to determine your location...", // ������������λ��...
                    searchingNear: "Searching in the nearby places...", // �������������ĵط�...
                    noFound: "Location was not found", // δ�ҵ�λ��
                    noFoundAny: "Not found anywhere", // δ�ҵ��κεط�
                    rating: "Level: ", // ������
                    levelTotal: "Total Level 5", // ����5����
                    category: "Category", // ���
                    more: "For more information >>", // ������Ϣ >>
                    prevPage: "Previous", // ��һҳ
                    nextPage: "Next", // ��һҳ
                    destination: "The destination", // ����ص�
                    enterLocation: "Enter your location" // ���������ڵĵص�
                }
            }
        }
    };

    googleMap = $langList[$lang] && $langList[$lang].googleMap;

    var getScript = function (id, src, flag) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement("script");
        script.language = "javascript";
        script.type = "text/javascript";
        script.charset = "UTF-8";
        script.id = id;
        script.src = src;
        script.defer = false;
        if (flag) {
            head.appendChild(script);
        } else {
            document.write("<script type='application/javascript' id='" + id + "' src='" + src + "'></script>");
        }
    };

    var modules = google.maps.modules = {};
    google.maps.__gjsload__ = function (name, text) {
        modules[name] = text;
    };

    google.maps.Load = function (apiLoad) {
        delete google.maps.Load;
        apiLoad([
            null,
            [
                [["http://mt0.google.com/vt?lyrs=m@192\u0026src=api\u0026hl=" + $lang + "\u0026", "http://mt1.google.com/vt?lyrs=m@152\u0026src=api\u0026hl=" + $lang + "\u0026"]],
                [["http://khm0.googleapis.com/kh?v=192\u0026hl=" + $lang + "\u0026", "http://khm1.googleapis.com/kh?v=192\u0026hl=" + $lang + "\u0026"], null, null, null, 1],
                [["http://mt0.google.com/vt?lyrs=h@152\u0026src=api\u0026hl=" + $lang + "\u0026", "http://mt1.google.com/vt?lyrs=h@152\u0026src=api\u0026hl=" + $lang + "\u0026"], null, null, "imgtp=png32\u0026"],
                [["http://mt0.google.com/vt?lyrs=t@126,r@152\u0026src=api\u0026hl=" + $lang + "\u0026", "http://mt1.google.com/vt?lyrs=t@126,r@152\u0026src=api\u0026hl=" + $lang + "\u0026"]],
                [
                    ["http://mt0.googleapis.com/maps/vt?lyrs=m@333000000\u0026src=api\u0026hl=" + $lang + "\u0026", "http://mt1.googleapis.com/maps/vt?lyrs=m@333000000\u0026src=api\u0026hl=" + $lang + "\u0026"],
                    null, null, null, null, "m@333000000",
                    ["https://mts0.google.com/maps/vt?lyrs=m@333000000\u0026src=api\u0026hl=" + $lang + "\u0026", "https://mts1.google.com/maps/vt?lyrs=m@333000000\u0026src=api\u0026hl=" + $lang + "\u0026"]
                ],
                //[
                //    ["http://khm0.googleapis.com/kh?v=192\u0026hl=" + $lang + "\u0026", "http://khm1.googleapis.com/kh?v=192\u0026hl=" + $lang + "\u0026"],
                //    null, null, null, 1, "192",
                //    ["https://khms0.google.com/kh?v=192\u0026hl=" + $lang + "\u0026", "https://khms1.google.com/kh?v=192\u0026hl=" + $lang + "\u0026"]
                //],
                //null,
                //[
                //    ["http://mt0.googleapis.com/maps/vt?lyrs=t@132,r@333000000\u0026src=api\u0026hl=" + $lang + "\u0026", "http://mt1.googleapis.com/maps/vt?lyrs=t@132,r@333000000\u0026src=api\u0026hl=" + $lang + "\u0026"],
                //    null, null, null, null, "t@132,r@333000000",
                //    ["https://mts0.google.com/maps/vt?lyrs=t@132,r@333000000\u0026src=api\u0026hl=" + $lang + "\u0026", "https://mts1.google.com/maps/vt?lyrs=t@132,r@333000000\u0026src=api\u0026hl=" + $lang + "\u0026"]
                //],
                null,
                [["http://cbk0.googleapis.com/cbk?", "http://cbk1.googleapis.com/cbk?"]],
                [
                    ["http://khm0.googleapis.com/kh?v=94\u0026hl=" + $lang + "\u0026", "http://khm1.googleapis.com/kh?v=94\u0026hl=" + $lang + "\u0026"],
                    null, null, null, null, "94",
                    ["https://khms0.google.com/kh?v=94\u0026hl=" + $lang + "\u0026", "https://khms1.google.com/kh?v=94\u0026hl=" + $lang + "\u0026"]
                ],
                [["http://mt0.googleapis.com/mapslt?hl=" + $lang + "\u0026", "http://mt1.googleapis.com/mapslt?hl=" + $lang + "\u0026"]],
                [["http://mt0.google.com/mapslt/ft?hl=" + $lang + "\u0026", "http://mt1.google.com/mapslt/ft?hl=" + $lang + "\u0026"]],
                [["http://mt0.googleapis.com/maps/vt?hl=" + $lang + "\u0026", "http://mt1.googleapis.com/maps/vt?hl=" + $lang + "\u0026"]],
                [["http://mt0.googleapis.com/mapslt/loom?hl=" + $lang + "\u0026", "http://mt1.googleapis.com/mapslt/loom?hl=" + $lang + "\u0026"]],
                [["https://mts0.googleapis.com/mapslt?hl=" + $lang + "\u0026", "https://mts1.googleapis.com/mapslt?hl=" + $lang + "\u0026"]],
                [["https://mts0.googleapis.com/mapslt/ft?hl=" + $lang + "\u0026", "https://mts1.googleapis.com/mapslt/ft?hl=" + $lang + "\u0026"]],
                [["https://mts0.googleapis.com/mapslt/loom?hl=" + $lang + "\u0026", "https://mts1.googleapis.com/mapslt/loom?hl=" + $lang + "\u0026"]]
            ],
            [$lang, "US", null, 0, null, "http://maps.googleapis.com", js + "mapfiles/", "http://gg.google.com", "https://maps.gstatic.com", "http://www.googleapis.com/maps"],
            [js + "mapfiles/api-3/4/9", "3.4.9"],
            [843083496], 1, null, null, null, null, 0, "", null, null, 0
        ], loadScriptTime);
        //apiLoad([
        //    null,
        //    [
        //        [["http://mt0.google.com/maps/vt?lyrs=m@333000000\u0026src=api\u0026hl=" + $lang + "\u0026", "http://mt1.google.com/maps/vt?lyrs=m@333000000\u0026src=api\u0026hl=" + $lang + "\u0026"],
        //            null, null, null, null, "m@333000000",
        //            ["https://mts0.google.com/maps/vt?lyrs=m@333000000\u0026src=api\u0026hl=" + $lang + "\u0026", "https://mts1.google.com/maps/vt?lyrs=m@333000000\u0026src=api\u0026hl=" + $lang + "\u0026"]],
        //        [["http://khm0.googleapis.com/kh?v=192\u0026hl=" + $lang + "\u0026", "http://khm1.googleapis.com/kh?v=192\u0026hl=" + $lang + "\u0026"],
        //            null, null, null, 1, "192",
        //            ["https://khms0.google.com/kh?v=192\u0026hl=" + $lang + "\u0026", "https://khms1.google.com/kh?v=192\u0026hl=" + $lang + "\u0026"]],
        //        [["http://mt0.googleapis.com/maps/vt?lyrs=t@132,r@333000000\u0026src=api\u0026hl=" + $lang + "\u0026", "http://mt1.googleapis.com/maps/vt?lyrs=t@132,r@333000000\u0026src=api\u0026hl=" + $lang + "\u0026"],
        //            null, null, null, null, "t@132,r@333000000",
        //            ["https://mts0.google.com/maps/vt?lyrs=t@132,r@333000000\u0026src=api\u0026hl=" + $lang + "\u0026", "https://mts1.google.com/maps/vt?lyrs=t@132,r@333000000\u0026src=api\u0026hl=" + $lang + "\u0026"]],
        //        [["http://mt0.googleapis.com/vt?lyrs=t@126,r@152\u0026src=api\u0026hl=" + $lang + "\u0026", "http://mt1.googleapis.com/vt?lyrs=t@126,r@152\u0026src=api\u0026hl=" + $lang + "\u0026"]],
        //        null,
        //        [["http://cbk0.googleapis.com/cbk?", "http://cbk1.googleapis.com/cbk?"]],
        //        [["http://khm0.googleapis.com/kh?v=94\u0026hl=" + $lang + "\u0026", "http://khm1.googleapis.com/kh?v=94\u0026hl=" + $lang + "\u0026"],
        //            null, null, null, null, "94",
        //            ["https://khms0.google.com/kh?v=94\u0026hl=" + $lang + "\u0026", "https://khms1.google.com/kh?v=94\u0026hl=" + $lang + "\u0026"]],
        //        [["http://mt0.googleapis.com/mapslt?hl=" + $lang + "\u0026", "http://mt1.googleapis.com/mapslt?hl=" + $lang + "\u0026"]],
        //        [["http://mt0.googleapis.com/mapslt/ft?hl=" + $lang + "\u0026", "http://mt1.googleapis.com/mapslt/ft?hl=" + $lang + "\u0026"]],
        //        [["http://mt0.googleapis.com/maps/vt?hl=" + $lang + "\u0026", "http://mt1.googleapis.com/maps/vt?hl=" + $lang + "\u0026"]],
        //        [["http://mt0.googleapis.com/mapslt/loom?hl=" + $lang + "\u0026", "http://mt1.googleapis.com/mapslt/loom?hl=" + $lang + "\u0026"]],
        //        [["https://mts0.googleapis.com/mapslt?hl=" + $lang + "\u0026", "https://mts1.googleapis.com/mapslt?hl=" + $lang + "\u0026"]],
        //        [["https://mts0.googleapis.com/mapslt/ft?hl=" + $lang + "\u0026", "https://mts1.googleapis.com/mapslt/ft?hl=" + $lang + "\u0026"]],
        //        [["https://mts0.googleapis.com/mapslt/loom?hl=" + $lang + "\u0026", "https://mts1.googleapis.com/mapslt/loom?hl=" + $lang + "\u0026"]]
        //    ],
        //    [$lang, "US", null, 0, null, null, js + "mapfiles/", "http://csi.gstatic.com", "https://maps.googleapis.com", "http://maps.googleapis.com", null, "https://maps.google.com", "https://gg.google.com", "http://maps.gstatic.com/maps-api-v3/api/images/", "https://www.google.com/maps", 0, "https://www.google.com"],
        //    [js + "mapfiles/api-3/4/9", "3.4.9"],
        //    [2751510116], 1, null, null, null, null, null, "", null, null, 0
        //], loadScriptTime);
        //apiLoad([0.009999999776482582,[[["http://mt0.googleapis.com/maps/vt?lyrs=m@333000000\u0026src=api\u0026hl=zh-CN\u0026","http://mt1.googleapis.com/maps/vt?lyrs=m@333000000\u0026src=api\u0026hl=zh-CN\u0026"],null,null,null,null,"m@333000000",["https://mts0.google.com/maps/vt?lyrs=m@333000000\u0026src=api\u0026hl=zh-CN\u0026","https://mts1.google.com/maps/vt?lyrs=m@333000000\u0026src=api\u0026hl=zh-CN\u0026"]],[["http://khm0.googleapis.com/kh?v=192\u0026hl=zh-CN\u0026","http://khm1.googleapis.com/kh?v=192\u0026hl=zh-CN\u0026"],null,null,null,1,"192",["https://khms0.google.com/kh?v=192\u0026hl=zh-CN\u0026","https://khms1.google.com/kh?v=192\u0026hl=zh-CN\u0026"]],null,[["http://mt0.googleapis.com/maps/vt?lyrs=t@132,r@333000000\u0026src=api\u0026hl=zh-CN\u0026","http://mt1.googleapis.com/maps/vt?lyrs=t@132,r@333000000\u0026src=api\u0026hl=zh-CN\u0026"],null,null,null,null,"t@132,r@333000000",["https://mts0.google.com/maps/vt?lyrs=t@132,r@333000000\u0026src=api\u0026hl=zh-CN\u0026","https://mts1.google.com/maps/vt?lyrs=t@132,r@333000000\u0026src=api\u0026hl=zh-CN\u0026"]],null,null,[["http://cbk0.googleapis.com/cbk?","http://cbk1.googleapis.com/cbk?"]],[["http://khm0.googleapis.com/kh?v=94\u0026hl=zh-CN\u0026","http://khm1.googleapis.com/kh?v=94\u0026hl=zh-CN\u0026"],null,null,null,null,"94",["https://khms0.google.com/kh?v=94\u0026hl=zh-CN\u0026","https://khms1.google.com/kh?v=94\u0026hl=zh-CN\u0026"]],[["http://mt0.googleapis.com/mapslt?hl=zh-CN\u0026","http://mt1.googleapis.com/mapslt?hl=zh-CN\u0026"]],[["http://mt0.googleapis.com/mapslt/ft?hl=zh-CN\u0026","http://mt1.googleapis.com/mapslt/ft?hl=zh-CN\u0026"]],[["http://mt0.googleapis.com/maps/vt?hl=zh-CN\u0026","http://mt1.googleapis.com/maps/vt?hl=zh-CN\u0026"]],[["http://mt0.googleapis.com/mapslt/loom?hl=zh-CN\u0026","http://mt1.googleapis.com/mapslt/loom?hl=zh-CN\u0026"]],[["https://mts0.googleapis.com/mapslt?hl=zh-CN\u0026","https://mts1.googleapis.com/mapslt?hl=zh-CN\u0026"]],[["https://mts0.googleapis.com/mapslt/ft?hl=zh-CN\u0026","https://mts1.googleapis.com/mapslt/ft?hl=zh-CN\u0026"]],[["https://mts0.googleapis.com/mapslt/loom?hl=zh-CN\u0026","https://mts1.googleapis.com/mapslt/loom?hl=zh-CN\u0026"]]],["zh-CN","US",null,0,null,null,"http://maps.gstatic.com/mapfiles/","http://csi.gstatic.com","https://maps.googleapis.com","http://maps.googleapis.com",null,"https://maps.google.com","https://gg.google.com","http://maps.gstatic.com/maps-api-v3/api/images/","https://www.google.com/maps",0,"https://www.google.com"],["http://maps.google.com/maps-api-v3/api/js/23/3/intl/zh_cn","3.23.3"],[2751510116],1,null,null,null,null,null,"",null,null,0,"http://khm.googleapis.com/mz?v=192\u0026",null,"https://earthbuilder.googleapis.com","https://earthbuilder.googleapis.com",null,"http://mt.googleapis.com/maps/vt/icon",[["http://mt0.googleapis.com/maps/vt","http://mt1.googleapis.com/maps/vt"],["https://mts0.googleapis.com/maps/vt","https://mts1.googleapis.com/maps/vt"],null,null,null,null,null,null,null,null,null,null,["https://mts0.google.com/maps/vt","https://mts1.google.com/maps/vt"],"/maps/vt",333000000,132],2,500,[null,"http://g0.gstatic.com/landmark/tour","http://g0.gstatic.com/landmark/config",null,"http://www.google.com/maps/preview/log204","","http://static.panoramio.com.storage.googleapis.com/photos/",["http://geo0.ggpht.com/cbk","http://geo1.ggpht.com/cbk","http://geo2.ggpht.com/cbk","http://geo3.ggpht.com/cbk"],"http://maps.googleapis.com/maps/api/js/GeoPhotoService.GetMetadata","http://maps.googleapis.com/maps/api/js/GeoPhotoService.SingleImageSearch",["http://lh3.ggpht.com/","http://lh4.ggpht.com/","http://lh5.ggpht.com/","http://lh6.ggpht.com/"]],["https://www.google.com/maps/api/js/master?pb=!1m2!1u23!2s3!2szh-CN!3sUS!4s23/3/intl/zh_cn","https://www.google.com/maps/api/js/widget?pb=!1m2!1u23!2s3!2szh-CN"],null,0,null,"/maps/api/js/ApplicationService.GetEntityDetails",0,null,null,[null,null,null,null,null,null,null,null,null,[0,0],[0,null,null,0,0,null,0,0,0,0,0,0,0,"U",0,0],null,null],null,null,["23.3"]], loadScriptTime);
    };
    var loadScriptTime = (new Date).getTime();
    getScript('gmapMain', js + "mapfiles/api-3/4/9/main.js", window.MapTools);
    //getScript('gmapLabelMarker', js + "MarkerWithLabel.js");
    //getScript('gmapCluster', js + "MarkerClusterer.js");
    //$.getScript(js + "mapfiles/api-3/4/9/main.js", function () {
    //getScript('gmapLabelMarker', js + "MarkerWithLabel.js");
    //getScript('gmapCluster', js + "MarkerClusterer.js");
    // });
})();
