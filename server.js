'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
const app = express();
var fs = require('fs');
var alarma;
var TiempoEspera=600000;
var FinalizaTiempo;
var InicioEscritura=50000;
var dia;
var Fecha=new Date().toTimeString();
var AlarmaUno=false;
var mensaje;
const PORT = process.env.PORT || 3001;
const INDEX = path.join(__dirname, 'index.html');



const server = express().
  get('/test', function (req, res){
  var arduino=req.params('led');
  console.log('Arduino: '+arduino);
  res.send('Alarma Arduino recibida')})
 .use((req, res) => res.sendFile(INDEX))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
 
 


const wss = new SocketServer({ server });

wss.on('connection', function(ws) {
	  console.log('client conected');

    ws.on('message', function(message) {
        dia=new Date();
        FinalizaTiempo=dia + TiempoEspera;
        alarma=message;
        mensaje=JSON.parse(message);
        console.log('[received]: %s', message);

       if(mensaje.conexion>=0){
        var dataconexion=' ---Usuario: '+mensaje.name+' ---Conexion: '+mensaje.conexion+' ---Date: '+mensaje.date+' ---Ubicacion: '+mensaje.ip;
        console.log('[conexion]: %s', dataconexion);
       }

        if(mensaje.alarmasC>0){
        var dataalarma=' ---Usuario: ' +mensaje.name+' ---Alarma: '+mensaje.alarmasC+' ---Date: '+mensaje.date+' ---Ubicacion: '+mensaje.ip;
        console.log('[alarma]: %s', dataalarma);
       }

      
        if(mensaje.ErrorEthernet>=0){
        
        var dataerrorethernet='---Usuario: '+mensaje.name+'---Alarma:ErrorEthernet: '+mensaje.ErrorEthernet+'---Date: '+mensaje.date+'---Ubicacion: '+mensaje.ip;
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



  