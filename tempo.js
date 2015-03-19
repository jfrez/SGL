function normal(params, x	) 
{
	var mean = parseFloat(params.u);
	var sigma = parseFloat(params.d);
	var m = sigma * Math.sqrt(2 * Math.PI);
    var e = 2*Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(sigma,2)));
    return e / m;
}

module.exports = {
initialize: function(options) {

		if(options.tempo == undefined){
			this.tempo = "day";;
			this.dist = "normal"
			this.params = {u:50,d:20};
			
		}else{
			this.tempo = options.tempo;
			this.dist= options.dist;
			this.params = options.params;
		}
		
		this.Data = Array();
		this.beats = new Array(); 
		var tempoCut =0;
		if(this.tempo == "day"){tempoCut=24;}
		if(this.tempo == "week"){tempoCut=7;}
		if(this.tempo == "month"){tempoCut=31;}
		if(this.tempo == "year"){tempoCut=12;}
		if(this.tempo == "decade"){tempoCut=10;}
		if(this.tempo == "century"){tempoCut=100;}
		this.tempoCut = tempoCut;
				for(var i =0;i<=this.tempoCut;i++){
				this.Data[i]=1;
				}
	},
	calculate: function(){
		var Data = Array();
		for(var i =1;i<this.tempoCut;i++)Data[i]=1;
		for(beat in this.beats){
			if(this.beats.hasOwnProperty(beat)){
				for(var i =0;i<this.tempoCut;i++){
				this.params.u=beat;
					var val = eval(this.dist+"("+JSON.stringify(this.params)+","+i+");")*this.beats[beat];
						if(val > Data[i] || (Data[i] == 1 && val >0)){
								Data[i] = val;
						}
					}
					
			}
		}
			this.Data = Data;
			return Data;
	},
	add:function(index,val){
		this.beats[index] = val;
	},
	getData:function(){
		return this.Data;
	}

};
