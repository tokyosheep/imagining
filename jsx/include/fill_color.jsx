function fillout_color(rgb){
        RGBColor = new SolidColor();
        RGBColor.red = rgb[0];
        RGBColor.green = rgb[1];
        RGBColor.blue = rgb[2];
        activeDocument.selection.fill(RGBColor,ColorBlendMode.NORMAL, 100, false);
        activeDocument.selection.deselect();
    }//end of fillout_color    