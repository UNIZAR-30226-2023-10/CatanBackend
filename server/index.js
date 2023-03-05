/*
    Proyecto Software

    Fichero: CatanBackend/index.js

    Descripción: Punto de arranque del backend.
*/

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./db')
const ejemploRouter = require('./routes/ejemplo-router')

const app = express()
const PORT = process.env.PORT || 3001 // Puerto por defecto 3001


app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDb conection error:'))

app.get('/', (req, res) => {
    res.send('Hola mundo')
})

app.use('/api', ejemploRouter)

// Comienza a escuchar peticiones externas
app.listen(PORT, () => { console.log(`Escuchando a peticiones en el puerto ${PORT}`); })

