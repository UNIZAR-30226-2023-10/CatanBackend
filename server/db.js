/*
    Proyecto Software

    Fichero: CatanBackend/db.js

    Descripción: Conexión con base de datos MongoDB.
*/

const mongoose = require('mongoose')

mongoose
    .connect('mongodb://localhost:27017/ejemplo', { useNewUrlParser: true })
    .catch(e => { console.error('Error de conexión con base de datos.', e.message); })

const db = mongoose.connection

module.exports = db;