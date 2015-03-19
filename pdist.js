module.exports = {
  pdist: function (obj,dist) {
var cl = {
people:function(dist){return 1-normalcdf(100,100,dist);},
crime:function(dist){return 1-normalcdf(100,200,dist);},
deer:function(dist){return 1-normalcdf(500,5000,dist);},
animal:function(dist){return 1-normalcdf(500,5000,dist);}

}
	if(cl.hasOwnProperty(obj)){
	return cl[obj](dist);
	}else{
	return 0;
	}
},

 pinterval: function (mean,sigma, from, to){

        var one = normalcdf(mean,sigma,from);
                var two = normalcdf(mean,sigma,to);
                return Math.abs(one-two);

}

};

function normalcdf2(mean, sigma, to) 
{
    var z = (to-mean)/Math.sqrt(2*sigma*sigma);
    var t = 1/(1+0.3275911*Math.abs(z));
    var a1 =  0.254829592;
    var a2 = -0.284496736;
    var a3 =  1.421413741;
    var a4 = -1.453152027;
    var a5 =  1.061405429;
    var erf = 1-(((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-z*z);
    var sign = 1;
    if(z < 0)
    {
        sign = -1;
    }
    return (1/2)*(1+sign*erf);
}
function normalcdf( mean, sigma,x) {
  return 0.5 * (1 + erf((x - mean) / (Math.sqrt(2 * sigma*sigma))));
}

function erf(x) {
  // save the sign of x
  var sign = (x >= 0) ? 1 : -1;
  x = Math.abs(x);

  // constants
  var a1 =  0.254829592;
  var a2 = -0.284496736;
  var a3 =  1.421413741;
  var a4 = -1.453152027;
  var a5 =  1.061405429;
  var p  =  0.3275911;

  // A&S formula 7.1.26
  var t = 1.0/(1.0 + p*x);
  var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y; // erf(-x) = -erf(x);
}
function pinterval(mean,sigma, from, to){
	
	var one = normalcdf(mean,sigma,from);
		var two = normalcdf(mean,sigma,to);
		return Math.abs(one-two);
	
}
