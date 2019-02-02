/*
var obj = {}


expression(obj);
*/
function expression(obj){
    preferences.rulerUnits = Units.PIXELS;
    var images = obj;
    
    
    images.begin = function(){ 
        this.color = 0;
        documents.add(this.w,this.h);
        fillout_color([0,0,0]);
        this.set = activeDocument.layerSets.add();//レイヤーセット追加    
    }

    images.fillout = function(){
            this.fill_image();
            activeDocument.selection.deselect();
            this.option();
            this.get_HSB();
    }
    
    images.get_HSB = function(){
        
          if(this.random_color){
                this.color = (Math.random()+Math.random())*360;
          }else{
                this.color += 10;
          }
      
    }//get_HSB


    images.fill_image = function(){
        if(this.color_type==="RGB"){
                return this.make_RGB_color();//選択範囲がなかったらfalseを返して処理を止める
        }else{
                return this.make_HSB_color();
        }
    }// fill_image


    images.option = function (){
        if(this.blur){
            app.activeDocument.activeLayer.applyGaussianBlur(this.blur_num);
            this.blur_num += this.blur_step;
        }
        activeDocument.activeLayer.opacity = this.opacity;
        
    }//option


    images.make_HSB_color = function (){
    
    if(!checkSelection()){ return;}    
    
    obj = new SolidColor();
    obj.hsb.hue = this.color;
    obj.hsb.brightness = 50;
    obj.hsb.saturation = 100;

    if(this.type==="stroke"){
        app.activeDocument.selection.stroke(obj,this.stroke_line,StrokeLocation.CENTER);       
    }else{
        activeDocument.selection.fill(obj,ColorBlendMode.NORMAL, 100, false);    
     }
        return true;    
    

}//make_HSB_color

images.make_RGB_color = function(rgb,type,stroke_line){
    if(!checkSelection()){ return;}  
    
    if(this.mono_color){//mono color オプション
            switch (this.hue_type){
            case "red":   
            this.rgb = [random_color(),random_color()/5,random_color()/8];
            break;
            
            case "green":
            this.rgb = [random_color()/8,random_color(),random_color()/5];
            break;
            
            case "blue":
            this.rgb = [random_color()/8,random_color()/5,random_color()];
            break;
            
            default:
            break;
            }
     }
    
    type = type ? type: this.type;
    rgb = rgb ? rgb : this.rgb;//引数に値がtrueなら引数の値を使う、undefinedならthisの値
    stroke_line = stroke_line ? stroke_line : this.stroke_line;
     
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

function random_color(n){
return Math.floor(255*Math.random());    
    }

    }//make_RGB_color

images.follow_line = function (){
    if(!checkSelection()){ return;}    
    
    rgbObj = new SolidColor();
    rgbObj.rgb.red = this.rgb[0];
    rgbObj.rgb.green = this.rgb[1];
    rgbObj.rgb.blue = this.rgb[2];
    app.activeDocument.selection.stroke(rgbObj,this.stroke_line,StrokeLocation.CENTER);
    } //images.stroke_line

function checkSelection(){
var flag = true;
try {
var bound  = app.activeDocument.selection.bounds;
}catch(e){
flag = false;

}
return flag;
}   //checkSelection

 
function make_square(top,left,bottom,right){
//[[x1,y1],[x2,y2],[x3,y3],[x4,y4]]
left = left ? left : top;
right = right ? right: bottom;

selReg = [[top,left],[top,right],[bottom,right],[bottom,left]];
activeDocument.selection.select(selReg);
} //make_square
 

    
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
}//makeCircle

function fillout_color(rgb){
        RGBColor = new SolidColor();
        RGBColor.red = rgb[0];
        RGBColor.green = rgb[1];
        RGBColor.blue = rgb[2];
        activeDocument.selection.fill(RGBColor,ColorBlendMode.NORMAL, 100, false);
        activeDocument.selection.deselect();
    }//end of fillout_color   




