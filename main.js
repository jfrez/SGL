//LIBS
var util = require("util"),
    http = require('http'),
    url = require('url'),
    qs = require('querystring');
var pg = require('pg'); 


process.on('uncaughtException', function (err) {
    console.log(err);
}); 
//APPS
var grid = require('./grid');
var params = require('./params');

//Database
var conString = "tcp://"+params.db.user+":"+params.db.pass+"@"+params.db.host+"/"+params.db.db+"";
var db = new pg.Client(conString);
//Web server
var    port = process.argv[2] || 8000;
	console.log("starting server at port "+port);

	db.connect();
var server = http.createServer(function(request, response) {
	db.connect();
	
	console.log("new request");
//HEADERS
	var headers = {};
	headers["Access-Control-Allow-Origin"] = "*";
	headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
	headers["Access-Control-Allow-Credentials"] = false;
	headers["Access-Control-Max-Age"] = '86400'; // 24 hours
	headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
	response.writeHead(200, headers);

	  if(request.method === "POST") {
                var data="";
                request.on("data", function(chunk) {
                        data += chunk;
                        });

                request.on("end", function() {
               	var tx = JSON.parse(data);
console.log(tx);
			 if(tx.tx == "CREATETIME"){
				var handler = require('./handler');
				handler.createtime(tx,response,params,grid,pg);
			}
			
			 if(tx.tx == "GET"){
				var handler = require('./browser');
				handler.get(tx,response,params,grid,pg);
			}
			 if(tx.tx == "SUBTRACT"){
				var handler = require('./operators');
				handler.sub(tx,response,params,grid,pg);
			}
			
			 if(tx.tx == "AVERAGE"){
				var handler = require('./operators');
				handler.avg(tx,response,params,grid,pg);
			}

			 if(tx.tx == "SUM"){
				var handler = require('./operators');
				handler.sum(tx,response,params,grid,pg);
			}
			 if(tx.tx == "SAVE"){
				var handler = require('./utils');
				handler.save(tx,response,params,grid,pg);
			}
			 if(tx.tx == "LIST"){
				var handler = require('./utils');
				handler.list(tx,response,params,grid,pg);
			}
			 if(tx.tx == "SGL"){
				var syn = require('./sgl');
				var handler = require('./handlersgl');
				var st = syn.execute(tx.sgl);	
				handler.create(tx,response,params,grid,pg,st);
			}
		});
	}
	});


server.listen(parseInt(port, 10));

















