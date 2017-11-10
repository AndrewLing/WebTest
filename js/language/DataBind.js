/**
 * 模拟数据双向绑定
 * Created by PL02053 on 2016/4/12.
 */
(function ($) {
    window.DataBind = {
        controller: function (sv, call) {
            var obj = {};
            var objTmp = {};
            call(obj);

            var regStr = [];
            for (var n in obj) {
                regStr.push("\\{" + n + "\\}");
            }
            var reg = new RegExp(regStr.join("|"), "g");
            sv.innerHTML = sv.innerHTML.replace(reg, function (a) {
                var b = a.substring(1, a.length - 1);

                return "<" + b + "_1>" + a + "</" + b + "_1>";
            });
            for (var n in obj) {
                var arr = document.getElementsByTagName(n + "_1");
                var hbArr = [];
                for (var i = 0; i < arr.length; i++) {
                    var elt = arr[i];
                    objTmp[n] = obj[n];
                    var textNode = document.createTextNode(obj[n] || elt.innerHTML);
                    hbArr.push([textNode, elt]);
                    if (!objTmp[n + "_textNode"])objTmp[n + "_textNode"] = [];
                    objTmp[n + "_textNode"].push(textNode);
                }
                for (var i = 0; i < hbArr.length; i++) {
                    var s = hbArr[i];
                    s[1].parentNode.replaceChild(s[0], s[1]);
                }
            }
            for (var n in obj) {
                (function (n) {
                    if (!obj.__defineSetter__) {
                        var myValue = "";
                        Object.defineProperty(obj, n, {
                            set: function (x) {
                                var arr = objTmp[n + "_textNode"] || [];
                                for (var i = 0; i < arr.length; i++) {
                                    arr[i].nodeValue = x;
                                }
                                objTmp[n] = x;
                            },
                            get: function () {
                                return objTmp[n];
                            }
                        });
                    } else {
                        obj.__defineGetter__(n, function () {
                            return objTmp[n];
                        });
                        obj.__defineSetter__(n, function (val) {
                            var arr = objTmp[n + "_textNode"] || [];
                            for (var i = 0; i < arr.length; i++) {
                                arr[i].nodeValue = val;
                            }
                            objTmp[n] = val;
                        });
                    }
                })(n);
            }
        }
    };
})(jQuery);