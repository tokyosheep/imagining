function makeCircle(left,top,right,bottom,antiAlias){
    
   top = top ? top : left;
   bottom = bottom ? bottom : right;//top,bottomが未定義だったらtop,rigthと同じ値を代入

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

//makeCircle(0,undefined,500,undefined,true);

