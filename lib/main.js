/**
 * Created by PL02053 on 2016/3/10.
 */
var lang = 'zh';

require.config({
    baseUrl: '/WebTest/lib/',
    paths: {
        'jquery': '../js/jquery/jquery',
        'json2': '../js/json2',
        'cookie': '../js/jquery/Cookies'
    }
});

require(['jquery', 'cookie', 'i18n', 'SockJs'], function(jq, cookie, i18n, SocketJS) {
    debugger
    $('#lang_sel').val(lang).change(function () {
        lang = $(this).val();
        i18n.setLanguage(lang);
    });

    i18n.setLanguage(lang);

    //Socket.init('ws://10.10.12.54/websocket.ws');
    SocketJS.connection('ws://10.10.11.50/websocket.ws', 'busi1', {a:1,b:2}, function (res) {
        debugger;
        console.log(res);
    }, {});
});