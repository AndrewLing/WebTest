/**
 * 语言与区域插件，依赖于jQuery。如果mac组件存在，则作为mac的插件使用，
 * 否则将初始化mac
 *
 * Created by PL02053 on 2016/4/12.
 */
(function($) {
    var SEPARATOR = '-';
    function Locale(language, region) {
        this.language = language || 'zh';
        this.region = region || 'CN';
    }

    // TODO 语言列表，需要修改为从请求头中读取
    Locale.languages = ['zh-CN', 'en-US'];
    var CHINA = new Locale('zh');
    var ENGLISH = new Locale('en', 'US');
    var LANGUAGES = {CHINA: CHINA, ENGLISH: ENGLISH};
    var locale = new Locale('zh');

    var languages = [];
    var regions = [];
    var map = {};
    for ( var i = 0; i < Locale.languages.length; i++) {
        var str = Locale.languages[i];
        var language = str.split(SEPARATOR)[0];
        languages.push(language);
        var region = str.split(SEPARATOR)[1] || '';
        regions.push(region);
        if(!map.language) {
            map[language] = [];
        }
        map[language].push(region);
    }

    // Local静态方法扩展
    $.extend(Locale, {
        setCookies: function(l, r) {
            if(!window.Cookies) {
                return;
            }
            Cookies.set('language', l || '');
            Cookies.set('region', r || '');
        },
        getLanguages: function() {
            return languages;
        },
        getLanguage: function(languagename) {
            if(!languagename)
                return locale.language || CHINA.language;
            return (LANGUAGES[languagename] || {}).language;
        },
        getRegions: function() {
            return regions;
        },
        getRegion: function() {
            return locale.region;
        },
        getLocales: function() {
            return map;
        },
        setLocale: function(language, region) {
            language = (language || '').replace(/^(null|undefined)$/g, '');
            region = (region || '').replace(/^(null|undefined)$/g, '');
            if(arguments.length === 1 || language.indexOf('-') >= 0) {
                region = language.split(SEPARATOR)[1];
                language = language.split(SEPARATOR)[0];
            }
            locale.setLocal(language, region);
            Locale.language = language === CHINA.language ? '' : language;
            Locale.region = region;
            this.setCookies(language, region);
        },
        getLocale: function(sp) {
            return locale.toString(sp);
        },
        isLegalRegion: function(region) {
            return regions.indexOf(region) >= 0;
        },
        isLegalLanguage: function(lang) {
            return languages.indexOf(lang) >= 0 ||
                (Locale.languages.indexOf(lang) >= 0);
        },
        setLanguageByNavigator: function() {
            var browserName = navigator.appName;
            var l = (browserName == "Microsoft Internet Explorer") ? navigator.browserLanguage :
                navigator.language;
            Locale.setLocale(l);
            this.setCookies(l);
        },
        setLanguageByCookies: function(cookies) {
            cookies = cookies || window.Cookies;
            Locale.setLocale(cookies.get('language'), cookies.get('region'))
        },
        // 增加繁体字后需要更改此方法
        isSimpleChinese: function(lang) {
            if(!lang) {
                return true;
            }
            if(lang.indexOf(SEPARATOR)) {
                lang = lang.split(SEPARATOR)[0];
            }

            return lang === '' || (lang === CHINA.language);
        }
    });

    // Locale实例方法扩展
    $.extend(Locale.prototype, {
        getLocale: function() {
            return this;
        },
        toString: function(sp) {
            var suffix = this.region ? ((sp || SEPARATOR) + this.region) : '';
            return (this.language || CHINA.language) + suffix;
        },
        setLocal: function(language, region) {
            region = region || '';
            var isLegal = function(arr, val) {
                if(val !== '' && arr.indexOf(val) < 0)
                    throw new Error('Illegal locale setting.')
            };
            isLegal(languages, language);
            isLegal(regions, region);
            this.language = language;
            this.region = region;
        }
    });

    // mac组件扩展
    window.mac || (window.mac = {language: '', region: ''});
    $.extend(mac, Locale);
    if(Object.defineProperties){
        Object.defineProperties(mac, {
            'languages': Locale.languages
        });
    }

    /**
     * set language
     */
    mac.setLanguage = function (lan, region, refresh) {
        if(typeof region === 'boolean' && refresh == null) {
            refresh = region;
            region = null;
        }
        region || (region = '');

        var il8n = function(c, cb, field) {
            var msg = c[field || 'innerHTML'];
            var ec = $(c);
            if (!/^Msg\..+/.test(msg)){
                return;
            }
            // Msg对象中只能使用字母、数字、下划线，禁止使用$
            if (!/^Msg(\.\w+)+/.test(msg) || /\$/.test(msg)){
                throw new Error('Error Msg statement with illegal symbol.');
            }
            var ptns = msg.substring(msg.indexOf('.') + 1).split('.');
            msg = Msg;
            // 拆分字符串，利用下标的方式从Msg对象中取值，替代原来的eval
            for ( var i = 0; i < ptns.length; i++) {
                var ptn = ptns[i];
                if(ptn.indexOf('[') >= 0) {
                    var h = ptn.substring(0, ptn.indexOf('['));
                    msg = msg[h];
                    var pps = ptn.match(/\[[^\[\]]]/g);
                    for ( var j = 0; j < pps.length; j++) {
                        var pp = pps[j];
                        msg = msg[pp.substring(pp.indexOf('[') + 1, pp.indexOf(']'))];
                    }
                }else{
                    msg = msg[ptns[i]];
                }
            }
            cb(ec, msg);
        };
        var reload = function() {
            var cl = mac.language;
            if(cl === '') cl = CHINA;
            if(cl === lan) return;
            // 中文预设值为空字串
            mac.setLocale('', region);
            // 其他情况检查预设的语言列表
            for ( var i = 0; i < mac.languages.length; i++) {
                if(mac.languages[i] === lan && mac.languages[i] !== CHINA) {
                    mac.setLocale(lan, region);
                    break;
                }
            }
            // 手动切换
            //$.omcAjax('index/setLanguage', {language:lan}, false);
            //if(refresh) App.refresh();
        };
        // 传递lan时切换语言
        if(lan) {
            reload();
            return;
        }
        // 未传递lan时对页面文本进行替换
        $('.text').each(function (n, c) {
            il8n(c, function(ec, msg) {
                ec.html(msg);
            }, 'innerHTML');
        });
        $('.text[value]').each(function (n, c) {
            il8n(c, function(ec, msg) {
                ec.val(msg);
            }, 'value');
        });
        $('.i18n-title').each(function (n, c) {
            il8n(c, function(ec, msg) {
                ec.attr('title', msg);
            }, 'title');
        });
    };
}(jQuery));
