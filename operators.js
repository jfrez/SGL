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
sub : function(bounds,response,params,fgrid,pg){
var conString = "tcp://"+params.db.user+":"+params.db.pass+"@"+params.db.host+"/"+params.db.db+"";
var db = new pg.Client(conString);
        db.connect();
			var scn1= bounds.scenario1;
			var scn2 = bounds.scenario2;
			var sql = "select scn1.box, (GREATEST(scn1.val,scn2.val)-LEAST(scn1.val,scn2.val)) as val from (select * from boxes where set = '"+scn1+"') as scn1, (select * from boxes where set = '"+scn2+"') as scn2  where scn1.box = scn2.box";
			console.log(sql);
		var query =  db.query(sql,function(err){db.end();});

			var matrix =  Array();
			var count =0;
                                                query.on('row', function(row,result) {
							matrix.push({square:row.box,val:row.val});count++;
                                                });
						query.on('end', function() {
                                                                var json=(JSON.stringify(matrix));
                                                                response.write(json);

                                                                console.log("Map Sended "+count);
                                                                response.end();
                                                });
                                },
avg : function(bounds,response,params,fgrid,pg){
			var count =0;
var conString = "tcp://"+params.db.user+":"+params.db.pass+"@"+params.db.host+"/"+params.db.db+"";
var db = new pg.Client(conString);
        db.connect();
			var scn1= bounds.scenario1;
			var scn2 = bounds.scenario2;
			var sql = "select scn1.box, (scn1.val+scn2.val)/2 as val from (select * from boxes where set = '"+scn1+"') as scn1, (select * from boxes where set = '"+scn2+"') as scn2  where scn1.box = scn2.box";
			console.log(sql);
		var query =  db.query(sql,function(){db.end();});

			var matrix =  Array();
                                                query.on('row', function(row,result) {
							matrix.push({square:row.box,val:row.val});count++;
                                                });
						query.on('end', function() {
                                                                var json=(JSON.stringify(matrix));
                                                                response.write(json);
                                                                console.log("Map Sended "+count);
                                                                response.end();
                                                });
                                },
sum : function(bounds,response,params,fgrid,pg){
			var count =0;
var conString = "tcp://"+params.db.user+":"+params.db.pass+"@"+params.db.host+"/"+params.db.db+"";
var db = new pg.Client(conString);
        db.connect();
			var scn1= bounds.scenario1;
			var scn2 = bounds.scenario2;
			var sql = "select scn1.box, (scn1.val+scn2.val) as val from (select * from boxes where set = '"+scn1+"') as scn1, (select * from boxes where set = '"+scn2+"') as scn2  where scn1.box = scn2.box";
			console.log(sql);
		var query =  db.query(sql,function(){db.end();});

			var matrix =  Array();
                                                query.on('row', function(row,result) {
							matrix.push({square:row.box,val:row.val});count++;
                                                });
						query.on('end', function() {
                                                                var json=(JSON.stringify(matrix));
                                                                response.write(json);
                                                                console.log("Map Sended "+count);
                                                                response.end();
                                                });
                                }





                        }
;
