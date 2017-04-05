'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
var fs = require('fs');
var alarma;
var TiempoEspera=600000;
var FinalizaTiempo;
var dia;
var Fecha=new Date().toTimeString();
var mensaje;
const PORT = process.env.PORT || 3001;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', function(ws) {
	  console.log('client conected');

    ws.on('message', function(message) {
        dia=new Date();
        FinalizaTiempo=dia + TiempoEspera;
        alarma=message;
        mensaje=JSON.parse(message.data);
       if(message.conexion>=0){
        dataconexion='-Usuario: '+message.name+'-Conexion'+message.conexion+'-Date'+dia.toUTCString()+'-Ubicacion'+message.ip;
        console.log('[conexion]: %s', dataconexion);
       }

        if(message.alarma!==undefined && dia>=FinalizaTiempo){
        dataalarma='-Usuario: '+message.name+'-Conexion'+message.conexion+'-Date'+dia.toUTCString()+'-Ubicacion'+message.ip;
        console.log('[alarma]: %s', datalarma);
        FinalizaTiempo=0; 
       }

      
        if(message.ErrorEthernet>=0){
        
        dataerrorethernet='-Usuario: '+message.name+'-Alarma:ErrorEthernet'+message.ErrorEthernet+'-Date'+dia.toUTCString()+'-Ubicacion'+message.ip;
        console.log('[ErrorEthernet]: %s', dataerrorethernet);
       }
      });

    
   ws.on('close',() =>console.log('client disconected'));
});




setInterval(() => {
  wss.clients.forEach((client) => {
  	client.send(alarma);
  	
   });
},1000);



  