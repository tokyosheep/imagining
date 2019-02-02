function make_square(top,left,bottom,right){
//[[x1,y1],[x2,y2],[x3,y3],[x4,y4]]
left = left ? left : top;
right = right ? right: bottom;

selReg = [[top,left],[top,right],[bottom,right],[bottom,left]];
activeDocument.selection.select(selReg);
}