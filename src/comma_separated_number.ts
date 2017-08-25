class CommaSeparatedNumber {
    element: Element
	options: object
	
	const defaults: object = {
		allowedChars: "bmk",
		allowDecimal: true,
		allowNegative: true,
		maxDecimals: null,
		distanceBetweenCommas: 3
	}
	constructor(element, options = {}) {
        this.element = element
		this.updateOptions(options)
        this.element.addEventListener('keypress', (e) => this.validateInput(e))
        this.element.addEventListener('paste', (e) => this.validateInput(e))
        this.element.addEventListener('input', (e) => this.cleanInput(e))
		this.cleanInput()
    }
	
	updateOptions(options) {
		this.options = $.extend(this.options, this.defaults, options)
		var regexString = "[^\\d"  + this.options.allowedChars
		if (this.options.allowDecimal) {
			regexString += "."
		}
		if (this.options.allowNegative) {
			regexString += "-"
		}
		regexString += "]"
		this.regex = new RegExp(regexString, "i")

		regexString = "\\B(?=(\\d{" + this.options.distanceBetweenCommas + "})+(?!\\d))"
		this.commaRegex = new RegExp(regexString, "g")

		regexString = "(-?\\d+(?:\\.\\d{" + this.options.maxDecimals + "}))\\d*"
		this.maxDecimalsRegex = new RegExp(regexString)
	}
    
	validateInput(e) {
        var char = e.type === 'keypress'
            ? String.fromCharCode(e.keyCode || e.which)
            : e.originalEvent.clipboardData.getData("Text")

        // if the input is invalid, just discard it
		if(this.isInputInvalid(char) {
			e.preventDefault()
			e.stopImmediatePropagation()
		}
    }

	isInputInvalid(char) {
		if(this.regex.test(char) {
			return true
		}
		switch(char) {
			case ".":  return this.causesMultipleDecimals()
			case "-": return !this.isValidNegativeSign()
			default: return false
		}
	}

	causesMultipleDecimals() {
		return /.*\..*\..*/.test($(this.element).val() + ".")
	}

	isValidNegativeSign() {
		return this.element.selectionStart === 0 && this.element.value.substr(0, 1) !== "-"
	}

    cleanInput() {
        var selectionStart: number = this.element.selectionStart
        var selectionEnd: number = this.element.selectionEnd
        var value: string = this.element.value
        var oldLength: number = value.length
        value = value
            .replace(/,/, '')                         // remove previously added commas
            .replace(/b/gi, 'mk')                     // replace b with mk so that it becomes 9 zeros in the next step
            .replace(/m/gi, 'kk')                     // replace m with kk so that it becomes 6 zeros in the next step
            .replace(/k/gi, '000')                    // replace each k with 3 zeros
		if (this.options.allowDecimal && this.options.maxDecimals !== null) {
			value = value.replace(this.maxDecimalsRegex, "$1")    // truncate to maxDecimals decimal places
		}
		
		this.element.setAttribute('data-value', value)
		value = value.replace(this.commaRegex, ",")           // add a comma before every distanceBetweenCommas digits
        var diff: number = value.length - oldLength
        this.element.value = value
        this.element.setSelectionRange(selectionStart + diff, selectionEnd + diff)
    }
}

function commaSeparatedNumber(option, ...args) {
  function reducer(ret, next) {
    const $this = $(next);
    const existingData = $this.data('comma-separated-number');
    const data = existingData || new CommaSeparatedNumber(next, option);
    if (!existingData) {
      $this.data('comma-separated-number', data)
	} else {
		data.updateOptions(option)
	}
    if (typeof option === 'string') {
      return data[option](...args)
    }
    return ret
  }
  return Array.prototype.reduce.call(this, reducer, this)
}
$.fn.commaSeparatedNumber = commaSeparatedNumber
$.fn.commaSeparatedNumber.Constructor = CommaSeparatedNumber
