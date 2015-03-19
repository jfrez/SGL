
//Libes
function contains(a, obj) {
        for (var i = 0; i < a.length; i++) {
                if (a[i] === obj) {
                        return true;
                }
        }
        return false;
}



module.exports = {
createtime : function(bounds,response,params,fgrid,pg){
	console.log(fgrid);
				var ontology = require('./class');var probs = require('./pdist');
				   var payload = {grid:null,elements:null};var elements = {};
var conString = "tcp://"+params.db.user+":"+params.db.pass+"@"+params.db.host+"/"+params.db.db+"";
var db = new pg.Client(conString);
        db.connect();

				
				var Entities = require('html-entities').AllHtmlEntities;
				var entities = new Entities();

		            var bwsumtotal=0;
                                var insert = db;
                                //CREATE SCENARIO
                             	var   grid = new Array();
                                var inter = new Array();
                                var res=2 ;
                                findclass="";
                                res = Math.abs(Math.abs(bounds.left)-Math.abs(bounds.right))/params.width;
				console.log(res*res+" Squares");
                                scenario= bounds.scenario;
                                time= bounds.time;
                                hyp = JSON.parse(bounds.hyplist);
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
					if(count>params.maxgrid)break;
                                        while(slat != fgrid.getx(parseFloat(bounds.bottom),params.width)){
					if(count>params.maxgrid)break;


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
                                var q1=         insert.query(bigsql);
                                q1.on('end', function() {
                                                var sqlhyp =" ";

                                                for(var i =0;i< hyp.length-1;i++){
                                                var entity = hyp[i].entity.split(":");
                                                sqlhyp +=" "+entity[0]+" like '"+entity[1]+"' OR ";
                                                }
                                                try{
                                                sqlhyp += " "+hyp[hyp.length-1].entity.split(":")[0]+" like '"+hyp[hyp.length-1].entity.split(":")[1]+"' ";
                                                response.writeHead(200, {"Content-Type": "text/plain",'Access-Control-Allow-Origin' : '*'});


                                                var sql="select  planet_osm_all.* , osm_id, ST_asText(way) as point,ST_asText(lim.point) as grid,st_astext(lim.point) as hash, ST_Distance_Sphere(ST_Transform(way,4326),lim.point) as distance from planet_osm_all , (select point from query group by point) as lim where  ( "+sqlhyp+" )  and ST_Contains(ST_GeomFromText('"+bounds.bounds+"',4326),ST_Transform(way,4326) )  and ST_Distance_Sphere(ST_Transform(way,4326),lim.point) < "+params.distance+"";
                                                var count =0;
                                                var query = insert.query(sql);
                                                var cmax=0,cmin=100;
                                                var bwmax=0,bwmin=100;
                                                var plmax=0,plmin=100;
                                                var pmax=0,pmin=100;
                                                query.on('row', function(row,result) {
                                                        count++;
                                                        var classes = ontology.get(row);
                                                        var prob = probs.pinterval(3,5,0,2);
                                                        var certr=1;
                                                        var bw=1;
                                                        var timebw=1;
                                                        for(var i =0;i< hyp.length;i++){
                                                        if(hyp[i].entity==classes[0]){
                                                                bw =parseFloat(hyp[i].val)/100;

                                                        }
                                                		 var temp = hyp[i].temp;
								if(typeof temp != "undefined")
                                                                 timebw =timebw*temp.week[dw]*temp.day[hd]*temp.year[ny]*temp.month[nm];
                                                        }
                                                        var plaur=1;
                                                        var pdist=0;
                                                        var interact =1;
                                                        var interactions = ontology.interactions();
                                                        pdist = probs.pdist(bounds.query,row.distance);
     for(var i =0;i< classes.length;i++){
                                                        var val = parseFloat(interactions[bounds.query][classes[i]]);
                                                        if(val>=0)
                                                        interact *= parseFloat(interactions[bounds.query][classes[i]]);
                                                        }

                                                        var certr=1;
                                                        var bw=1;
                                                        var plaur=1;
                                                        if(! (typeof grid[row.hash] == "undefined") ){

                                                                grid[row.hash] = {
									bw:grid[row.hash].bw+ bw*pdist*prob*timebw,
									ce:grid[row.hash].ce+ certr*pdist*prob*timebw,
									pl:grid[row.hash].pl+ plaur*pdist*prob*timebw,
									p:grid[row.hash].p+prob*pdist,
									point:row.grid,
									elements:grid[row.hash].elements
                                                                };

                                                                if(!contains(grid[row.hash].elements,row.name)){
                                                                        grid[row.hash].elements.push({name: entities.encode(row.name+" "),dist:row.distance});
                                                                }
                                                                inter[row.hash]*=interact;

                                                        }else{


                                                                grid[row.hash] = {
									bw: bw*pdist*prob*timebw,
									ce: certr*pdist*prob*timebw,
									pl: plaur*pdist*prob*timebw,
									p:prob*pdist,
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
                                                                //var bwavg=bwsumtotal/count;var std=0;
                                                                //for(property in grid) {
                                                                //      std += Math.pow(grid[property].bw-bwavg,2);
                                                                //}
                                                                //std =std/count;
                                                                //bwmax=bwmax-bwavg-std-std;
                                                                for(property in grid) {
									grid[property].bw = (grid[property].bw -bwmin )/bwmax;
                                                                tmp[property] = grid[property];
									
                                                		var o = "INSERT INTO boxes (box,val,width,dist,set) VALUES('"+property+"',"+grid[property].bw+", "+params.width+","+params.distance+",'"+bounds.set+"');";
                                                                var q= insert.query(o);
								console.log(o);
                                                                }
   console.log("BELIEF INTEGRAL "+bwsumtotal);
                                                                payload.grid = tmp;
                                                                payload.integral = bwsumtotal;
                                                                payload.elements = elements;
                                                                payload.bounds = bounds;
                                                                payload.res = res;
                                                               try{ 
								var json=(JSON.stringify(payload));
                                                                var sql="insert into scenario (name,scenario,time) VALUES ('"+scenario+"','"+json+"','"+time+"')";
                                                                var q= insert.query(sql);
								}catch(err){ 
								 }
                                                                response.write(json);
                                                                console.log("Map Created");
                                                                response.end();
                                                });
                                                }catch(err){

                                                                console.log(err);
                                                response.end();
                                                }
                                });


                        }
};
