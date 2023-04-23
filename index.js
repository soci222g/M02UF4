#!/usr/bin/node
const http = require('http');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const qs = require('querystring');
//conection url 
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

//database name
const dbName = 'enbuscadeabascal';

let db;
let collection;
async function db_connect() {
	//use conection method to conect to the server
	await client.connect();
	console.log('Connected successfully to sever');
	db = client.db(dbName);
	//const collection = db.collection('characters');

	//the following code examples can be paste here...



	return 'Conectandonos a la base de datos de mongoDB ';
}

db_connect()
	.then(info => console.log(info))
	.catch(msg => console.error(msg));

function send_characters (response){
	collection = db.collection('characters');
	
	collection.find({}).toArray()
	.then(characters =>{ 
		let names = [];
		
		for (let i = 0; i < characters.length; i++){
			names.push(characters[i].name);
		}

		response.write(JSON.stringify(names));
		response.end();
	});
}
function send_character_items (response, url)
{
	let name = url[2].trim();
	if (name == ""){
		response.write("error, URL not accepted");
		response.end()
		return;
	}
	let collection = db.collection('character');
	collection.find({"name": name}).toArray();then(character =>{
		if (character.length != 1){
			response.write("error, el personaje"+name+" no existe");
			response.end();

			return;
			
		}
		
		let id = character[0].id_character;
		 collection = db.collection('character_items');
		collection.find({"id_character":id}).toArray().then(ids =>{
			if (ids.length == 0) {
				response.write("[]");
				response.end();

				return;

			}

			let ids_items = [];

			ids.forEache(element => {
				ids_items.push(element.id_item);

			});

			 collection = db.collection("items");
			collection.find({"id_item": {$in:ids} }).toArray().then(items => {
				response.write(JSON.stringify(items));
				response.end();

				return

			});

		});
	
	});

}

  
 
function send_items(response, url_split)
{
	if(url_split.length < 3){
		send_character_items (response, url_split);

		return;
	}
	 collection = db.collection ('items');

	collection.find({}).toArray().then(character => {

	let names = []
	
	for ( let i = 0; i <items.length; i++){
		names.push(items[i].item );

	}
		response.write(JSON.stringify(names));
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
	collection = db.collection ('character');

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

function sendCharacterInfo(response, id_character) {

	collection = db.collection('characters');
	
	collection.find({ "id_character": Number(id_character) }).project({ _id: 0 }).toArray()
		.then(character => {
			response.write(JSON.stringify(character));
			response.end();
		});	
}

let http_server = http.createServer(function(request, response){
	if (request.url == "/favicon.ico"){
		return;
	}

	let url_split = request.url.split("/");
	let Second_split = request.url.split("?")
	console.log(url_split);

	switch (url_split[1]){

			case "characters":
				send_characters(response);
				break;
			case "age":
				send_age(response, url_split);
				break;
			case "items":
			
				send_items(response, url_split);
				
				break;
			default:
				console.log("default");
				
				if(Second_split[1]){
					let new_split = Second_split[1].split("=");
					let id_character = new_split[1];

					sendCharacterInfo(response, id_character);
					return;
				}
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

http_server.listen(8080);


