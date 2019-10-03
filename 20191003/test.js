var Site = /** @class */ (function () {
    function Site() {
    }
    Site.prototype.name = function () {
        console.log('hello');
    };
    return Site;
}());
var obj = new Site();
obj.name();
