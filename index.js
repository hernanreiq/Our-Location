const { Socket } = require('dgram');
const express = require('express');
const app = express();
const path = require('path');
const engine = require('ejs-mate');

//routes file
const routes = require('./routes/index');

//settings
const PORT = process.env.PORT || 3700;
app.engine('ejs', engine);
app.set('view engine', 'ejs'); 

//static files
app.use(express.static(path.join(__dirname, 'public')));

//start server
const server = app.listen(PORT, () => {
    console.log('Server is ready on port:', PORT);
});

//routes
app.use('/', routes);

//Bloquea las rutas no definidas
app.use((req, res)=>{
    res.status(404).redirect('/');
});

//websockets
const socketIO = require('socket.io');
const io = socketIO(server);

io.on('connection', (socket) => {
    //CONTADOR DE USUARIOS
    var countUsers = io.engine.clientsCount;
    io.sockets.emit('users_online', countUsers);
    
    //CUANDO UN USUARIO INICIA SESIÓN ENVÍA SUS DATOS A TODOS LOS CONECTADOS
    socket.on('user_coordinates', data => {
        socket.broadcast.emit('user_connected', data);
    });
    
    //LOS USUARIOS QUE YA ESTABAN CONECTADOS LE ENVIAN SUS DATOS AL USUARIO NUEVO
    socket.on('old_user_coordinates', data => {
        socket.broadcast.to(data.newUserId).emit('old_user_coords', data.coords);
    });
    
    //ACTUALIZAR EL CONTADOR DE USUARIOS
    socket.on('disconnect', () => {
        countUsers = io.engine.clientsCount;
        io.sockets.emit('users_online', countUsers);
    });
});