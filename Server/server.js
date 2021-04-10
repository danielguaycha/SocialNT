require('./config'); // cargamos el archivo de configuraciens globales
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const morgan = require('morgan');

const fileUpload = require('express-fileupload');
const path = require('path');
const SocketServer = require('./middleware/socket');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.resolve(__dirname, './public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
//app.use(morgan('dev'));

// middlewares
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


app.use('/api', require('./routes/publication'));
app.use('/api', require('./routes/user'));
app.use('/api', require('./routes/follow'));
app.use('/api', require('./routes/message'));
app.use('/api', require('./routes/reaction'));
app.use('/api', require('./routes/comment'));
app.use('/api', require('./routes/notification'));

global.socketServer = new SocketServer(io);
socketServer.socketConfig();

server.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado en el puerto ${ process.env.PORT }`);   
});

