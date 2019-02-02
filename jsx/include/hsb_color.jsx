


function make_HSB_color(value,type,stroke_line){
    
if(!checkSelection()){ return;}    
    
obj = new SolidColor();
obj.hsb.hue = value;
obj.hsb.brightness = 50;
obj.hsb.saturation = 100;

if(type==="stroke"){
    app.activeDocument.selection.stroke(obj,stroke_line,StrokeLocation.CENTER);       
    }else{
     activeDocument.selection.fill(obj,ColorBlendMode.NORMAL, 100, false);    
     }
return true;    
    
function checkSelection()
{
var flag = true;
try {
var bound  = app.activeDocument.selection.bounds;
}catch(e){
flag = false;

}
return flag;
}    
    
    }

    