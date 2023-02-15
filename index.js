#!/usr/bin/env node

const http = require('http');
const fs = require('fs');


const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'enbuscadeabascal';

async function db_connect() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('documents');

  // the following code examples can be pasted here...

  return 'conectados a la base de datos';
}

db_connect()
  .then(info => conosle.log(info))
  .catch(msg => console.error(msg));

 
 function send_characters(response)
{
	let collection = db.collection ('characters');

	collection.find({}),toArray().then(query => {
	
	let nombres = [];

	for(let i = 0; i < query.length; i++){
		nombres.push( query[i].name );
	}
	response.write(JSON.stringify(nombres));
  	response.end();
	});


}

  
function send_age(response, url_split)
{
	if(url_split.length < 3){
		response.write("error: Edad Erronia");
	  	response.end();
		return;
	}
	let collection = db.collection ('characters');

	collection.find({"name": url_split[2]}).project({_id:0,age:1})
			.toArray().then(character => {
	if (character.lenght == 0){
		response.write("ERROR: edad Erronea");
		response.end();
		return;
	}
		response.write(JSON.stringify(character[0]));
	  	response.end();
	});
}

let http_server = http.createServer(function(request, response){
	if (request.url == "/favicon.ico"){
		return;
	}

	let url_split = request.url.split("/");
	console.log(url_split);

	switch (url_split[1]){

			case "characters":
				send_characters(response);
				break;
			case "age":
				send_age(response, url_split);
				break;
			case "items":
				console.log("aqui van los items");
				break;
			default:
				console.log("default");
				fs.readFile("index.html", function(err, data){
					if(err){
						console.log(err);
	    			 	response.writeHead(404, {"Content-Type":"text/html"});
						response.write("Error 404: archivo no encontrado");
						response.end();
			
						return;
					}	
	   				response.writeHead(200, {"Content-Type":"text/html"});
					response.write(data);	
					response.end();
				});
		}
});

http_server.listen(6969);


