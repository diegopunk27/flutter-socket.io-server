//Imports packages
const express = require('express');
const path = require('path');
require('dotenv').config();

//App express
const app = express();

//Node Server
const server = require('http').createServer(app);
//const io = require('socket.io')(server);
/*Se modificó const io por module.exports.io para pasar el objeto al archivo socket.js*/
module.exports.io= require('socket.io')(server);

//Mensajes sockets
require('./sockets/socket.js');

//Path publico
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

server.listen(process.env.PORT, (err) => {
    if (err) throw new Error(err);
    console.log('Servidor conectado al puerto', process.env.PORT);
});