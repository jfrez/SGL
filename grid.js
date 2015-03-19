module.exports = {

	getx:function(xx,w){
	   var xi = (xx)%(1.5*w);
               xi = xi>0?xi-(1.5*w/2):xi+(1.5*w/2);
               var x = xx-xi
		return x;
	},
	gety:function(yy,x,w){
                       // if(((x/(1.5*w))-0.5)%2==0){
                         //       yy= yy + 2*w;
                        //}

                        var yi = (yy)%(Math.sqrt(3)*w);
                        yi = yi>0?yi-(Math.sqrt(3)*w/2):yi+(Math.sqrt(3)*w/2);
                        var y = yy-yi;
                        if(((x/(1.5*w))-0.5)%2==0){

                        	var     auxy = y<0?y - Math.sqrt(3)*w/2:y+Math.sqrt(3)*w/2;
	                        if(Math.abs(Math.abs(yy)-Math.abs(auxy))<w){
	                                auxy = auxy- Math.sqrt(3)*w;
				}

                        y = auxy;
                        }

			return y;
		}
	};

