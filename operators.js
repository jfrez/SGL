//Libes
function contains(a, obj) {
        for (var i = 0; i < a.length; i++) {
                if (a[i] === obj) {
                        return true;
                }
        }
        return false;
}
var block = {
sub : function(bounds,response,params,fgrid,db,sgl){
			var scn1= bounds.scenario1;
			var scn2 = bounds.scenario2;
			var sql = "select scn1.box, (GREATEST(scn1.val,scn2.val)-LEAST(scn1.val,scn2.val)) as val from (select * from boxes where set = '"+scn1+"') as scn1, (select * from boxes where set = '"+scn2+"') as scn2  where scn1.box = scn2.box";
		var query =  db.query(sql,function(err){});

			var matrix =  Array();
			 if(sgl.hasOwnProperty("SAVETO")){
                              matrix.push({name:sgl.SAVETO[1][0][0]});
                             }

			var count =0;
			var o ="";
                                                query.on('row', function(row,result) {
							matrix.push({square:row.box,val:row.val});count++;
							  if(sgl.hasOwnProperty("SAVETO")){
                                                                 o += "INSERT INTO boxes (box,val,width,dist,set) VALUES('"+row.box+"',"+row.val+", "+params.width+","+params.distance+",'"+sgl.SAVETO[1][0][0]+"');";
								}
                                                });
						query.on('end', function() {
					 if(sgl.hasOwnProperty("SAVETO")) db.query(o,function(err){if(!err){console.log("NO ERROR SAVING");db.end();}});

                                                                var json=(JSON.stringify(matrix));
                                                                response.write(json);

                                                                console.log("Map Sended "+count);
                                                                response.end();
                                                });
                                },
avg : function(bounds,response,params,fgrid,db,sgl){
			var count =0;
			var scn1= bounds.scenario1;
			var scn2 = bounds.scenario2;
			var sql = "select scn1.box, (scn1.val+scn2.val)/2 as val from (select * from boxes where set = '"+scn1+"') as scn1, (select * from boxes where set = '"+scn2+"') as scn2  where scn1.box = scn2.box";
		var query =  db.query(sql,function(){});

			var matrix =  Array();
			var o ="";
			 if(sgl.hasOwnProperty("SAVETO")){
                              matrix.push({name:sgl.SAVETO[1][0][0]});
                             }
                                                query.on('row', function(row,result) {
							matrix.push({square:row.box,val:row.val});count++;
							  if(sgl.hasOwnProperty("SAVETO")){
                                                                 o += "INSERT INTO boxes (box,val,width,dist,set) VALUES('"+row.box+"',"+row.val+", "+params.width+","+params.distance+",'"+sgl.SAVETO[1][0][0]+"');";
								}
                                                });
						query.on('end', function() {
					 if(sgl.hasOwnProperty("SAVETO")) db.query(o,function(err){if(!err){console.log("NO ERROR SAVING");db.end();}});
                                                                var json=(JSON.stringify(matrix));
                                                                response.write(json);
                                                                console.log("Map Sended "+count);
                                                                response.end();
                                                });
                                },
sum : function(bounds,response,params,fgrid,db,sgl){
			var count =0;
			var scn1= bounds.scenario1;
			var scn2 = bounds.scenario2;
			var sql = "select scn1.box, (scn1.val+scn2.val) as val from (select * from boxes where set = '"+scn1+"') as scn1, (select * from boxes where set = '"+scn2+"') as scn2  where scn1.box = scn2.box";
		var query =  db.query(sql,function(){});

			var matrix =  Array();
			var o ="";
			 if(sgl.hasOwnProperty("SAVETO")){
                              matrix.push({name:sgl.SAVETO[1][0][0]});
                             }
                                                query.on('row', function(row,result) {
							matrix.push({square:row.box,val:row.val});count++;
							  if(sgl.hasOwnProperty("SAVETO")){
                                                                 o += "INSERT INTO boxes (box,val,width,dist,set) VALUES('"+row.box+"',"+row.val+", "+params.width+","+params.distance+",'"+sgl.SAVETO[1][0][0]+"');";
								}
                                                });
						query.on('end', function() {
			
					 if(sgl.hasOwnProperty("SAVETO")) db.query(o,function(err){if(!err){console.log("NO ERROR SAVING");db.end();}});
                                                                var json=(JSON.stringify(matrix));
                                                                response.write(json);
                                                                console.log("Map Sended "+count);
                                                                response.end();
                                                });
                                }





                        }
;

module.exports = {
exec : function(bounds,response,params,fgrid,db,sgl){
	var operation = sgl.OPERATION[1][0][0];
	bounds.scenario1 = sgl.OPERATION[3][0][0];
	 bounds.scenario2 = sgl.OPERATION[5][0][0];
	switch(operation) {
		    case 'sub':
		        console.log("SUB");
		        block.sub(bounds,response,params,fgrid,db,sgl);
		        break;
		    case 'sum':
		        console.log("SUM");
		        block.sum(bounds,response,params,fgrid,db,sgl);
		        break;
		    case 'avg':
		        console.log("AVG");
		        block.avg(bounds,response,params,fgrid,db,sgl);
		        break;
		    default:
		        console.log("Operation not implemented");
		        break;
		}
	}
};

