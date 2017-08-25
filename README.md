# Comma Separated Number
JQuery plugin to convert any text input to a number input with comma separate display.         
Additionally it allows for certain characters to be entered as shortcuts for numbers.           
For example, if the user types in `1k` it is converted to `1,000`.           
To get the value without the comma use the `data-value` attribute.                  

### Basic usage
```html
<input type="text" value="12k>
```
```javascript
$('input').commaSeparatedNumber()

// or pass config options
$('input').commaSeparatedNumber({
	allowedChars: "bmk",
	allowDecimals: true
})

parseFloat($('input').data('value')) // 12000
```
### Options

|Option|Description|Possible values|Default|                   
|------|-----------|---------------|-------|                    
|allowedChars| String of allowed chars which are auto replaced with numbers| strings made up of b, m, k| `"bmk"`|              
|allowDecimal| Allow decimal numbers to be input| true, false| `true`|          
|allowNegative| Allow negative numbers to be input| true, false| `true`|          
|maxDecimals| Maximum digits allowed after the decimal point. (applicable only if `allowDecial` is `true`| int or null| `null`|          
|distanceBetweenCommas| The number of digits after which a comma must be added| int | `3`|          

**Note:** The letter k, m & b are replaced with `000` (thousands), `000000` (millions) & `000000000` (billions) respectively.                 


### Contributing

Please feel free to add to this project, specially if you can write tests.      
I am not a JavaScript developer and can't get my tests running, but plugin works fine when tested manually.