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
    socket.on('user_coordinates', coords => {
        socket.broadcast.emit('user_connected', coords);
    })
});