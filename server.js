'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
var fs = require('fs');
var alarma;
var Fecha=new Date().toTimeString();

const PORT = process.env.PORT || 3001;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', function(ws) {
	  console.log('client conected');

    ws.on('message', function(message) {
        console.log('received: %s', message);
        alarma=message;
       if(alarma.conexion!==undefined){
         var dia=new Date();
        data='-Usuario: '+alarma.name+'-Conexion'+alarma.conexion+'-Date'+d.toUTCString()+'-Ubicacion'+alarma.ip+'/n ';
        fs.appendFile('serverlog.txt',data, function(err) {
       if( err ){
        console.log( err );
          });
        }
      });

       if(alarma.alarma!==undefined){
         var dia=new Date();
        data='-Usuario: '+alarma.name+'-Alarma'+alarma.alarma+'-Date'+d.toUTCString()+'-Ubicacion'+alarma.ip+'/n ';
        fs.appendFile('serverlog.txt',data, function(err) {
       if( err ){
        console.log( err );
          });
        }
      });
      
        if(alarma.ErrorEthernet!==undefined){
         var dia=new Date();
        data='-Usuario: '+alarma.name+'-Alarma'+alarma.ErrorEthernet+'-Date'+d.toUTCString()+'-Ubicacion'+alarma.ip+'/n ';
        fs.appendFile('serverlog.txt',data, function(err) {
       if( err ){
        console.log( err );
          });
        }
      });

    
   ws.on('close',() =>console.log('client disconected'));
});




setInterval(() => {
  wss.clients.forEach((client) => {
  	client.send(alarma);
  	
   });
},1000);



  