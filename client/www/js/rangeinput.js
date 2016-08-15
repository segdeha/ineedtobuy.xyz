/* jshint esversion: 6 */
/**
 * RangeInput
 * @requires jQuery
 */
var RangeInput = (function (window, document, $, undefined) {

    /**
     * @constructor
     */
    function RangeInput(name) {
        this.name = name || 'number-of-days';
        this.rangeInput = document.querySelector(`[name="${name}"]`);
        this.rangeValue = document.getElementById(name);
        this.rangeInput.addEventListener('input', this.handleInput.bind(this));
    }

    var proto = RangeInput.prototype;

    proto.handleInput = function (evt) {
        this.update.call(this);
    };

    proto.update = function () {
        this.rangeValue.innerHTML = this.rangeInput.value;
    };

    return RangeInput;

}(this, this.document, jQuery));
