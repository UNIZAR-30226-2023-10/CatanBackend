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

//Logging middleware
morgan.token('body', (req, _res) => JSON.stringify(req.body))
app.use(morgan(':method :url :body - :status'))

//Routes
app.use('/api',require('./routes/index'));

//Sockets
Socket.start(server)


//conexion base de datos
/*
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
//Iniciando el servidor
server.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});