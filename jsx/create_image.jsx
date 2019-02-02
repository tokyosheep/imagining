/*
#include  "include/make_circle.jsx"
#include  "include/new_doc.jsx"
#include "include/hsb_color.jsx"
#include "include/make_square.jsx"
#include "include/fill_color.jsx"
cepと通信する場合はincludeは使用できない
*/


function transform(obj){
    preferences.rulerUnits = Units.PIXELS;
    documents.add(obj.w,obj.h);
    fillout_color([0,0,0]);
    var color = 0; 
    for(var i=0;i<obj.squares.length;i++){
            var piece = activeDocument.artLayers.add();  
            selReg = [[obj.squares[i][0][0],
                            obj.squares[i][0][1]],
                            [obj.squares[i][1][0],
                            obj.squares[i][1][1]],
                            [obj.squares[i][2][0],
                            obj.squares[i][2][1]],
                            [obj.squares[i][3][0],
                            obj.squares[i][3][1]]];
            activeDocument.selection.select(selReg);
            fill_image(obj,color,"stroke",1);
            activeDocument.selection.deselect();
            option(obj);
            color = get_HSB(obj);
    }
}


function particle_rendaling(obj){
     preferences.rulerUnits = Units.PIXELS;
     documents.add(obj.w,obj.h);
    
        var color = 0;
    
          fillout_color([0,0,0]);
          
          
    for(var i=0;i<obj.particles.length;i++){
          var piece = activeDocument.artLayers.add();  
          activeDocument.activeLayer.blendMode = BlendMode.SCREEN;
          makeCircle(obj.particles[i].w, 
                            obj.particles[i].h,
                            obj.particles[i].w+obj.particles[i].size, 
                            obj.particles[i].h+obj.particles[i].size,true);
          fill_image(obj,color);
          color = get_HSB(obj);
          activeDocument.selection.deselect(); 
          option(obj);
          
    }
}

function get_HSB(obj){
          if(obj.random_color){
                color = (Math.random()+Math.random())*360;
          }else{
                color += 10;
          }
      return color;
    }

function make_lines(obj){
        preferences.rulerUnits = Units.PIXELS;
        documents.add(obj.w,obj.h);
    
        var color = 0;
    
        fillout_color([0,0,0]);
    
    for(var i=0;i<obj.point.length;i++){
             var piece = activeDocument.artLayers.add();
             
             for(var j=0;j<obj.point[i].length;j+=obj.carve_gap){
                    make_square(j,obj.point[i][j],j+obj.size,obj.point[i][j]+obj.size);
                    if(!fill_image(obj,color,"fill")){
                        j+=w;
                        continue;
                    }
        color = get_HSB(obj);
        activeDocument.selection.deselect(); 
        option(obj);
        
    }

}
}


function fill_image(obj,color,type,stroke_line){
    if(obj.color_type==="RGB"){
            return make_RGB_color(obj.rgb,type,stroke_line);
      }else{
            return make_HSB_color(color,type,stroke_line);
      }
}


function option(obj){
    if(obj.blur){
            app.activeDocument.activeLayer.applyGaussianBlur(obj.blur_num);
            obj.blur_num += obj.blur_step;
     }
    activeDocument.activeLayer.opacity = obj.opacity;
}


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
    

}

function make_RGB_color(rgb,type,stroke_line){
    if(!checkSelection()){ return;}    
    
    rgbObj = new SolidColor();
    rgbObj.rgb.red = rgb[0];
    rgbObj.rgb.green = rgb[1];
    rgbObj.rgb.blue = rgb[2];
    
    if(type==="stroke"){
    app.activeDocument.selection.stroke(rgbObj,stroke_line,StrokeLocation.CENTER);       
    }else{
     activeDocument.selection.fill(rgbObj,ColorBlendMode.NORMAL, 100, false);    
     }
return true;

    }

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

function flare(){
preferences.rulerUnits = Units.PIXELS;
documents.add(1000,1000);
fillout_color([0,0,0]);
var w = activeDocument.width.value;
var h = activeDocument.height.value;  
var color = 0; 
var left = 50;
var right = 250;

for(var i=0;i<3;i++){
     var piece = activeDocument.artLayers.add();
    activeDocument.activeLayer.blendMode = BlendMode.SCREEN;
    makeCircle(left,undefined,right,undefined,true);
    make_HSB_color(color,"fill");
    makeCircle(left,undefined,right,undefined,true);
    app.activeDocument.selection.resizeBoundary(70,70);
    make_RGB_color([255,255,255],"fill");
    activeDocument.selection.deselect();      
    app.activeDocument.activeLayer.applyGaussianBlur(15);
     color += 10;   
    }

}

