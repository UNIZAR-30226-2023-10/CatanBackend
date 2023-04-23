// Importar modulo Express
const express = require('express');
const app = express();
const morgan = require('morgan');
const db = require('./models/index.js')
const  cors =require('cors')

const API_PORT = process.env.PORT || 8080
//Configuraciones
app.set('port',  API_PORT );
app.set('json spaces', 2)
app.disable('etag')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Logging middleware
morgan.token('body', (req, _res) => JSON.stringify(req.body))
app.use(morgan(':method :url :body - :status'))

app.get('/', (req, res) => {
    return res.status(200).json({"Esta corriendo" : 'la api' })
})
//Routes
app.use('/api',require('./routes/index'));


// Modelo para el manejo de Sockets.
const server = require("http").Server(app);
const Socket = require('./sockets/index');
// Sockets: inicia una conexión socket.io en el servidor.
Socket.start(server)

db.mongoose
    .connect(db.uri)
    .then(() => {
        console.log('Connected to the database')
    })
    .catch((err) => {
        console.log('Cannot connect to the database! \n', err)
        process.exit()
    })
//Iniciando el servidor
server.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});
