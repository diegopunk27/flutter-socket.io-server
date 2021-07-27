/*Se recibe el objeto io del archivo index, y de esta manera se separa del index el codigo que controla
el tráfico de mensajes
*/
const {io}= require('../index.js');

io.on('connection', client => {
    console.log("Cliente conectado");

    client.on('disconnect', () => {
        console.log("Cliente desconectado");
    });

    client.on('mensaje', function(payload){ 
        console.log("Nuevo mensaje: ", payload['contenido']); 
    
        io.emit('retorno', {contenido: "Mensaje recibido"});
    });
});