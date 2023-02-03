#!/usr/bin/node


const http = require('http');
const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'enbuscadeabascal';

let db;

async function db_connect() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  db = client.db(dbName);
  //const collection = db.collection('documents');

  // the following code examples can be pasted here...

  return 'conectados a la base de datos de mongodb.';
}

db_connect()
  .then(info => console.log(info))
  .catch(msg => console.error(msg));


let http_server = http.createServer(function(request, response){
let collection = db.collection('characters');
console.log (collection);
console.log('alguin ha entrador');
response.write('ola k ase');
result.end();
});

http_server.listen(6969);