var square =  inherit(images);
var particle = inherit (images);
var line = inherit(images);
var flare = inherit (images);
var circle = inherit(images);
var ripple = inherit (images);


    ripple.rendaling = function(){
    this.begin(); 
     
    for(var i=0;i<this.particles.length;i++){
            this.piece = activeDocument.artLayers.add();  
                    activeDocument.activeLayer.blendMode = BlendMode.SCREEN;
                    makeCircle(this.particles[i].w, 
                                     this.particles[i].h,
                                     this.particles[i].w+this.particles[i].size, 
                                     this.particles[i].h+this.particles[i].size,true);
                     if(this.ellipse){  app.activeDocument.selection.resizeBoundary(100,30);   }  //楕円型に縦方向のみ縮小              
                    this.fill_image();
                    this.make_RGB_color([255,255,255],"stroke",this.stroke_line/1.5);
                    activeDocument.selection.deselect(); 
                    this.option();    
                    this.get_HSB();
                    this.piece.move(this.set,ElementPlacement.INSIDE);//レイヤーをレイヤーセットに移動                  
        
    } 
}


    square.rendaling = function(){
        this.begin();
        for(var i=0;i<this.squares.length;i++){
            this.piece = activeDocument.artLayers.add();  
            selReg = [[this.squares[i][0][0],
                            this.squares[i][0][1]],
                            [this.squares[i][1][0],
                            this.squares[i][1][1]],
                            [this.squares[i][2][0],
                            this.squares[i][2][1]],
                            [this.squares[i][3][0],
                            this.squares[i][3][1]]];
           activeDocument.selection.select(selReg);
           this.fill_image();
           activeDocument.selection.deselect();
           this.option();
           this.get_HSB();
           this.piece.move(this.set,ElementPlacement.INSIDE);//レイヤーをレイヤーセットに移動
        }
    }/*============transform==============*/



 
    particle.rendaling = function(next){
            if(!this.next||this.next===undefined){ this.begin(); }
            else{
                this.color = 0;
                this.set = activeDocument.layerSets.add();//レイヤーセット追加    
                }//beginメソッドを使用しない場合はcolor変数を事前に宣言
            
            
            for(var i=0;i<this.particles.length;i++){
                    this.piece = activeDocument.artLayers.add();  
                    activeDocument.activeLayer.blendMode = BlendMode.SCREEN;
                    makeCircle(this.particles[i].w, 
                                     this.particles[i].h,
                                     this.particles[i].w+this.particles[i].size, 
                                     this.particles[i].h+this.particles[i].size,true);
                    this.fill_image();
                    this.get_HSB();
                    activeDocument.selection.deselect(); 
                    this.option();              
                    this.piece.move(this.set,ElementPlacement.INSIDE);//レイヤーをレイヤーセットに移動 
            }
    }

    circle.rendaling = function(){
            
            this.begin();
            for(var i=0;i<this.particles.length;i++){
                    this.piece = activeDocument.artLayers.add();  
                    activeDocument.activeLayer.blendMode = BlendMode.SCREEN;
                    makeCircle(this.particles[i].w, 
                                     this.particles[i].h,
                                     this.particles[i].w+this.particles[i].size, 
                                     this.particles[i].h+this.particles[i].size,true);
                    app.activeDocument.selection.resizeBoundary(100,50);            
                    this.fill_image();
                    this.get_HSB();
                    activeDocument.selection.deselect(); 
                    makeCircle(this.particles[i].w, 
                                     this.particles[i].h,
                                     this.particles[i].w+this.particles[i].size, 
                                     this.particles[i].h+this.particles[i].size,true);
                    app.activeDocument.selection.resizeBoundary(100,50);        
                    this.make_RGB_color([255,255,255],"stroke",this.stroke_line/2);
                    activeDocument.selection.deselect(); 
                    this.option();      
                    this.piece.move(this.set,ElementPlacement.INSIDE);//レイヤーをレイヤーセットに移動
            }
    }

    line.rendaling = function(){
            this.begin();
            for(var i=0;i<this.point.length;i++){
                    this.piece = activeDocument.artLayers.add();
             
                for(var j=0;j<this.point[i].length;j+=this.carve_gap){
                        make_square(j,this.point[i][j],j+this.size,this.point[i][j]+this.size);
                        if(!this.fill_image()){
                            j+=w;
                            continue;
                        }
            this.get_HSB();
            activeDocument.selection.deselect(); 
            this.option();
            this.piece.move(this.set,ElementPlacement.INSIDE);//レイヤーをレイヤーセットに移動
            }
    }
}

flare.rendaling = function(){
this.begin();

    for(var i=0;i<this.particles.length;i++){
        this.piece = activeDocument.artLayers.add();
        activeDocument.activeLayer.blendMode = BlendMode.SCREEN;
        makeCircle(this.particles[i].w, 
                                     this.particles[i].h,
                                     this.particles[i].w+this.particles[i].size, 
                                     this.particles[i].h+this.particles[i].size,true);
        this.fill_image ();
        makeCircle(this.particles[i].w, 
                                     this.particles[i].h,
                                     this.particles[i].w+this.particles[i].size, 
                                     this.particles[i].h+this.particles[i].size,true);
        app.activeDocument.selection.resizeBoundary(70,70);
        this.make_RGB_color([255,255,255]);
        activeDocument.selection.deselect();      
        app.activeDocument.activeLayer.applyGaussianBlur(15);
        this.get_HSB();
        this.piece.move(this.set,ElementPlacement.INSIDE);//レイヤーをレイヤーセットに移動
    }    
        
}

switch (images.name){
        case "line":
        line.rendaling();
        break;
        
        case "Particles":
        particle.rendaling();
        break;
        
        case "create_space":
        particle.create_space();
        break;
        
        case "ripples":
        ripple.rendaling();
        break;
        
        case "Squares":
        square.rendaling();
        break;
        
        case"Flare":
        flare.rendaling();
        break;
        
        default:
        alert ("error");
        return;
    }

//-------------------------------------------------------------ECMA3用オブジェクト継承関数（ECMA5createとほとんど同じ）
function inherit(p){
    if(p==null)throw TypeError();
    if(Object.create)
    return Object.create(p);
    var t = typeof p;
    if(t !== "object" && t !== "function")throw TypeError();
    function f(){};
    f.prototype = p;
    return new f ();
    
    }
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

}