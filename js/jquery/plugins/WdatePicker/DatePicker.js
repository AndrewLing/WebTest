/**
 * Created by PL02053 on 2016/3/7.
 */
+(function ($) {
    window.DatePicker = function (option) {
        var $lang = mac.Lang || 'zh';
        option = $.extend({}, {
            skin: 'black',
            dateFmt: 'yyyy-MM-dd',
            lang: $lang
        }, option);

        if ($lang.indexOf('zh') >= 0) {
            option.lang = 'zh-cn';
        }
        else if ($lang.indexOf('ja') >= 0) {
            option.lang = 'ja';
            option.dateFmt = option.dateFmt.replace(/-/ig, '\/');
        }
        else {
            option.lang = 'en';

            var fullTimes = option.dateFmt.split(/\s/);
            var year = (fullTimes[0].match("y+") && fullTimes[0].match("y+")[0]) || "";
            var month = (fullTimes[0].match("M+") && fullTimes[0].match("M+")[0]) || "";
            var day = (fullTimes[0].match("d+") && fullTimes[0].match("d+")[0]) || "";

            var t = month + (day && month ? ("\/" + day) : day) + ((year && month) || (year && day) ? ("\/" + year) : year);
            t && (fullTimes[0] = t);
            //fullTimes[0] = (fullTimes[0] && fullTimes[0].split('').reverse().join('').replace(/[年月\-]/ig, '\/').replace('日', '')) || fullTimes[0];

            option.dateFmt = fullTimes.reverse().join(' ');
        }

        new WdatePicker(option);
    };

    /**
     * 获取时间控件实际时间（返回JS Date对象）
     * @param did 时间控件元素ID
     * @returns {Date}
     */
    window.DatePicker.getRealDate = function (did) {
        var dpDate = $dp.$DV($dp.$D(did));
        return new Date(dpDate.y, dpDate.M, dpDate.d, dpDate.H, dpDate.m, dpDate.s);
    };
    /**
     * 获取时间控件实际时间（返回WdatePicker DpDate对象）
     * @param did
     * @returns {*}
     */
    window.DatePicker.getRealDPDate = function (did) {
        return $dp.$DV($dp.$D(did));
    };

    var fnval = $.fn.val;
    $.fn.val = function () {
        var $this = this;

        if ($this.hasClass("Wdate") && arguments.length == 1) {

            var d = new Date(arguments[0]);
            var result = arguments[0];
            if (mac.Lang && mac.Lang == "en") {

                if (arguments[0].length == 7) {
                    result = d.format("MM/yyyy");
                } else if (arguments[0].length == 10) {
                    result = d.format("MM/dd/yyyy");
                } else if (arguments[0].length == 19) {
                    result = d.format("hh:mm:ss MM/dd/yyyy");
                }
                arguments[0] = result;

            } else if (mac.Lang && mac.Lang == "ja") {

                if (arguments[0].length == 7) {
                    result = d.format("yyyy/MM");
                } else if (arguments[0].length == 10) {
                    result = d.format("yyyy/MM/dd");
                } else if (arguments[0].length == 19) {
                    result = d.format("yyyy/MM/dd hh:mm:ss");
                }
                arguments[0] = result;

            }
        }

        if ($this.hasClass("Wdate") && !arguments.length) {

            var d = fnval.apply($this, arguments);

            var result = d;

            if (d && mac.Lang && (mac.Lang == "en" || mac.Lang == "ja")) {

                if (d.length == 7) {
                    result = d.substring(3, 7) + "-" + d.substring(0, 2);
                } else if (d.length == 10) {
                    result = new Date(d).format("yyyy-MM-dd");
                } else if (d.length == 19) {
                    result = new Date(d).format("yyyy-MM-dd hh:mm:ss");
                }
            }

            return result;
        } else {
            return fnval.apply($this, arguments);
        }
    }

})(jQuery);