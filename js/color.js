/*Dynamic color Setter
  primarycolor    class for elements with the primary color as background
  secondarycolor    class for elements with the secondary color as background
  themecolor    class for elements with the theme color as background

  primarycolorhover    class for elements with the primary color hover effect
  secondarycolorhover    class for elements with the secondary color hover effect
  themecolorhover    class for elements with the theme color  hover effect

  white    class for elements with white font
  black    class for elements with black font

  grey     class for elements with gray font [, will change to white if the background is grey]

  activeprimary   sets a right border with 4px and the primary color and a brighter background  to the element
*/
function addDynamicColors(primaryColor, secondaryColor, themeColor)
{
    $("#dynamiccolors").html(
        ".primarycolor{background-color:" + parseToCSSColor(primaryColor) + "; color: " + calculateFontColorForBackground(primaryColor)
        + ";}.secondarycolor{background-color:" + parseToCSSColor(secondaryColor) + "; color: " + calculateFontColorForBackground(secondaryColor)
        + ";}.themecolor{background-color:" + parseToCSSColor(themeColor) + "; color: " + calculateFontColorForBackground(themeColor)
        + ";}.primarycolorhover:hover{background-color:" + getNewBrightnessColor(rgbToHex(primaryColor[0], primaryColor[1], primaryColor[2]), calculateBrightness(primaryColor)) + "; color: " + calculateFontColorForBackground(hexToRgb(getNewBrightnessColor(rgbToHex(primaryColor[0], primaryColor[1], primaryColor[2]), calculateBrightness(primaryColor))))
        + ";}.secondarycolorhover:hover{background-color:" + getNewBrightnessColor(rgbToHex(secondaryColor[0], secondaryColor[1], secondaryColor[2]), calculateBrightness(secondaryColor)) + "; color: " + calculateFontColorForBackground(hexToRgb(getNewBrightnessColor(rgbToHex(secondaryColor[0], secondaryColor[1], secondaryColor[2]), calculateBrightness(secondaryColor))))
        + ";}.hoversecondary:hover{background-color:" + parseToCSSColor(secondaryColor) + "; color: " + calculateFontColorForBackground(secondaryColor)
        + ";}.themecolorhover:hover{background-color:" + getNewBrightnessColor(rgbToHex(themeColor[0], themeColor[1], themeColor[2]), calculateBrightness(themeColor)) + "; color: " + calculateFontColorForBackground(hexToRgb(getNewBrightnessColor(rgbToHex(themeColor[0], themeColor[1], themeColor[2]), calculateBrightness(themeColor))))
        + ";}.activeprimary{border-right: 4px solid " + parseToCSSColor(primaryColor) + "; background-color:" + getNewBrightnessColor(rgbToHex(secondaryColor[0], secondaryColor[1], secondaryColor[2]), calculateBrightness(secondaryColor)) + "; color: " + calculateFontColorForBackground(hexToRgb(getNewBrightnessColor(rgbToHex(secondaryColor[0], secondaryColor[1], secondaryColor[2]), calculateBrightness(secondaryColor))))
        + ";}.activeinputprimary{border-bottom: 1px solid " + parseToCSSColor(primaryColor)
        + ";}");
}
function calculateBrightness(colorArray)
{
    return 70;
}
function parseToCSSColor(colorArray)
{
    return 'rgb(' + colorArray[0] + ',' + colorArray[1] + ',' + colorArray[2] + ')'
}
function calculateFontColorForBackground(colorArray)
{
    var o = Math.round(((parseInt(colorArray[0]) * 299) + (parseInt(colorArray[1]) * 587) + (parseInt(colorArray[2]) * 114)) / 1000);
    if (o > 125)
    {
        return '#666666';
    }
    else
    {
        return '#DEDEDE';
    }
}
function rgbToHex(r, g, b)
{
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function componentToHex(c)
{
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function hexToRgb(hex)
{
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}
function getNewBrightnessColor(rgbcode, brightness)
{
    var r = parseInt(rgbcode.slice(1, 3), 16),
        g = parseInt(rgbcode.slice(3, 5), 16),
        b = parseInt(rgbcode.slice(5, 7), 16),
        HSL = rgbToHsl(r, g, b),
        RGB;

    $('#original_brightness').text(HSL[2] * 100);

    RGB = hslToRgb(HSL[0], HSL[1], brightness / 100);
    rgbcode = '#'
        + convertToTwoDigitHexCodeFromDecimal(RGB[0])
        + convertToTwoDigitHexCodeFromDecimal(RGB[1])
        + convertToTwoDigitHexCodeFromDecimal(RGB[2]);

    return rgbcode;
}
function convertToTwoDigitHexCodeFromDecimal(decimal)
{
    var code = Math.round(decimal).toString(16);

    (code.length > 1) || (code = '0' + code);
    return code;
}
function rgbToHsl(r, g, b)
{
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min)
    {
        h = s = 0; // achromatic
    } else
    {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max)
        {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}
function hslToRgb(h, s, l)
{
    var r, g, b;

    if (s == 0)
    {
        r = g = b = l;
    } else
    {
        function hue2rgb(p, q, t)
        {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
}