function shining(){
preferences.rulerUnits = Units.PIXELS;
var w = activeDocument.width.value;
var h = activeDocument.height.value;

for(var i=0;i<150;i++){
var piece = activeDocument.artLayers.add();
make_square(w/50+i*5,h/2-(h/1000)+i*5,w-(w/50)+i*5,h/2+(h/1000)+i*5);
make_RGB_color([0,0,0],"fill");
activeDocument.selection.deselect(); 
app.activeDocument.activeLayer.rotate(i);
}

}
    
function make_square(top,left,bottom,right){
//[[x1,y1],[x2,y2],[x3,y3],[x4,y4]]
left = left ? left : top;
right = right ? right: bottom;

selReg = [[top,left],[top,right],[bottom,right],[bottom,left]];
activeDocument.selection.select(selReg);
}


/*make_triangle(600,300,300,"recursion",6);  フラクタル三角形作成*/

function make_triangle(size,px,py,type,level){
preferences.rulerUnits = Units.PIXELS;
documents.add(1000,1000);    
    
var height = size * Math.sin(60*Math.PI/180);

if(type==="recursion"){
    recursion(level,0+px,height+py,size/2+px,0+py,size+px,height+py);
    }
drawing(0+px,height+py,size/2+px,0+py,size+px,height+py);
var rgb = [0,0,0];
stroke_line(rgb,2);

    }/*=====================*/

function drawing(x1,y1,x2,y2,x3,y3){
    selReg = [[x1,y1],[x2,y2],[x3,y3]];
    activeDocument.selection.select(selReg);
    return {x1 : x1,
                 y1 : y1,
                 x2 : x2,
                 y2 : y2,
                 x3 : x3,
                 y3 : y3}
    }

function recursion(level,
                             x1,y1,
                             x2,y2,
                             x3,y3){
    var rgb = [0,0,0];
    var t_data =drawing(x1,y1,x2,y2,x3,y3);
    stroke_line(rgb,2);
    
    if(level <= 0){
            return;
        }else{
            var nx1 = (t_data.x1 + t_data.x2)/2;
            var ny1 = (t_data.y1 + t_data.y2)/2;
            
            var nx2 = (t_data.x2 + t_data.x3)/2;
            var ny2 = (t_data.y2 + t_data.y3)/2;
            
            var nx3 = (t_data.x3 + t_data.x1)/2;
            var ny3 = (t_data.y3 + t_data.y1)/2;

            level = level -1;
            
            recursion(level,x1,y1,nx1,ny1,nx3,ny3);
            recursion(level,x2,y2,nx1,ny1,nx2,ny2);
            recursion(level,x3,y3,nx2,ny2,nx3,ny3);
            
       }
    }/*========================*/

function stroke_line(rgb,stroke_line){
    if(!checkSelection()){ return;}    
    
    rgbObj = new SolidColor();
    rgbObj.rgb.red = rgb[0];
    rgbObj.rgb.green = rgb[1];
    rgbObj.rgb.blue = rgb[2];
    app.activeDocument.selection.stroke(rgbObj,stroke_line,StrokeLocation.CENTER);
    }




function makeCircle(left,top,right,bottom,antiAlias){
    
   top = top ? top : left;
   bottom = bottom ? bottom : right;//top,bottomが未定義だったらleft,rigthと同じ値を代入

var circleSelection = charIDToTypeID( "setd" );
    var descriptor = new ActionDescriptor();
    var id71 = charIDToTypeID( "null" );
        var ref5 = new ActionReference();
        var id72 = charIDToTypeID( "Chnl" );
        var id73 = charIDToTypeID( "fsel" );
        ref5.putProperty( id72, id73 );
    descriptor.putReference( id71, ref5 );
    var id74 = charIDToTypeID( "T   " );
        var desc12 = new ActionDescriptor();

        var top1 = charIDToTypeID( "Top " );
        var top2 = charIDToTypeID( "#Pxl" );
        desc12.putUnitDouble( top1, top2, top );

        var left1 = charIDToTypeID( "Left" );
        var left2 = charIDToTypeID( "#Pxl" );
        desc12.putUnitDouble( left1, left2, left );

        var bottom1 = charIDToTypeID( "Btom" );
        var bottom2 = charIDToTypeID( "#Pxl" );
        desc12.putUnitDouble( bottom1, bottom2, bottom );

        var right1 = charIDToTypeID( "Rght" );
        var right2 = charIDToTypeID( "#Pxl" );
        desc12.putUnitDouble( right1, right2, right );

    var id83 = charIDToTypeID( "Elps" );
    descriptor.putObject( id74, id83, desc12 );
    var id84 = charIDToTypeID( "AntA" );
    descriptor.putBoolean( id84, antiAlias );
executeAction( circleSelection, descriptor, DialogModes.NO );
}

function fillout_color(rgb){
        RGBColor = new SolidColor();
        RGBColor.red = rgb[0];
        RGBColor.green = rgb[1];
        RGBColor.blue = rgb[2];
        activeDocument.selection.fill(RGBColor,ColorBlendMode.NORMAL, 100, false);
        activeDocument.selection.deselect();
    }//end of fillout_color    