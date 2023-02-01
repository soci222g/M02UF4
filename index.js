#!/usr/bin/env node


const http = require('http');

http.createServer(function(request, result){
console.log('alguin ha entrador');
result.write('ola k ase');
result.end();
}).listen(8080);
