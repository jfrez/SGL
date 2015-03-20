//Libes

var find = function (str,r){
 var re = new RegExp(r);
  var m = re.exec(str);
if(m == null)return -1;
return m;  
};

var tokens = {
		cl:"(@[a-z]+)(:([a-z]|_|%)+){0,1}"
		};
module.exports = {
execute: function(sgl){
	this.visitor(sgl);
	this.syntax();
	return this.q;
},
 lex : Array(),			  
 values : Array(),
 q : {},
svisitor: function(n,s){
if(s){
	for(var t in s){
		if(this.lex[n]==t){
		if(this.isFunction(s[t])){
			
			this.q[segment].push(t);
			this.q[segment].push(s[t](this.values[n],this.tok));
			return true;
		}else{
			this.q[t] = new Array();;
			segment = t;
			return false;
			//svisitor(n,s[t]);
		}
		}else{
		
			if(this.svisitor(n,s[t])){
			break;
			}else{

			}
		}
	}
}else{
	console.log("syntax error");
}
},
syntax: function (){
var pointer = this.syn;
for(var n in this.lex){
	this.svisitor(n,pointer);
}

},

visitor: function (str){

str=str.trim();
if(str && str.length>0){
var ok = false;
var m;
for(var r in this.tok){
var index2 = str.indexOf(" ");
if(index2<0)index2 = str.length;
 m = this.find(str.substr(0,index2),this.tok[r]);
if(m.index >= 0){
ok= true;	
	var val = m[0];
this.lex.push(r);
this.values.push(val);

break;
}
}
 this.visitor(str.substr(m[0].length,str.length),this.tok);
}
},

find: function (str,r){
 var re = new RegExp(r);
  var m = re.exec(str);
if(m == null)return -1;
return m;  
},

 isFunction: function(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
},

	tok : {
        SUITABILITY : "belief",
        BEHAVIOR : "hypothesis",
        WHERE : "where",
        INTERACTION : "model",
        SAVETO : "saveas",
        OPERATION : "operation",
        RESET : "reset",
        GET : "get",
        AT : "at",
        DATE: "\"[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}",
        TIME: "[0-9]{1,2}(:[0-9]{1,2}){0,1}(:[0-9]{1,2}){0,1}\"",
        POINT :  "\{[-+]?([0-9]*\.[0-9]+|[0-9]+),[-+]?([0-9]*\.[0-9]+|[0-9]+)\}",
        INTER: tokens.cl+"\{[-+]?([0-9]+\.[0-9]+|[0-9]+)\}",
        TEMPORAL:  tokens.cl+"\{(((day|week|month|year)\{[0-9]+:[0-9]+\})+(,(day|week|month|year)\{[0-9]+:[0-9]+\})*)\}",
        TEMPLIST: "\{(((day|week|month|year)\{[0-9]+:[0-9]+\})+(,(day|week|month|year)\{[0-9]+:[0-9]+\})*)\}",
        TEMPELEMENT: "((day|week|month|year)\{[0-9]+:[0-9]+\})",
        HIPO:  "\{"+tokens.cl+"\}[0-9][0-9]",
        HIPON:  "\{"+tokens.cl+"\}[0-9][0-9]",
        CL :   tokens.cl,
        NUMMODEL: "\{[-+]?([0-9]+\.[0-9]+|[0-9]+)\}",
        NAME: "[a-z]([a-z]|[0-9])+",
        FUNCT : "[a-z]+\(.*\)",
        NUM: "[-+]?([0-9]+\.[0-9]+|[0-9]+)",
        FUNCNAME: "[a-z]+([a-z]*|[0.9]*)",
       // QUESTION: "?",
        GT: ">",
        LT: "<",
        ERROR: ".*"
        },

 	syn : {
	SUITABILITY: {
			  CLVALUES:function(val,tok){
				var m = find(val,this.tok.NUM);
				var x1=m[0];
				 m = find(val.substr(m.index+m[0].length,val.length),this.tok.NUM);
				var x2 = m[0];
				m= find(val,tok.CL);
				var cl = m[0].substr(1,m[0].length);
				return [cl,x1,x2];	
				},
			  CL:function(val,tok){
				var m= find(val,tok.CL);
				var cl = m[0].substr(1,m[0].length);
				return [cl];
				}
			  ,
			ERROR:function(val){return "SYNTAX ERROR: "+val;}
			},
	WHERE:{
			CLVALUES:function(val,tok){
                                var m = find(val,tok.NUM);
                                var x1=m[0];
                                 m = find(val.substr(m.index+m[0].length,val.length),tok.NUM);
                                var x2 = m[0];
                                m= find(val,tok.CL);
                                var cl = m[0].substr(1,m[0].length);
                                return [cl,x1,x2];
                                },
			 CL:function(val,tok){
                                var m= find(val,tok.CL);
                                var cl = m[0].substr(1,m[0].length);
                                return [cl];
                                },
			 GT:function(val,tok){
                                var m= find(val,tok.GT);
                                var cl = m[0];
                                return [cl];
                                },
			 LT:function(val,tok){
                                var m= find(val,tok.LT);
                                var cl = m[0];
                                return [cl];
                                },
			 NUM:function(val,tok){
                                var m= find(val,tok.NUM);
                                var cl = m[0];
                                return [cl];
                                },
			ERROR:function(val){return "SYNTAX ERROR: "+val;}
	},
	BEHAVIOR:{
			HIPO:function(val,tok){
				var m = find(val, tok.CL);
				var n = find(val,tok.NUM);
				return [m[0],n[0]];
			},
			HIPON:function(val,tok){
				var list = new Array();
				var m = find(val, tok.CL);
				while(m.index >0){
					list.push(m[0]);
					val = val.substr(m[0].length,val.lenght);
					m = find(val, tok.CL);
				
				}
				var n = find(val,tok.NUM);
				return [list,n[0]];
			},		

			ERROR:function(val){return "SYNTAX ERROR: "+val;}
		},	
	INTERACTION:{
		
			INTER:function(val,tok){
				var m = find(val,tok.CL);
				var m2 = find(val,tok.NUMMODEL);
				var x = find(m2,tok.NUM);
				return [m[0].substr(1,m[0].length),x[0]];
			},
			TEMPORAL:function(val,tok){
				var list = new Array();
				var m = find(val,tok.CL);
				var m2 = find(val,tok.TEMPLIST);
				var m3 = find(m2[0],tok.TEMPELEMENT);
					var time = find(m3[0],tok.NAME);
					var whenandvalue = find(m3[0].substr(time.length+1,m3[0].length),tok.NUM);
					var value = parseFloat(whenandvalue[0].split(":")[1]);
					var when = parseFloat(whenandvalue[0].split(":")[0]);
                                        list.push({time:time[0],when:when,value:value});
                                        val = m2[0].substr(m3[0].length,m2[0].lenght);
                                        m3 = find(val, tok.TEMPELEMENT);
                                while(m3.index >0){
					var time = find(m3[0],tok.NAME);
					var whenandvalue = find(m3[0].substr(time.length+1,m3[0].length),tok.NUM);
					var value = parseFloat(whenandvalue[0].split(":")[1]);
					var when = parseFloat(whenandvalue[0].split(":")[0]);
                                        list.push({time:time[0],when:when,value:value});
                                        val = val.substr(m3[0].length,m2[0].lenght);
                                        m3 = find(val, tok.TEMPELEMENT);

                                }

				return [m[0],list];
			},		
			ERROR:function(val){return "SYNTAX ERROR: "+val;}
	},
	AT:{
		DATE:function(val,tok){
				return [val];
			},	
		TIME:function(val,tok){
				return [val];
			},	
			ERROR:function(val){return "SYNTAX ERROR: "+val;}
	},

	SAVETO:{
		NAME:function(val,tok){
				var n = find(val,tok.NAME);
				return [n];
			},	
			ERROR:function(val){return "SYNTAX ERROR: "+val;}
	},
	OPERATION:{
		NAME:function(val,tok){
				var op = find(val,tok.NAME);
				return [op];
			},	
			ERROR:function(val){return "SYNTAX ERROR: "+val;}
	},
	GET:{
		NAME:function(val,tok){
				var op = find(val,tok.NAME);
				return [op];
			},	
			ERROR:function(val){return "SYNTAX ERROR: "+val;}
	},

	RESET:function(){console.log("RESET"); process.exit(0); },

	ERROR:function(val){return "SYNTAX ERROR: "+val;}
}



};
