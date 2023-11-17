require('dotenv').config()
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');


const db = require('./database/db');

const mainRouter = require('./routes/index');
const { socketController } = require('./sockets/socketController');

const port = process.env.PORT || 3001;
const app = express();


// socket.io
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => socketController(socket, io));
 


server.listen(port, () => {
  console.log(`%s listening at ${port}`)
  db();
})


// Midlewares

app.use(express.json()); // Lectura y parseo del body

app.use(cors()) // Cors

app.use(fileUpload({ // Carga de archivos (PONER ANTES QUE LA RUTA PRINCiPAL)
  useTempFiles : true,
  tempFileDir : '/tmp/',
  createParentPath: true // si no existe la carpeta, la crea automaticamente
}));

app.use('/api', mainRouter);  // Ruta principal

app.use(express.static('public')); // Directorio Public




