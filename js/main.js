/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

window.onload = function(){
    const csInterface = new CSInterface();
    const fs = require(`fs`);
    const https = require(`https`);
    const dir_home = process.env[process.platform == `win32` ? `USERPROFILE` : `HOME`];
    const dir_desktop = require(`path`).join(dir_home, `Desktop`);//デスクトップパス
    
    const return_doc_size = `return_doc_size.jsx`;
    const extensionId = csInterface.getExtensionID(); 
    const filePath = csInterface.getSystemPath(SystemPath.EXTENSION) +`/js/`;
    const toJSX = csInterface.getSystemPath(SystemPath.EXTENSION) +`/jsx/`;
    
    const rendaling = document.getElementById(`rendaling`);
    
    
    
    /*==================form　要素取得=====================*/
    const common = document.forms.common;
    
    const rgb_form = common.rgb
    const hue_type = common.hue_type;
    
    const particle_option = document.forms.particle_option.kind_bumb;
    const blur_button = document.getElementById(`blur`);
    
   
    const options = document.forms.options;
    
    const graph_option = document.getElementsByClassName(`graph_option`);
   
    loadJSX(`json2.js`);
    themeManager.init();
    noise.seed(Math.random());
    
     function loadJSX (fileName) {
        csInterface.evalScript(`$.evalFile("${toJSX + fileName}")`);
    }
   
    
    /*=================stop defalt drag and drop==================*/
   prevent_drag_event();
    
    /*=========================html interface object =========================================*/
    
    class Disable_event{
        constructor(elm,trigger){
            if(!Array.isArray(elm)){
                alert(`第一引数は配列です`);
                return ;
            }
            
            this.elm = elm;
            this.trigger = trigger;
            
            this.trigger.addEventListener(`change`,this,false);
        }
        
        handleEvent(){
            this.elm.forEach((v)=>{
                v.disabled = is_disabled(this.trigger.checked);
            }); 
            function is_disabled(elm){
                return !elm;
            }
        }
        
        add_event(elm){//追加で要素にイベントを追加したい場合のメソッド
            elm.addEventListener(`change`,this,false);
        }
    }
    
    const blurs = new Disable_event([common.blur_num,
                                     document.forms.options.blur_step],
                                    blur_button);
    
    const rgb_button = new Disable_event(Array.from(rgb_form),common.color[0]);
    rgb_button.add_event(common.color[1]);
    
    const monocolor_button = new Disable_event([common.mono_color],common.color[0]);
    monocolor_button.add_event(common.color[1]);
    
    const particle_select = new Disable_event([document.forms.particle_option.kind_bumb],common.type[1]);
    const effect_type = Array.from(common.type);
    effect_type.forEach((v,i)=>{
        if(i==1){
            return;  
        }else{
            particle_select.add_event(v);
        }
    });
    
    
    const position_option = new Disable_event(Array.from(document.forms.particle_option.position),
                                              common.type[1]);
    
    position_option.add_event(common.type[0]);
    position_option.add_event(common.type[2]);
    
    console.log(common.type[1].checked);
    
    /*===============monocolor option ==================*/
    const Complecated = function(){
        this.elm = Array.from(common.hue_type);
        this.first_trigger = common.mono_color;
        this.second_trigger = Array.from(common.color);
        this.first_trigger.addEventListener(`change`,this,false);
        this.second_trigger.forEach((v)=>{
           v.addEventListener(`change`,this,false); 
        });
    }
    
    Complecated.prototype.handleEvent = function(){
        this.elm.forEach((v)=>{
            v.disabled = isCheck_condition( this.first_trigger.checked,this.second_trigger[0].checked);   
        });
        
        function isCheck_condition(elm,elm2){
            return !(elm && elm2);
        }
    }
    
    const _monocolor = new Complecated();
    
    class Particle_options{
        constructor(){
            this.elm = Array.from(graph_option);
            this.trigger = Array.from(common.type);
            this.sub_trigger = document.forms.particle_option.kind_bumb;
            
            this.trigger.forEach((v)=>{
                v.addEventListener(`change`,this,false);
            });
            
            this.sub_trigger.addEventListener(`change`,this,false);
        }
        
        handleEvent(){
            let option_booleans = [false,false,false,false];//opacity pieces size stroke
            switch(common.type.value){
                case `line`:
                    option_booleans = [false,true,false,true];         
                    break;
                
                case `particle` :
                    option_booleans[3] = isStroke(document.forms.particle_option.kind_bumb.value); 
                    break;    
                    
                case `square`:
                    option_booleans[2] = true;
                    break;
                    
                    
                default:
                    return;
            }
            this.elm.forEach((v,i)=>{
                v.disabled = option_booleans[i];
            });
            
            function isStroke(value){
                return !(value === `ripples` || value === `ellipse`);
            }
        }
    }
    
    const limit_num = new Particle_options();
    
    /*=========================html interface object =========================================*/
    
   
    function adjust_point(point,func){
        return -point*func()+point*func();
    }
    
    
    
    function random_center(value){
        return (Math.random()+Math.random())/value;
    }
    
    function random_zero(){
        return Math.radom()*Math.random();
    }
    
    function random_futher_zero(){
        const r = Math.random();
        return r*r;
    }
    
    function random_sq(){
        return Math.sqrt(Math.random());
    }
    
    function calcNormal(){
        const r1 = Math.random();
        const r2 = Math.random();
        let value = Math.sqrt(-2.0 * Math.log(r1)) * Math.sin(2.0 * Math.PI * r2)
        value = (value * 3)/6;
        return value;
    }
    
    
    function set_color(){
        return  Array.from(common.rgb).map((v,i)=>{
           return parseFloat(v.value); 
        });
    }
    
    
    class Image_object{
        constructor(){
            this.color_type = common.color.value;
            this.rgb = set_color();
            this.mono_color = common.mono_color.checked;
            this.hue_type = common.hue_type.value;
            
            /*==========================basic===========================*/
            this.w = parseFloat(common.doc_w.value);
            this.h = parseFloat(common.doc_h.value);
            this.blur = common.blur.checked;
            this.blur_num = parseFloat(common.blur_num.value);
            this.opacity = parseFloat(common.opacity.value);
            this.pieces = parseFloat(common.pieces.value);
            this.size = parseFloat(common.size.value);
            this.stroke_line = parseFloat(common.stroke.value);
            
            /*=================option================*/
            //this.random_color = document.forms.options.random_color.checked; //ランダムの色指定とりあえず使用しない
            this.blur_step = (function(){
               if(document.forms.options.blur_step.checked){
                  return 0.1; 
               }else{
                  return 0; 
               } 
            })();
               
        }
    }
    
    
    
    
    class Carving_line extends Image_object{
        constructor(gap,
                    carve_gap,
                    angle){
            super();
            this.size = this.size/50;
            this.gap = gap*3;//繰り返しで線を描画する場合のずれの大きさ
            this.range = parseFloat(common.doc_h.value)/2;//上下の振動の大きさ
            this.carve_gap = carve_gap;//ピクセルの量と間隔
            this.angle = angle;//左右の振動の大きさ
            this.random = Math.random();
            this.apart = 70;
            this.blur_step = this.blur_step/100;
            
            this.pieces = 2;//処理が重すぎるので2で固定
            this.p = new Array(this.pieces).fill(0);
            this.name = `line`;
            
            
            
        }
        
        carving(){
            
            this.point = this.p.map((value,index)=>{
                let cycle = 0;
                let h_level = [];
                for(let i=0;i<this.w;i+= this.carve_gap){
                   const high = (this.h/2)+Math.sin(cycle)*this.range+(i/this.gap);
                   cycle += this.angle;
                   h_level[i] = high;
                }
                this.gap += this.gap;
                return h_level;
            });
        }
        
        parlinnoise(){
            this.point = this.p.map((value,index)=>{
                const coefficient = 50 +index;
                let cycle = 0;
                let h_level = [];
                for(let i=0;i<this.w;i+= this.carve_gap){
                    
                    const py = index/this.apart + this.random;
                    const high = (this.h/2)+noise.perlin2(py,cycle)*this.range+(i/this.gap);
                    cycle += this.angle;
                    h_level[i] = high;
                }
                this.gap += this.gap;
                return h_level;
            }); 
        }
    }
    
    class Particles extends Image_object{
        constructor(name,type){
            super();
            this.p = new Array(this.pieces).fill(0);//仮の数値で空の配列を満たす（空のままだとmap等のarray関数が使えないため）
            this.range = parseFloat(common.doc_h.value)/2;
            this.name = name;
            this.type = type;
            
            
            
            /*
            this.Object = function(w,h,size){
                this.doc_w = w;
                this.doc_h = h;
                this.doc_size = size;
            }
            
            this.Object.prototype.getstatus = function(range_w,range_h,random){
                this.w = adjust_point(range_w,random)+this.doc_w/2;
                this.h = adjust_point(range_h,random)+this.doc_h/2;
                this.size = Math.abs(adjust_point(this.doc_size,Math.random))+10;
                
                this.w = this.w - this.size/2;
                this.h = this.h - this.size/2;
            }
            */
            
            switch(document.forms.particle_option.position.value){
                case `dispersion`:
                    this.make_particle();
                    break;
                    
                case `holisontal`:
                    this.explotion_holizontal();
                    break;
                    
                case `center`:
                    this.explotion_center();
                    break;
                    
                case `more_cneter`:
                    this.more_center();
                    break;
                    
                case `explotion`:
                    this.explotion_flare();
                    break;
                    
                default:
                    alert(`the value is unclear`);
                    return; 
            }
        }
        
        set_blur(num){
            
            this.blur_num = num ? num : this.blur_num;
            
            this.blur = true;
            this.next = true;
        }
        
        make_particle(){
            this.particles = this.p.map((v,i)=>{
                const obj = {
                    w : adjust_point(this.w/2,Math.random)+this.w/2,
                    h : adjust_point(this.h/2,Math.random)+this.h/2,
                    size : Math.abs(adjust_point(this.size,Math.random))+10
                }
                obj.w = obj.w - obj.size/2;
                obj.h = obj.h - obj.size/2;
                return obj;//obj形式で値を返す
            });
        }
        
        explotion_center(){
            this.particles = this.p.map((v,i)=>{              
                const obj = {
                  w: adjust_point(this.w/2.5,random_futher_zero)+this.w/2,
                  h: adjust_point(this.h/2.5,random_futher_zero)+this.h/2,
                  size : Math.abs(adjust_point(this.size,Math.random))+10
                }
                obj.w = obj.w - obj.size/2;
                obj.h = obj.h - obj.size/2;
                return obj;
            });
        }
        
        more_center(){
            this.particles = this.p.map((v,i)=>{
                const obj = {
                    w : adjust_point(this.w/4,Math.random)+this.w/2,
                    h : adjust_point(this.h/4,Math.random)+this.h/2,
                    size : Math.abs(adjust_point(this.size,Math.random))+10
                }
                obj.w = obj.w - obj.size/2;
                obj.h = obj.h - obj.size/2;
                return obj;//obj形式で値を返す
            });
        }
        
        explotion_flare(){
            const px = this.w/2 - this.w;
            const py = this.h/2 - this.h;
            
            const far_from_center = Math.sqrt(px * px + py * py);
            this.particles = this.p.map((v,i)=>{
                const obj = {
                    w : adjust_point(this.w/2.5,Math.random)+this.w/2,
                    h : adjust_point(this.h/2.5,Math.random)+this.h/2,
                    size : this.size
                }
                const dx = this.w/2 - obj.w;
                const dy = this.h/2 - obj.h;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const ratio =  distance/far_from_center;
                obj.size = this.size*(1 - ratio);
                obj.w = obj.w - obj.size/2;
                obj.h = obj.h - obj.size/2;
                return obj;//obj形式で値を返す
            });
        }
        
        explotion_holizontal(){
            this.particles = this.p.map((v,i)=>{
               const obj = {
                   w: this.w*Math.random(),
                   h: adjust_point(this.h/20,random_futher_zero)+this.h/2,
                   size : Math.abs(adjust_point(this.size/1.5,Math.random))+5
               } 
               obj.w = obj.w - obj.size/2;
               obj.h = obj.h - obj.size/2;
               return obj;
            });
        }
        
        
    
    }
    
    class Flare extends Image_object{
        constructor(){
            super();
            this.p = new Array(this.pieces).fill(0);//仮の数値で空の配列を満たす（空のままだとmap等のarray関数が使えないため）
            this.range = parseFloat(common.doc_h.value)/4;
            this.name = `Flare`;
        }
        
        explotion(){
            this.particles = this.p.map((v,i)=>{
               const obj = {
                  w: this.w*random_center(2),
                  h: this.h*random_center(2),
                  size : Math.abs(adjust_point(this.size,Math.random))+10
               }
               return obj;
            });
        } 
    }
    
    class Squares extends Image_object{
        
        constructor(){
            super();
            this.p = new Array(this.pieces).fill(0);
            this.random = Math.random();
            this.name = `Squares`;
            this.type = `stroke`;
        }
        
        generate_random(){
            this.squares = this.p.map((v,i)=>{
                let bound = [];
                bound[0] = [this.w*Math.random() ,this.h*Math.random()];
                bound[1] = [this.w*Math.random() ,this.h/1.2];
                bound[2] = [this.w/1.2 ,this.h/1.2];
                bound[3] = [this.w/1.2 ,this.h*Math.random()];
                return bound;
            });
        }
        
        generate_parline(){
            let angle = 0;
            this.squares = this.p.map((v,i)=>{
                let bound = []; 
                bound[0] = [get_noise(this.w/10,this.h/10),
                            get_noise((this.w-100)/angle,(this.h-100)/angle)];
                bound[1] = [get_noise(this.w/1.2,this.h/10),
                            get_noise(this.w*i/2,this.h/angle)];
                bound[2] = [get_noise(this.w/1.2,this.h/1.2),
                            get_noise(this.w*i/2,this.h*i/2)];
                bound[3] = [get_noise(this.w/10,this.h/1.2),
                            get_noise((this.w-100)/angle,(this.h-100)*i/2)];
                angle += 0.02;
                return bound;
            });
            
            function get_noise(x,y){
                return Math.abs(noise.perlin2(x,y))*4000;
            }
        }
        
        trans_forming(){
            
            let init_w_top = this.w/8;
            let init_w_bottom = this.w/1.1;
            let init_h_top = this.h/8;
            let init_h_bottom = this.h/1.1;
            let perlin_x = 0;
            let perlin_y = 0;
            const ratio = 70;
            const ampitude = 200;
            
            const axis_w_top = init_w_top;
            const axis_h_top = init_h_top;
            const axis_w_bottom = init_w_bottom;
            const axis_h_bottom = init_h_bottom;
            let time_y = 0;
            let time_x = 0;
            this.squares = this.p.map((v,i)=>{
                let bound = []; 
                init_w_top = init_w_top - i*ratio;   
                init_h_top = init_h_top - i*ratio;
                init_w_bottom = init_w_bottom + i*ratio;
                init_h_bottom = init_h_bottom + i*ratio;
                
                
                bound[0] = get_noise(init_w_top,
                                     init_h_top,
                                     axis_w_top-time_x,
                                     axis_h_top-time_y);
                bound[1] = get_noise(init_w_bottom,
                                     init_h_top,
                                     axis_w_bottom,
                                     axis_h_top);
                bound[2] = get_noise(init_w_bottom,
                                     init_h_bottom,
                                     axis_w_bottom+time_x,
                                     axis_h_bottom);
                bound[3] = get_noise(init_w_top,
                                     init_h_bottom,
                                     axis_w_top,axis_h_bottom);
                time_y += 0.5; 
                time_x += 0.5;
                return bound;
            });
            
            function get_noise(x,y,axis_x,axis_h){
                const px = ampitude * noise.perlin2(x,y)+axis_x;
                const py = ampitude * noise.perlin2(x,y)+axis_h;
                return [px,py];
            }
        }
    }
    
    class Validation{
        constructor(){
            this.options = Array.from(graph_option).map((v)=>{
                return parseFloat(v.value);
            });
            
            this.doc_size = [common.doc_w.value,common.doc_h.value].map((v)=>{
                return parseFloat(v);
            }).reduce((x,y)=>{
                return x+y; 
            });
            
            console.log(this.doc_size);
            this.type = common.type.value;
            this.particle_type = document.forms.particle_option.kind_bumb.value;
            this.flag = [];
            
            if(this.type===`particle` && this.particle_type===`create_space`){
                this.options[1] = this.options[1]*3;
            }
            
        }
        
        
        common_check(){
            if(this.type===`line`){
                this.flag.push(true);
            }
            
            
            if(this.doc_size>10000){
                this.flag.push(true);
            }
            
            if(this.type !==`line` && this.options[1] > 150){
                this.flag.push(true);
            }
            console.log(this.options[1]);
            
            if(this.flag.length === 1){
                return window.confirm(`it will take long time. are you sure?`);
            }
            
            if(this.flag.length > 1){
                return window.confirm(`it will take really so long time. are you sure?`);
            }
        
            return true;
        }
    
    }
    rendaling.addEventListener(`click`,()=>{
        
        const validation = new Validation();
        if(!validation.common_check()){
            return false;
        }
        
        switch(common.type.value){
                case `line`:
                    const lines = new Carving_line(10,5,0.01);
                    lines.parlinnoise();
                    console.log(lines);
                    csInterface.evalScript(`expression(${JSON.stringify(lines)})`);
                    break;
                
                case `particle`:  
                    select_particle();
                    break;
                
                case `square`:
                    const sq = new Squares();
                    sq.trans_forming();
                    console.log(sq);
                    csInterface.evalScript(`expression(${JSON.stringify(sq)})`);
                    break;
                
                default:
                alert(`error`);
                return;
                
               }
    },false);
    
    
    function select_particle(){
        switch (document.forms.particle_option.kind_bumb.value){
                case `normal`:
                const lighting = new Particles(`Particles`,`fill`);
                console.log(lighting);
                csInterface.evalScript(`expression(${JSON.stringify(lighting)})`); 
                break;
                
                case `flare`:
                const flare = new Particles(`Flare`,`fill`);
                csInterface.evalScript(`expression(${JSON.stringify(flare)})`); 
                break;
                
                case `create_space`:
                let dimention = [];
                
                const create_space01 = new Particles(`Particles`,`fill`);
                create_space01.size = create_space01.size;
                dimention[0] = create_space01;
                
                const create_space02 = new Particles(`Particles`,`fill`);
                create_space02.size = create_space01.size;
                create_space02.set_blur(4);
                dimention[1] = create_space02;
                
                const create_space03 = new Particles(`Particles`,`fill`);
                create_space03.size = create_space01.size;
                create_space03.set_blur(10);
                dimention[2] = create_space03;
                
                
                dimention.forEach((v)=>{
                    csInterface.evalScript(`expression(${JSON.stringify(v)})`);
                });
                break;
                
                case `ripples`:
                case `ellipse`:
                
                const ripples = new Particles(`ripples`,`stroke`);
                if(document.forms.particle_option.kind_bumb.value===`ellipse`){
                    ripples.ellipse = true;
                }
                ripples.size = ripples.size*1.5;
                ripples.set_blur();
                csInterface.evalScript(`expression(${JSON.stringify(ripples)})`);
                break;
                
                default:
                alert(`error`);
                return;
        }
            
    }
   
}