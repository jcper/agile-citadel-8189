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
        FinalizaTiempo=dia + TiempoEspera
        alarma=message;
       if(alarma.conexion!==undefined){
        dataconexion='-Usuario: '+alarma.name+'-Conexion'+alarma.conexion+'-Date'+dia.toUTCString()+'-Ubicacion'+alarma.ip;
        console.log('[conexion]: %s', dataconexion);
       }

        if(alarma.alarma!==undefined && dia >=FinalizaTiempo){
        dataalarma='-Usuario: '+alarma.name+'-Conexion'+alarma.conexion+'-Date'+dia.toUTCString()+'-Ubicacion'+alarma.ip;
        console.log('[alarma]: %s', datalarma);
        FinalizaTiempo=0; 
       }

      
        if(alarma.ErrorEthernet!==undefined){
         var dia=new Date();
        dataerrorethernet='-Usuario: '+alarma.name+'-Alarma:ErrorEthernet'+alarma.ErrorEthernet+'-Date'+dia.toUTCString()+'-Ubicacion'+alarma.ip;
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



  