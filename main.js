//LIBS
var util = require("util"),
    http = require('http'),
    url = require('url'),
    qs = require('querystring');
var pg = require('pg'); 
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}


process.on('uncaughtException', function (err) {
   // console.log(err);
}); 
//APPS
var grid = require('./grid');
var params = require('./params');
var sgl = require('./sgl');

		var conString = "tcp://"+params.db.user+":"+params.db.pass+"@"+params.db.host+"/"+params.db.db+"";
//Database
//Web server
var    port = process.argv[2] || 8000;
	console.log("starting server at port "+port);

var server = http.createServer(function(request, response) {
		var db = new pg.Client(conString);
	db.connect();
	
	console.log("new request");
//HEADERS
	var headers = {};
                var data="";
	headers["Access-Control-Allow-Origin"] = "*";
	headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
	headers["Access-Control-Allow-Credentials"] = false;
	headers["Access-Control-Max-Age"] = '86400'; // 24 hours
	headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
	response.writeHead(200, headers);

	  if(request.method === "POST") {
                request.on("data", function(chunk) {
                        data += chunk;
                        });

                request.on("end", function() {
               	var tx = JSON.parse(data);
			 if(tx.tx == "SGL"){
				var syn = clone(sgl);
				
				var st = syn.execute(tx.sgl);
				console.log(tx.sgl);
				console.log(st);
				if(st.hasOwnProperty("GET")){
				
					var handler = require('./browser');
					handler.get(tx,response,params,grid,db,st);
				
				}else
				if(st.hasOwnProperty("OPERATION")){
					var handler = require('./operators');
					handler.exec(tx,response,params,grid,db,st);
				}else{	
					var handler = require('./handlersgl');
					handler.create(tx,response,params,grid,db,st);
				}
			}
		});
	}
	});


server.listen(parseInt(port, 10));

















