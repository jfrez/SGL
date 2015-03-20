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
get : function(bounds,response,params,fgrid,db,sgl){
		var name = sgl.GET[1][0][0];
			var sql = "select box, val from boxes where set = '"+name+"'";
		var query =  db.query(sql,function(err){console.log(err);

        							db.end();
});

			var matrix =  Array();
							matrix.push({name:name});
                                                query.on('row', function(row,result) {
							matrix.push({square:row.box,val:row.val});
                                                });
						query.on('end', function() {
                                                                var json=(JSON.stringify(matrix));
                                                                response.write(json);
                                                                console.log("Map Sended :"+matrix.length+" boxes");
                                                                response.end();
                                                });
                                }


                        }
;
