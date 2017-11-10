/**
 * Created by PL02053 on 2016/3/10.
 */
define("Employee", function () {
    return function Employee(first, last) {
        this.first = first;
        this.last = last;

        this.showName = function () {
            return this.first + " " + this.last;
        }
    };
});