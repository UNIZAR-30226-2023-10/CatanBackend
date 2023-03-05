const mongoose = require('mongoose')
const Schema = mongoose.Schema


/*
    Ejemplo sencillo que almacena una cadena y un número
*/
const Ejemplo = mongoose.Schema(
    {
        nombre: { type: String, required: true },
        numero: { type: Number, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('ejemplo', Ejemplo);