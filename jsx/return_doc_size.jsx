(function(){

function get_doc(){

preferences.rulerUnits = Units.PIXELS;

var w = activeDocument.width.value;
var h = activeDocument.height.value;

obj = {
w:w,
h:h
    }

return obj;

}
//var f = get_doc();
alert ("ss");
//return JSON.stringify(f);
})();