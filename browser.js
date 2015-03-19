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
get : function(bounds,response,params,fgrid,pg){
var conString = "tcp://"+params.db.user+":"+params.db.pass+"@"+params.db.host+"/"+params.db.db+"";
var db = new pg.Client(conString);
        db.connect();
			var sql = "select box, val from boxes where set = '"+bounds.set+"'";
			console.log(sql);
		var query =  db.query(sql,function(err){console.log(err);

        							db.end();
});

			console.log();
			var matrix =  Array();
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
