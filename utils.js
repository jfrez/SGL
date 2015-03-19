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
list : function(bounds,response,params,fgrid,pg){
var conString = "tcp://"+params.db.user+":"+params.db.pass+"@"+params.db.host+"/"+params.db.db+"";
var db = new pg.Client(conString);
        db.connect();
			var sql = "select set from boxes group by set";
		var query =  db.query(sql);

			var matrix =  Array();
                                                query.on('row', function(row,result) {
							matrix.push(row.set);
                                                });
						query.on('end', function() {
                                                                var json=(JSON.stringify(matrix));
                                                                response.write(json);
                                                                console.log("Sets sended");
                                                                response.end();
                                                });
                                },
save : function(bounds,response,params,fgrid,pg){
var conString = "tcp://"+params.db.user+":"+params.db.pass+"@"+params.db.host+"/"+params.db.db+"";
var db = new pg.Client(conString);
        db.connect();
console.log(bounds);
 var o = "INSERT INTO hypset (set,text) VALUES('"+bounds.set+"','"+bounds.hyplist+"');";
                                                                 db.query(o);
					response.write("saved");
					response.end();

                                }



                        }
;
