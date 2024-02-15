var http = require('http');  
var url = require('url');  
var fs = require('fs');  
const oracledb = require("oracledb");

// oracledb.initOracleClient();

async function connect() {
    let connection;

    // Get the TNS service name from the $SVC_NAME environment variable
    const svcName = process.env.SVC_NAME;

    try {
          connection = await oracledb.getConnection({
                user: "appuser",
                password: "appuser",
                connectionString: svcName,
          });
          console.log("\nnode-oracledb driver version is " + oracledb.versionString);
          console.log("\nOracle client version is " + oracledb.oracleClientVersionString + "\n");
    } catch (err) {
          console.error(err);
    }
}

// connect();



var server = http.createServer(async function(request, response) {  
    var path = url.parse(request.url).pathname;  
    console.log("path",url.parse(request.url))
    switch (path) {  
        case '/':  
            fs.readFile(__dirname + "/form.html", function(error, data) {  
                if (error) {  
                    console.log("Error", error);
                    response.writeHead(404);  
                    response.write(error);  
                    response.end();  
                } else {  
                    response.writeHead(200, {  
                        'Content-Type': 'text/html'  
                    });  
                    response.write(data);  
                    response.end();  
                }  
            }); 
            break;
        case '/data':  
            fs.readFile(__dirname + "/data.html", function(error, data) {  
                if (error) {  
                    console.log("Error", error);
                    response.writeHead(404);  
                    response.write(error);  
                    response.end();  
                } else {  
                    response.writeHead(200, {  
                        'Content-Type': 'text/html'  
                    });  
                    response.write(data);  
                    response.end();  
                }  
            }); 
            break;  
        case '/get_data':
            var queryData = url.parse(request.url, true).query; 
            console.log("queryData.sDate", queryData.sDate); 
            console.log("queryData.eDate", queryData.eDate); 

            result = await connection.execute(
                "select * from v$version",
                [], {
                resultSet: true,
                outFormat: oracledb.OUT_FORMAT_OBJECT
                }
          );

          rs = result.resultSet;

          let row;
          while ((row = await rs.getRow())) {
                console.log(row);
          }
          await rs.close();


            data =  [{
                name: "Kapil",
                age:  21,
                status: "Active"
            },
            {
                name: "John",
                age:  28,
                status: "Inactive"
            },
            {
                name: "Deos",
                age:  18,
                status: "Active"
            }];
            
            response.writeHead(200, {  
                'Content-Type': 'application/json'  
            });
            response.write(JSON.stringify(data));  
            response.end();  
            break;    
        default:  
            response.writeHead(404);  
            response.write("opps this doesn't exist - 404");  
            response.end();  
            break;  
    }  
});  

server.listen(8082);  

console.log("Server is running on Port::8082");
