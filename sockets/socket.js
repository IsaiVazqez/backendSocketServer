const { io }= require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');


const bands = new Bands();
//console.log('init server')

bands.addBand(new Band('Arctic'));
bands.addBand(new Band('Waka'));
bands.addBand(new Band('Interpol'));
bands.addBand(new Band('Mang000'));
bands.addBand(new Band('asdasda'));
bands.addBand(new Band('Mangafasdfa000'));


console.log(bands);

//Mensajes de sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { 
        console.log('Cliente desconectado');
  });

  client.on('mensaje', (payload) => { 
      console.log('Mensaje!!', payload);
        io.emit('mensaje', {admin: 'Nuevo mensaje'});
  });


  client.on('emitir-mensaje', (payload) => {
    /* console.log(payload) */
    /* io.emit('nuevo-mensaje', payload); */ //Emite a todos
    client.broadcast.emit('nuevo-mensaje', payload);  //Emite a todos menos quién lo emitó
  })


  client.on('vote-band', (payload) => {
    bands.voteBand(payload.id);
    io.emit('active-bands', bands.getBands());
  });

  client.on('add-band', (payload) => {
    console.log(payload);
    const newBand = new Band(payload.name);
    bands.addBand(newBand);
    io.emit('active-bands', bands.getBands());
  });

  client.on('delete-band', (payload) => {

    bands.deleteBand( payload.id);
    io.emit('active-bands', bands.getBands());
  });

});