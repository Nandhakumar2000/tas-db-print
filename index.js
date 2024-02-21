var http = require('http');  
var url = require('url');  
var fs = require('fs');  
const oracledb = require("oracledb");
 
clientOpts = { libDir: 'C:\\instantclient_21_13' };
oracledb.initOracleClient();

let connection;

async function connect() {
    try {
          connection = await oracledb.getConnection({
                user: "system",
                password: "chemtasrla",
                connectionString: "localhost/chem",
          });
          console.log("\nnode-oracledb driver version is " + oracledb.versionString);
          console.log("\nOracle client version is " + oracledb.oracleClientVersionString + "\n");
    } catch (err) {
          console.log("Connection Error");
          console.error(err);
    }
}

connect();



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

            try {
            const result = await connection.execute(
                // The statement to execute
                `SELECT *
                 FROM tfms`,
          
                // The "bind value" 3 for the bind variable ":idbv"
                 [],
          
                // Options argument.  Since the query only returns one
                // row, we can optimize memory usage by reducing the default
                // maxRows value.  For the complete list of other options see
                // the documentation.
                {
                  //  maxRows: 1
                  //, outFormat: oracledb.OUT_FORMAT_OBJECT  // query result format
                  //, fetchArraySize: 100                    // internal buffer allocation size for tuning
                });
          
              console.log("Query metadata:", result.metaData);
              console.log("Query rows:", result.rows);
          
              response.writeHead(200, {  
                'Content-Type': 'application/json'  
            });
            response.write(JSON.stringify(data));  
            response.end(); 

            } catch (err) {
              console.error(err);
            } finally {
              if (connection) {
                try {
                  // Connections should always be released when not needed
                  await connection.close();
                } catch (err) {
                  console.error(err);
                }
              }
            }

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
