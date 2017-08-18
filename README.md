# Comma Separated Number
JQuery plugin to convert any text input to a number input with comma separate display

### Basic usage
```html
<input type="text">
```
```javascript
$('input').commaSeparatedNumber()

// or pass config options
$('input').commaSeparatedNumber({
	allowedChars: "bmk",
	allowDecimals: true
})
```
### Options

|Option|Description|Possible values|Default|                   
|------|-----------|---------------|-------|                    
|allowedChars| String of allowed chars| strings made up of b, m, k| `"bmk"`|              
|allowDecimal| Allow decimal numbers to be input| `true`, `false`| `true`|          
