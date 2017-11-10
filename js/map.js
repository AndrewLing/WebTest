(function (config) {
    var aa = navigator.userAgent.toLowerCase(), ca = window, fa = document, la = fa.documentElement;

    function e(a) {
        return -1 !== aa.indexOf(a)
    }

    var ma = "ActiveXObject"in ca, sa = "devicePixelRatio"in ca && 1 < ca.devicePixelRatio || ma && "matchMedia"in ca && ca.matchMedia("(min-resolution:144dpi)") && ca.matchMedia("(min-resolution:144dpi)").matches, ta = e("windows nt"), Aa = -1 !== aa.search(/windows nt [1-5]\./), Ba = -1 !== aa.search(/windows nt 5\.[12]/), Ca = Aa && !Ba, Da = e("windows phone"), Ma = e("macintosh"), Na = e("ipad;"), Wa = Na && sa, Xa = e("ipod touch;"), Ya = e("iphone;"), gb = Ya || Na || Xa, hb = gb && -1 !== aa.search(/ os [456]_/);
    gb && aa.search(/ os [4-8]_/);
    var ib = gb && -1 !== aa.search(/ os [78]_/);
    gb && e("os 8_");
    var jb = gb && e("os 10_"), kb = e("android"), yb = -1 !== aa.search(/android [123]/), zb = e("android 4");
    kb && -1 === aa.search(/android [1-4]/) || aa.search(/android 4.4/);
    var Ab = kb ? "android" : gb ? "ios" : ta ? "windows" : Ma ? "mac" : "other", Pb = ma && !ca.XMLHttpRequest, Qb = ma && !fa.querySelector, Rb = ma && !fa.addEventListener, Sb = ma && e("ie 9"), Tb = ma && e("msie 10"), Ub = ma && e("rv:11"), Vb = e("edge"), Wb = e("qtweb"), Xb = e("ucbrowser"), Yb = e("miuibrowser"), Zb = e("micromessenger"), $b = e("mqqbrowser"), qc = e("baidubrowser"), chrome = (e("chrome") || e("crios")) && !Zb && !qc && !$b && !Vb && !Yb, rc = chrome && e("chromium"), sc = e("firefox"), tc = (Ma || gb) && e("safari") && e("version/"), uc = gb && e("aliapp"), vc = gb && (!$b && !Xb && !Zb && !chrome && !sc && !tc || uc), wc = kb || gb || Da || e("mobile") || "undefined" !== typeof orientation, xc = ca.navigator && ca.navigator.msPointerEnabled && !!ca.navigator.msMaxTouchPoints, yc = xc || e("touch") || "ontouchstart"in fa, zc;
    var Ac = void 0, Bc = document.documentElement.clientWidth, Cc = screen.width;
    kb && Xb && (Cc /= ca.devicePixelRatio);
    if (Cc > Bc)zc = void 0; else {
        var Dc = window.orientation, Dc = void 0 === Dc ? document.documentElement.clientWidth > document.documentElement.clientHeight ? "landscape" : "portrait" : 0 === Dc || 180 === Dc ? "portrait" : "landscape";
        "portrait" === Dc ? screen.width > screen.height && (Cc = screen.height) : screen.width < screen.height && (Cc = screen.height);
        zc = Ac = Cc / window.innerWidth
    }
    var Ec = ma && "transition"in la.style, Mc = !!fa.createElementNS && !!fa.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect, Nc = fa.createElement("canvas"), Oc = !(!Nc || !Nc.getContext), Pc = window.URL || window.webkitURL, Qc = !ma && !(Xb && kb) && window.Worker && Pc && Pc.createObjectURL && window.Blob, Rc = !wc && chrome && !rc && Qc && Oc && !vc && !(!Nc.getContext("webgl") && !Nc.getContext("experimental-webgl")), Sc = !Oc || Wb || Da || wc && sc || Sb || hb || Wa || Xa || yb || e("gt-n710") || Ca, Tc = !Sc && !Rc && (zb || ib || gb && Zb || !wc), Uc = Rc ? "vw" : Sc ? "d" :
        Tc ? "dv" : "v", Vc = e("webkit"), Wc = "WebKitCSSMatrix"in ca && "m11"in new window.WebKitCSSMatrix, Xc = "MozPerspective"in la.style, Yc = "OTransition"in la.style, Zc = Ec || Wc || Xc || Yc, $c = void 0 !== config[8] ? config[8] : !0, ad = void 0 !== config[9] ? config[9] : !0, bd = !Mc && wc && Oc, cd = !1;
    try {
        cd = "undefined" !== typeof ca.localStorage
    } catch (dd) {
    }
    config.j = {
        size: Ya ? 100 : kb ? 200 : 350,
        Ny: Ma,
        r3: ta,
        yH: gb,
        eW: jb,
        Ud: kb,
        u0: yb,
        Rs: Ab,
        ax: qc,
        r2: $b,
        yY: tc,
        e_: Zb,
        wm: ma,
        Qf: Pb,
        fp: Qb,
        I1: Sb,
        RV: Tb,
        md: Rb,
        TV: ma && !Ub,
        Bs: cd,
        It: Xb,
        chrome: chrome,
        FG: sc,
        Y: wc,
        h2: wc && Vc,
        IW: wc && Wc,
        g2: wc && ca.opera,
        Sb: sa,
        lA: zc,
        Ja: sa && (!wc || void 0 !== zc && 0.8 < zc),
        Dc: yc,
        nI: xc,
        c_: Vc,
        H1: Ec,
        d_: Wc,
        c1: Xc,
        k2: Yc,
        RS: Zc,
        fi: Mc,
        ip: Oc,
        OH: Qc,
        ym: Rc,
        s_: !1,
        rg: $c && !Sc,
        cT: $c ? Uc : "d",
        zm: ad && !!ca.WebSocket && !qc,
        iX: bd,
        mX: Oc || bd ? "c" : "d"
    };
    var ca = window, ed = "http map anip layers overlay0 brender mrender".split(" ");
    config.od = "main";
    config.j.Dc && (ed += ",touch", config.od += "t");
    config.j.Y || (ed += ",mouse", config.od += "m");
    config.od += "c";
    config.j.rg && (config.od += "v", ed += ",vectorlayer,overlay", config.j.ym ? (config.od += "w", ed += ",wgl") : (config.od += "cg", ed += ",cgl"));
    config[7] && (ed += "," + config[7], config.od += config[7].replace(",", "").replace(eval("/AMap./gi"), ""));
    ed += ",sync";
    config.uK = ed.split(",");
    window.AMap = window.AMap || {};
    window.AMap.Ah = "1.3.21.1";
    var fd = window.AMap.kA = {}, gd = config[2].split(",")[0], hd = gd + "/theme/v" + config[4] + "/style1.3.21.1.css", id = document.head || document.getElementsByTagName("head")[0];
    if (id) {
        var jd = document.createElement("link");
        jd.setAttribute("rel", "stylesheet");
        jd.setAttribute("type", "text/css");
        jd.setAttribute("href", hd);
        id.insertBefore(jd, id.firstChild)
    } else document.write("<link rel='stylesheet' href='" + hd + "'/>");
    function kd(a) {
        var b = document, c = b.createElement("script");
        c.charset = "utf-8";
        c.src = a;
        (a = b.body || id) && a.appendChild(c)
    }

    function ld() {
        for (var a = gd + "/maps/main?v=" + config[4] + "&key=" + config[0] + "&m=" + config.uK.join(",") + "&vrs=1.3.21.1", b = document.getElementsByTagName("script"), c, d = 0; d < b.length; d += 1)if (0 === b[d].src.indexOf(gd.split(":")[1] + "/maps?")) {
            c = b[d];
            break
        }
        config[5] || c && c.async ? kd(a) : (document.write('<script id="amap_main_js" src=\'' + a + "' type='text/javascript'>\x3c/script>"), setTimeout(function () {
            document.getElementById("amap_main_js") || kd(a)
        }, 1))
    }

    var rd = (new Date).getTime();
    fd.__load__ = function (a) {
        a(config, rd);
        fd.__load__ = null
    };
    try {
        if (window.localStorage) {
            var sd = window.localStorage["_AMap_" + config.od], td = !1;
            sd ? (sd = JSON.parse(sd), sd.version === window.AMap.Ah ? (eval(sd.script), fd.loaded = !0) : td = !0) : td = !0;
            if (td)for (var E in window.localStorage)window.localStorage.hasOwnProperty(E) && 0 === E.indexOf("_AMap_") && window.localStorage.removeItem(E)
        }
    } catch (ud) {
    }
    fd.loaded || (ld(), config.uK = void 0);
})(["77c9006122a14e0948e43e1a7a5441d7", [102.992886, 30.094297, 104.892795, 31.435334, 104.065735, 30.659462], "http://webapi.amap.com", 1, "1.3", "mapInit", "510100", "AMap.PolyEditor,AMap.CircleEditor", true, true])