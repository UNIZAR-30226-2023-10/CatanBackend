// Importar modulo Express
const express = require('express');
// Configuración de la aplicación de Express:
const app = express()                       // 1. Creación de la instancia.
const API_PORT = process.env.PORT || 8080   // 2. Selección del puerto desde el cuál el servidor escuchará.
app.set('port', API_PORT)                   // 3. Asignación del puerto.
app.set('json spaces', 2)                   // 4. Ajuste del espaciado de los ficheros JSON.
const server = require("http").Server(app); // 5. Servidor HTTP.
// Rutas que usará el servidor.
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

//conexion base de datos
/*
// Modelo para el manejo de la base de datos.
const db = require('./models/index.js')
db.mongoose
    .connect(db.url)
    .then(() => {
        console.log('Connected to the database')
    })
    .catch((err) => {
        console.log('Cannot connect to the database! \n', err)
        process.exit()
    })
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
