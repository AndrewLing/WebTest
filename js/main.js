/**
 * Created by p00034 on 2017-06-16.
 */
require.config({
    baseUrl: './js/',
    paths: {
        'jquery': 'jquery/jquery',
        'json2': 'json2',
        'cookie': 'jquery/Cookies',
        "leaflet": 'Leaflet/leaflet'
    },
    shim: {
        'jquery': {
            exports: '$'
        }
    }
});

require(['jquery', 'Leaflet/MapUtil'], function ($, MapUtil) {
    var map;
    $(function () {
        map = MapUtil.Instance('map-container', {
            theme: 'default',
            center: [104.06559, 30.657406],
            mapType: 0,
            zoomLevel: 3
        });
    });
});