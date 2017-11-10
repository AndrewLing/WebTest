!function (a, b) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function (a) {
        if (!a.document) throw new Error("Cookies requires a window with a document");
        return b(a)
    } : b(a)
}("undefined" != typeof window ? window : this, function (win) {
    var Cookies = {};

    Cookies.set = function (name, value) {
        var argv = arguments;
        var argc = arguments.length;
        var expires = (argc > 2) ? argv[2] : null;
        var path = (argc > 3) ? argv[3] : '/';
        var domain = (argc > 4) ? argv[4] : null;
        var secure = (argc > 5) ? argv[5] : false;
        document.cookie = name + "=" + escape(value)
        + ((expires == null) ? "" : ("; expires=" + expires.toGMTString()))
        + ((path == null) ? "" : ("; path=" + path))
        + ((domain == null) ? "" : ("; domain=" + domain)) + ((secure == true) ? "; secure" : "");
    };

    Cookies.get = function (name) {
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        var i = 0;
        var j = 0;
        while (i < clen) {
            j = i + alen;
            if (document.cookie.substring(i, j) == arg)
                return Cookies.getCookieVal(j);
            i = document.cookie.indexOf(" ", i) + 1;
            if (i == 0)
                break;
        }
        return null;
    };

    Cookies.clear = function (name) {
        if (Cookies.get(name)) {
            var expdate = new Date();
            expdate.setTime(expdate.getTime() - (86400 * 1000 * 1));
            Cookies.set(name, "", expdate);
        }
    };
    Cookies.getCookieVal = function (offset) {
        var endstr = document.cookie.indexOf(";", offset);
        if (endstr == -1) {
            endstr = document.cookie.length;
        }
        return unescape(document.cookie.substring(offset, endstr));
    };

    win.Cookies = Cookies;
});