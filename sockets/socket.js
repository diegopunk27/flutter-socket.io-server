/*Se recibe el objeto io del archivo index, y de esta manera se separa del index el codigo que controla
el tráfico de mensajes
*/
const { io } = require('../index.js');
const Band = require('../models/band.js');
const Bands = require('../models/bands.js');

const bands = new Bands;

bands.addBand(new Band('Matellica'));
bands.addBand(new Band('Nirvana'));
bands.addBand(new Band('Pearl Jam'));
bands.addBand(new Band('Rata Blanca'));

io.on('connection', client => {
    // Mensaje en consola al conectase un cliente
    console.log("Cliente conectado");

    // Mensaje en consola al desconectase un cliente
    client.on('disconnect', () => {
        console.log("Cliente desconectado");
    });

    client.on('mensaje', function (payload) {
        console.log("Nuevo mensaje: ", payload['contenido']);

        io.emit('retorno', { contenido: "Mensaje recibido" });
    });

    client.on('emitir-mensaje', function (payload) {
        client.broadcast.emit('nuevo-mensaje', payload);// Emite a todos menos a si mismo el payload recibido
    });

    /* Sockets de bandas*/
    
    //Emite a todos los clientes el objeto con las bandas
    client.emit('active-bands', bands.getBands());
    
    //Recibe un voto, y luego vuelve a enviar las bandas con los votos actualizados
    client.on('new-vote', function(payload){
        //console.log(payload.id);
        bands.voteBand(payload.id);
        //console.table(bands.getBands());
        emitirBanda();
    });

    //Recibe un nombre de banda y la crea
    client.on('new-band', function(payload){
        bands.addBand(new Band(payload.name));
        emitirBanda();
    });

    //Recibe el id de una banda, y la elimina
    client.on('delete-band', function(payload){
        bands.deleteBand(payload.id);      
        emitirBanda();
    });

    /*Funcion para emitir las bandas a todos los clientes conectados*/
    function emitirBanda(){
        io.emit('active-bands', bands.getBands());
    }
});