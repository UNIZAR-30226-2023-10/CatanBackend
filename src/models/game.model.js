const  mongoose = require('mongoose')
//const bcrypt = require('bcrypt')
const GameSchema = mongoose.Schema({
    game: {
        type: Object,
    },
    codigo_partida: {
        type: Number,
        required: true,
        unique: false
    },
    anfitrion: {
        type : String,
        // type: mongoose.Schema.ObjectId,
        // ref: 'User',
        required: true,
        unique: false
    },
    jugadores: {
        type: [String]
        // type: [mongoose.Schema.ObjectId],
        // ref: 'User',
    },
    comenzada : {
        type : Boolean,
        unique: false
    },
    chat : {
        type : [Object]
    },
    desconectados : {
        type: [String]
        // type: [mongoose.Schema.ObjectId],
        // ref: 'User',
    },
})

const GameModel = mongoose.model('Game', GameSchema)
module.exports  = GameModel