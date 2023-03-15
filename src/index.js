// Importar modulo Express
const express = require('express');
const app = express();
const morgan = require('morgan');
const db = require('./models/index.js')
const server = require("http").Server(app);
const Socket = require('./sockets/index');

const API_PORT = process.env.PORT || 8080
//Configuraciones
app.set('port',  API_PORT );
app.set('json spaces', 2)
app.disable('etag')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Logging middleware
morgan.token('body', (req, _res) => JSON.stringify(req.body))
app.use(morgan(':method :url :body - :status'))

//Routes
app.use('/api',require('./routes/index'));

// Logging middleware
//  Importar morgan.
const morgan = require('morgan');
//  Transforma el cuerpo de la peticion en un JSON.
morgan.token('body', (req, _res) => JSON.stringify(req.body))
//  Indica la información que se registrará de las solicitudes entrantes.
app.use(morgan(':method :url :body - :status'))

// Modelo para el manejo de Sockets.
const Socket = require('./sockets/index');
// Sockets: inicia una conexión socket.io en el servidor.
Socket.start(server)

<<<<<<< HEAD
=======
//conexion base de datos
/*
// Modelo para el manejo de la base de datos.
const db = require('./models/index.js')
>>>>>>> 90054b5dad82d53bb9557c05e53f9dea2c4964b9
db.mongoose
    .connect(db.uri)
    .then(() => {
        console.log('Connected to the database')
    })
    .catch((err) => {
        console.log('Cannot connect to the database! \n', err)
        process.exit()
    })
<<<<<<< HEAD
//Iniciando el servidor
server.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});
=======
*/

app.get('/', (req, res) => {
    return res.send(`
    <style>
        .EasterEgg {
            width: 100%;
            height: 100%;
            line-height: 100px;
            text-align: center;
        }
    </style>
    <div class='EasterEgg'>
        What are you doing here?
    </div>
    `);
})

server.listen(app.get('port'), () => 
    console.log(`Server listening on port ${app.get('port')}`)
);
>>>>>>> 90054b5dad82d53bb9557c05e53f9dea2c4964b9
