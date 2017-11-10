/**
 * Created by PL02053 on 2016/3/10.
 */
define('i18n', ['jquery', 'cookie'], function () {
    return {
        zh: {
            title: ['标题', '副标题']
        },
        en: {
            title: ['The Title', 'The SubTitle']
        },

        /**
         * 国际化处理
         * @param lang
         * @param region
         */
        setLanguage: function (lang, region) {
            var self = this;
            $('.i18n').each(function (i, e) {
                var type = e.dataset ? e.dataset.i18nType : $(e).attr('data-i18n-type');
                var msg = e.dataset ? e.dataset.i18nMessage : $(e).attr('data-i18n-message');
                var typeList = [];
                if (type) {
                    typeList = type.split(/\s+/g);
                }
                else {
                    typeList = ['text'];
                }
                var evalMsg = self._evalMessage(self[lang], msg);
                $.each(typeList, function (s, t) {
                    self._setMessage($(e), t, evalMsg);
                });
            });
            Cookies.set('lang', lang);
            Cookies.set('region', region);
        },

        /**
         * 消息国际化解析
         * @param context
         * @param msg
         * @returns {*|string}
         * @private
         */
        _evalMessage: function (context, msg) {
            var ptns = msg.substring(msg.indexOf('.') + 1).split('.');
            var evalMsg = context[msg] || '';
            for ( var i = 0; i < ptns.length; i++) {
                var ptn = ptns[i];
                if(ptn.indexOf('[') >= 0) {
                    var h = ptn.substring(0, ptn.indexOf('['));
                    evalMsg = context[h];
                    var pps = ptn.match(/\[[^\[\]]]/g);
                    for ( var j = 0; j < pps.length; j++) {
                        var pp = pps[j];
                        evalMsg = evalMsg[pp.substring(pp.indexOf('[') + 1, pp.indexOf(']'))];
                    }
                }else{
                    evalMsg = context[ptns[i]];
                }
            }
            return evalMsg;
        },

        /**
         * 写入国际化处理后的消息
         * @param $e
         * @param type
         * @param message
         * @private
         */
        _setMessage: function ($e, type, message) {
            if ($e && $e.length) {
                switch (type) {
                    case 'text':
                        $e.text(message);
                        break;
                    case 'title':
                        $e.attr('title', message);
                        break;
                    case 'value':
                        $e.val(message);
                        break;
                    case 'placeholder':
                        $e.attr('placeholder', message);
                        break;
                    default:
                }
            }
        }

    };
});