/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/


function sayHello(){
    alert("hello from ExtendScript");
}

function get_doc(){

preferences.rulerUnits = Units.PIXELS;

var w = activeDocument.width.value;
var h = activeDocument.height.value;

obj = {
w:w,
h:h
    }
alert (obj.h);
return JSON.stringify(obj);

}