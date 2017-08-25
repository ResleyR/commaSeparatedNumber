var CommaSeparatedNumber = (function () {
    function CommaSeparatedNumber(element, options) {
        if (typeof options === "undefined") { options = {
        }; }
        var _this = this;
        this.defaults = {
            allowedChars: "bmk",
            allowDecimal: true,
            allowNegative: true,
            maxDecimals: null,
            distanceBetweenCommas: 3
        };
        this.element = element;
        this.updateOptions(options);
        this.element.addEventListener('keypress', function (e) {
            return _this.validateInput(e);
        });
        this.element.addEventListener('paste', function (e) {
            return _this.validateInput(e);
        });
        this.element.addEventListener('input', function (e) {
            return _this.cleanInput(e);
        });
        this.cleanInput();
    }
    CommaSeparatedNumber.prototype.updateOptions = function (options) {
        this.options = $.extend(this.options, this.defaults, options);
        var regexString = "[^\\d" + this.options.allowedChars;
        if(this.options.allowDecimal) {
            regexString += ".";
        }
        if(this.options.allowNegative) {
            regexString += "-";
        }
        regexString += "]";
        this.regex = new RegExp(regexString, "i");
        regexString = "\\B(?=(\\d{" + this.options.distanceBetweenCommas + "})+(?!\\d))";
        this.commaRegex = new RegExp(regexString, "g");
        regexString = "(-?\\d+(?:\\.\\d{" + this.options.maxDecimals + "}))\\d*";
        this.maxDecimalsRegex = new RegExp(regexString);
    };
    CommaSeparatedNumber.prototype.validateInput = function (e) {
        var char = e.type === 'keypress' ? String.fromCharCode(e.keyCode || e.which) : e.originalEvent.clipboardData.getData("Text");
        if(this.isInputInvalid(char)) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    };
    CommaSeparatedNumber.prototype.isInputInvalid = function (char) {
        if(this.regex.test(char)) {
            return true;
        }
        switch(char) {
            case ".": {
                return this.causesMultipleDecimals();

            }
            case "-": {
                return !this.isValidNegativeSign();

            }
            default: {
                return false;

            }
        }
    };
    CommaSeparatedNumber.prototype.causesMultipleDecimals = function () {
        return /.*\..*\..*/.test($(this.element).val() + ".");
    };
    CommaSeparatedNumber.prototype.isValidNegativeSign = function () {
        return this.element.selectionStart === 0 && this.element.value.substr(0, 1) !== "-";
    };
    CommaSeparatedNumber.prototype.cleanInput = function () {
        var selectionStart = this.element.selectionStart;
        var selectionEnd = this.element.selectionEnd;
        var value = this.element.value;
        var oldLength = value.length;
        value = value.replace(/,/, '').replace(/b/gi, 'mk').replace(/m/gi, 'kk').replace(/k/gi, '000');
        if(this.options.allowDecimal && this.options.maxDecimals !== null) {
            value = value.replace(this.maxDecimalsRegex, "$1");
        }
        this.element.setAttribute('data-value', value);
        value = value.replace(this.commaRegex, ",");
        var diff = value.length - oldLength;
        this.element.value = value;
        this.element.setSelectionRange(selectionStart + diff, selectionEnd + diff);
    };
    return CommaSeparatedNumber;
})();
function commaSeparatedNumber(option) {
    var args = [];
    for (var _i = 0; _i < (arguments.length - 1); _i++) {
        args[_i] = arguments[_i + 1];
    }
    function reducer(ret, next) {
        ;
        $this = $(next);
        ;
        existingData = $this.data('comma-separated-number');
        ;
        data = existingData || new CommaSeparatedNumber(next, option);
        if(!existingData) {
            $this.data('comma-separated-number', data);
        } else {
            data.updateOptions(option);
        }
        if(typeof option === 'string') {
            return data[option]();
        }
        return ret;
    }
    return Array.prototype.reduce.call(this, reducer, this);
}
$.fn.commaSeparatedNumber = commaSeparatedNumber;
$.fn.commaSeparatedNumber.Constructor = CommaSeparatedNumber;
$(function () {
    $('input').commaSeparatedNumber({
        maxDecimals: 4
    });
    $('button').on('click', function () {
        console.log($('input').data('value'));
    });
});