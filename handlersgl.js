
//Libes
function contains(a, obj) {
        for (var i = 0; i < a.length; i++) {
                if (a[i] === obj) {
                        return true;
                }
        }
        return false;
}


function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

module.exports = {
create : function(bounds,response,params,fgrid,db,sgl){
				var hyp2 = Array();
				var ontology = require('./class');var probs = require('./pdist');
				   var payload = {grid:null,elements:null};var elements = {};

				
				var Entities = require('html-entities').AllHtmlEntities;
				var entities = new Entities();

		            var bwsumtotal=0;
                                //CREATE SCENARIO
                             	var   grid = new Array();
                                var inter = new Array();
                                var tempo = new Array();
                                var res=2 ;
                                findclass="";
                                res = Math.abs(Math.abs(bounds.left)-Math.abs(bounds.right))/params.width;
                                scenario= bounds.scenario;
                                time= bounds.time;
                                hyp = sgl.BEHAVIOR;
				var CL =  sgl.SUITABILITY[1][0];
                                var d = new Date(time);
                                var dw = d.getDay();
                                var hd = d.getHours();
                                var ny = d.getMonth();
                                var nm = d.getDate();
                                findclass = bounds.findclass;
                                var works = Array();
                                var n = params.width;
                                var w = params.width;
				
                                if(bounds.top<bounds.bottom)n=n*-1;
                                if(bounds.left<bounds.right)w=w*-1;

                                var slat = fgrid.getx(parseFloat(bounds.top),params.width);
                                var lslat = fgrid.getx(parseFloat(bounds.top),params.width);
                                var slon = fgrid.getx(parseFloat(bounds.left),params.width);
                                var lslon = fgrid.getx(parseFloat(bounds.left),params.width);

                                var i = 0;
                                var bigsql ="TRUNCATE TABLE query;";
				var count =0;
				var wi= Math.abs((Math.abs(bounds.left)-Math.abs(bounds.right)));
				var he= Math.abs((Math.abs(bounds.top)-Math.abs(bounds.bottom)));
				var squares = Array();

                                while( slon != fgrid.getx(parseFloat(bounds.right),params.width)  ){
					if(count>params.maxgrid){db.end();response.end();break;}
                                        while(slat != fgrid.getx(parseFloat(bounds.bottom),params.width)){
					 if(count>params.maxgrid){db.end();response.end();break;}

					sslat =  fgrid.getx(parseFloat(slat)+n,params.width);
					sslon = fgrid.getx(parseFloat(slon)+w,params.width);
					var square = "POLYGON(("+slon+" "+slat+" , "+slon+" "+(sslat)+" , "+(sslon)+" "+(sslat)+" , "+(sslon)+" "+slat+" , "+slon+" "+slat+"))";
					if(squares.indexOf(square)<0){
					count++;
                                                var o = "INSERT INTO query (point) VALUES(ST_GeomFromText('"+square+"',4326));";
						squares.push(square);
                                                bigsql += o;
						}
                                        slat = fgrid.getx(parseFloat(slat)+n,params.width);
                                        }
                                        slon = fgrid.getx(parseFloat(slon)+w,params.width);
                                 	slat = fgrid.getx(parseFloat(bounds.top),params.width);

                                }



				console.log("SQUARES:" + count);
                                var q1=         db.query(bigsql,function(err,r){console.log("NO ERROR");});
                                q1.on('end', function() {
                                                var sqlhyp =" ";
						var c =0;
                                                for(var h in hyp){
						c++;
                                               	 if(hyp[h] == "HIPO"){
						var entity = hyp[parseInt(h)+1][0];
							var col = entity.split(":")[0];
							var attr = entity.split(":")[1];
						var auxh = {entity: attr, val : parseFloat(hyp[parseInt(h)+1][1]) };
						var go = true;
						for(var a in hyp2){
							if(hyp2[a].entity == auxh.entity)go = false;
						}
						if(go)hyp2.push(auxh);
						if(c < hyp.length-1) 
                                                sqlhyp +=" "+col.substr(1,col.length)+" like '"+attr+"' OR ";
						else
                                                sqlhyp +=" "+col.substr(1,col.length)+" like '"+attr+"' ";
		
							}
                                                }
                                                try{
                                                response.writeHead(200, {"Content-Type": "text/plain",'Access-Control-Allow-Origin' : '*'});


                                                var sql="select  planet_osm_all.* , osm_id, ST_asText(way) as point,ST_asText(lim.point) as grid,st_astext(lim.point) as hash, ST_Distance_Sphere(ST_Transform(way,4326),lim.point) as distance from planet_osm_all , (select point from query group by point) as lim where  ( "+sqlhyp+" )  and ST_Contains(ST_GeomFromText('"+bounds.bounds+"',4326),ST_Transform(way,4326) )  and ST_Distance_Sphere(ST_Transform(way,4326),lim.point) < "+params.distance+"";
                                                var count =0;
                                                var query = db.query(sql,function(err){if(!err)console.log("Select ok");});
						
                                                var cmax=0,cmin=100;
                                                var bwmax=0,bwmin=100;
                                                var plmax=0,plmin=100;
                                                var pmax=0,pmin=100;

                                                query.on('row', function(row,result) {
                                                        count++;
                                                        var classes = ontology.get(row);
                                                        var certr=1;
                                                        var bw=1;
                                                        var timebw=1;
                                                        for(var i =0;i< hyp2.length;i++){
                                                        if(hyp2[i].entity==classes[0]){
                                                                bw =parseFloat(hyp2[i].val)/100;

                                                        }
							}
                                                        var plaur=1;
                                                        var pdist=0;
                                                        var interact =1;
                                                        pdist = probs.pdist(CL,row.distance);
							if(sgl.hasOwnProperty("INTERACTION")){
							var last ="";
							var tday=1;var tweek=1;var tmonth=1;var tyear=1;
							for(inter in sgl.INTERACTION){
									
								if(last=="TEMPORAL"){
									var cl = (sgl.INTERACTION[inter][0].split(":")[1]);
									if(cl == classes[0]){
									if(!tempo.hasOwnProperty(cl)){
					
									 var timehandler = require('./tempo');
									 var day = clone(timehandler);day.initialize({tempo:"day",dist:"normal",params: {u:1,d:2}});
	                                     		                var week = clone(timehandler);week.initialize({tempo:"week",dist:"normal",params: {u:1,d:1}});
        	                                        		var month = clone(timehandler);month.initialize({tempo:"month",dist:"normal",params: {u:1,d:1}});
		                	                                var year = clone(timehandler);year.initialize({tempo:"year",dist:"normal",params: {u:1,d:1}});
	                        		                        tempo[cl] = {day:day,week:week,month:month,year:year};
									}
									var list = (sgl.INTERACTION[inter][1]);
									for(var e in list){
										var t = tempo[cl];
										t[list[e].time].add(list[e].when,parseFloat(list[e].value/100));
										 t[list[e].time].calculate();
									}
									if(sgl.hasOwnProperty("AT")){
										var d = sgl.AT[1][0].substr(1,sgl.AT[1][0].length);
										var h = sgl.AT[3][0].substr(0,sgl.AT[3][0].length-1);
										var timestamp =(new Date(d+" "+h));
										tday = tempo[cl].day.getData()[timestamp.getHours()];
										tweek = tempo[cl].week.getData()[timestamp.getDay()];
										tmonth = tempo[cl].month.getData()[timestamp.getDate()];
										tyear = tempo[cl].year.getData()[timestamp.getMonth()];
									}
									}
								}
								if(last=="INTER"){
									var cl = (sgl.INTERACTION[inter][0].split(":")[1]);
									if(cl == classes[0]){
									var val = parseFloat(sgl.INTERACTION[inter][1]);
										if(!isNaN(val)){
											val = val/100;
	                                                        			interact *= val;
										}
								}}
								last=sgl.INTERACTION[inter];
							}
							}
						                                                        var certr=1;
                                                        var bw=1;
                                                        var plaur=1;
								       timebw =tday*tweek*tmonth*tyear*2;
                                                        if(! (typeof grid[row.hash] == "undefined") ){
                                                                grid[row.hash] = {
									bw:grid[row.hash].bw+ bw*pdist*interact*timebw,
									ce:grid[row.hash].ce+ certr*pdist*timebw*interact,
									pl:grid[row.hash].pl+ plaur*pdist*timebw*interact,
									p:grid[row.hash].p+pdist*interact,
									point:row.grid,
									elements:grid[row.hash].elements
                                                                };

                                                                if(!contains(grid[row.hash].elements,row.name)){
                                                                        grid[row.hash].elements.push({name: entities.encode(row.name+" "),dist:row.distance});
                                                                }
                                                                inter[row.hash]*=interact;

                                                        }else{


                                                                grid[row.hash] = {
									bw: bw*pdist*timebw*interact,
									ce: certr*pdist*timebw*interact,
									pl: plaur*pdist*timebw*interact,
									p:pdist*interact,
									point:row.grid,
									elements:new Array()
                                                                };
                                                                grid[row.hash].elements.push({name: entities.encode(row.name+" "),dist:row.distance});
                                                                inter[row.hash]=interact;

                                                        }
							if(grid[row.hash].ce<cmin)cmin=grid[row.hash].ce;
                                                        if(grid[row.hash].ce>cmax)cmax=grid[row.hash].ce;
                                                        if(grid[row.hash].bw<bwmin)bwmin=grid[row.hash].bw;
                                                        if(grid[row.hash].bw>bwmax)bwmax=grid[row.hash].bw;
                                                        if(grid[row.hash].p<pmin)pmin=grid[row.hash].p;
                                                        if(grid[row.hash].p<pmin)pmin=grid[row.hash].p;
                                                        if(grid[row.hash].p>pmax)pmax=grid[row.hash].p;
                                                        if(grid[row.hash].pl<plmin)plmin=grid[row.hash].pl;
                                                        if(grid[row.hash].pl>plmax)plmax=grid[row.hash].pl;

                                                });
     query.on('end', function() {
                                                                var tmp={};var count=0;
								var o="";
								var tmpscn="delete from boxes where set = 'tmp';";
                                                                for(property in grid) {
									//grid[property].bw = (grid[property].bw -bwmin )/bwmax;
                                                                tmp[property] = grid[property];
                                                		 tmpscn += "INSERT INTO boxes (box,val,width,dist,set) VALUES('"+property+"',"+grid[property].bw+", "+params.width+","+params.distance+",'tmp');";
								if(sgl.hasOwnProperty("SAVETO")){
                                                		 o += "INSERT INTO boxes (box,val,width,dist,set) VALUES('"+property+"',"+grid[property].bw+", "+params.width+","+params.distance+",'"+sgl.SAVETO[1][0][0]+"');";
								
								}
                                                                }
								if(sgl.hasOwnProperty("SAVETO")) db.query(o,function(err){if(!err){console.log("NO ERROR SAVING");}});
								 db.query(tmpscn,function(err){
									if(err)console.log(err);
									var sql = "select box, val from boxes where set = 'tmp'";
                							var query2 =  db.query(sql,function(err){console.log(err);});
									var matrix = Array();
									if(sgl.hasOwnProperty("SAVETO")){
									matrix.push({name:sgl.SAVETO[1][0][0]});
									}
                                                			query2.on('row', function(row,result) {
		                        	                                matrix.push({square:row.box,val:row.val});
                			                                });
                                                			query2.on('end', function() {
                                                                		var json=(JSON.stringify(matrix));
		                                                                response.write(json);
                		                                                console.log("Map Sended :"+matrix.length+" boxes");
                                		                                response.end();
										db.end();
                                                			});
	

								});
                                                                


                                                });
                                                }catch(err){

                                                                console.log(err);
                                                response.end();
                                                                db.end();
                                                }
                                });


                        }
};
