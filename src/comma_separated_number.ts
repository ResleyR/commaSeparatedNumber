class CommaSeparatedNumber {
    element: JQuery
	options: object
	
	const defaults: object = {
		allowedChars: "bmk",
		allowDecimal: true
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
		var regexString = "[^\\d," 
		if (this.options.allowDecimal) {
			regexString += "."
		}
		regexString += this.options.allowedChars + "]"
		this.regex = new RegExp(regexString, "i")
	}
    
	validateInput(e) {
        var char = e.type === 'keypress'
            ? String.fromCharCode(e.keyCode || e.which)
            : e.originalEvent.clipboardData.getData("Text")

        // if the input is invalid, just discard it
		if(this.regex.test(char) || causesMultipleDecimals(char)) {
      e.preventDefault()
      e.stopImmediatePropagation()

		}
    }

	causesMultipleDecimals(char) {
	return /.*\..*\..*/.test($(this.element).val() + char)
	}
    cleanInput() {
        var selectionStart: number = this.element.selectionStart
        var selectionEnd: number = this.element.selectionEnd
        var value: string = $(this.element).val()
        var oldLength: number = value.length
        value = value
            .replace(/,/g, '')                        // remove previously added commas
            .replace(/b/gi, 'mk')                     // replace b with mk so that it becomes 9 zeros in the next step
            .replace(/m/gi, 'kk')                     // replace m with kk so that it becomes 6 zeros in the next step
            .replace(/k/gi, '000')                    // replace each k with 3 zeros
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")    // add a comma in the position of 3 digits having 1 digit before them
        var diff: number = value.length - oldLength
        $(this.element).val(value)
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
