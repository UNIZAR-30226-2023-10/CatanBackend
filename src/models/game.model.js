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
    }
})

GameSchema.pre('save', function(next) {
    console.log("guardado de partida")
    var partida = this
    var jugadores = []
    if(partida.game && partida.game.jugadore){
            for (i in jugadores){
                partida.game.jugadores[i] = {
                    id: partida.game.jugadores[i].id,
                    free_nodes: [...partida.game.jugadores[i].free_nodes],
                    free_roads: [...partida.game.jugadores[i].free_roads],
                    villages: [...partida.game.jugadores[i].villages],
                    cities: [...partida.game.jugadores[i].cities],
                    roads: [...partida.game.jugadores[i].roads],
                    resources: partida.game.jugadores[i].resources,
                    growth_cards: partida.game.jugadores[i].growth_cards,
                    used_knights: partida.game.jugadores[i].used_knights,
                    first_roll : partida.game.jugadores[i].first_roll
                }

            }

    }
    return newt()
})


GameSchema.post('find', function(result) {
    if(result.game && result.game.jugadore){
        for (i in jugadores){
            result.game.jugadores[i] = {
                id: result.game.jugadores[i].id,
                free_nodes: new Set(result.game.jugadores[i].free_nodes),
                free_roads: new Set(result.game.jugadores[i].free_roads),
                villages: new Set(result.game.jugadores[i].villages),
                cities: new Set(result.game.jugadores[i].cities),
                roads: new Set(result.game.jugadores[i].roads),
                resources: result.game.jugadores[i].resources,
                growth_cards: result.game.jugadores[i].growth_cards,
                used_knights: result.game.jugadores[i].used_knights,
                first_roll : result.game.jugadores[i].first_roll
            }

        }
    }
})

const GameModel = mongoose.model('Game', GameSchema)
module.exports  = GameModel