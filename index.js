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

//websockets
const socketIO = require('socket.io');
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('A new user is connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('An Id was disconected:', socket.id);
    })
});