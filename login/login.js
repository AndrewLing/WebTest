//$.extend({
//  sha256 : function(encrypt) {
//      return hex_sha256(encrypt).toLowerCase();
//  }
//});
var clickFlag = true;
var timeScript = null;
$(function() {
    setLanguage();
    $("#username").focus();
    $("#language select").change(function(event) {
        var langValue = $(this).val();
        loadScript(langValue);
    });
    initLanguage();
});

function resetClickFlag() {
    clickFlag = true;
}

function checkLogin() {
    if (clickFlag == false) {
        return;
    }
    clickFlag = false;
    var lang = $("#language select").val();
    var exp = new Date();
    exp.setTime(exp.getTime() + 60 * 60 * 1000);
    Cookies.set("Prefer_Lang", lang, exp, '/', location.hostname);
    var passwordEncode = $.md5($("#txt_password").val());
    $("#password").val(passwordEncode);
    var length = $("#txt_password").val().length;
    $.omcAjax("login", {
        loginTicket: $("#loginTicket").val(),
        username: $("#username").val(),
        password: $("#password").val()
    }, function(result) {
        if (!result) {
            $.omcAlert(Lan.loginError);
        }
        if (result.success && result.data) {
            var url = result.data;
            window.location.href = url;
        } else {
            $("#errorMessageId").html(result.data);
            setTimeout(resetClickFlag, 800);
        }
    }, null, "sync");
}
document.onkeydown = function(evt) {
    evt = (evt) ? evt : ((window.event) ? window.event : "");
    var key = evt.keyCode ? evt.keyCode : evt.which;
    if (key == 13) {
        if (!$("#login").attr("disabled")) {
            checkLogin();
            evt.returnValue = false;
        }
    }
};

function loadScript(langValue) {
    var timeIE = null;
    var browserName = brower.getName();
    var script = document.createElement("script");
    var head = document.getElementsByTagName("head")[0];
    var src = "login/" + langValue + ".js";
    script.setAttribute("src", src);
    head.appendChild(script);
    if(browserName == "ie") {
        timeIE = setInterval(function(){
            if(script.readyState) {
                setLanguage();
                if(timeIE) {
                    clearInterval(timeIE);
                }
            }
        }, 30);
    } else {
        script.onload = setLanguage;
    }
}

function setLanguage() {
    $('.text').each(function(n, c) {
        var ec = $(c);
        var msg = ec.attr("html-text") || ec.html();
        if (msg && msg.length > 4 && msg.substr(0, 4) == 'Lan.') {
            ec.attr("html-text", msg);
            ec.html(eval('(' + msg + ')'));
        }
    });
    $("input.text[placeholder]").each(function(i, e) {
        var p = $(e).attr("placeholder-text") || $(e).attr("placeholder");
        var n = "";
        try {
            $(e).attr("placeholder-text", p);
            n = eval(p);
        } catch (e) {
            n = p;
        }
        $(e).attr("placeholder", n);
    });
    $(".text[title]").each(function(i, e) {
        var p = $(e).attr("title-text") || $(e).attr("title");
        var n = "";
        try {
            $(e).attr("title-text", p);
            n = eval(p);
        } catch (e) {
            n = p;
        }
        $(e).attr("title", n);
    });
    checkBrowser();
}

function checkBrowser() {
    var isChrome = false;
    var isRightVersion = false;
    var browserName = brower.getName();
    var browserCurVersion = brower.getBbh();
    if (browserName == "chrome") {
        isChrome = true;
    }
    if (browserCurVersion >= sysBbh) {
        isRightVersion = true;
    }
    if (!isChrome || !isRightVersion) {
        var ts = Lan.browserInfluence;
        $("#errorMessageId").html(ts).attr("html-text", "Lan.browerInfluence");
        var obw = Lan.notChrome;
        var prm = {
            id: "notChrome",
            message: obw
        };
        prm.btns = [{
            text: Lan.sure || 'OK',
            click: function(d) {
                $(this).dialog('close');
                browserTip();
            }
        }, {
            text: Lan.cancel || 'Cancel',
            click: function(d) {
                $(this).dialog('close');
            }
        }]
        App.confirm(prm);
    }
}

function browserTip() {
    window.location.href = '/sso/brow/down?fileName=login/chrome.exe';
    var str = "<div>";
    str += Lan.declareMessage + "</br>";
    str += "<div style='margin-top:10px;'>" + Lan.browserTip_one + "</div></br>";
    str += "<div>" + Lan.browserTip_two + "</div></br>";
    str += "<div>" + Lan.browserTip_three + "</div></br>";
    str += "<div>" + Lan.browserTip_four+ "</div></div>";
    var p = {};
    p.id = "broTs";
    p.message = str;
    p.btns = [{
            text: Lan.sure || 'OK',
            click: function(d) {
                $(this).dialog('close');
            }
        }];
    App.alert(p, function() {});
}

function initLanguage() {
    var lang = Cookies.get("Prefer_Lang");
    if(lang) {
        $("#language select").val(lang);
        loadScript(lang);
    }
}