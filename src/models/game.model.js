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
    var partida = this
    var jugadores = []
    if(partida.game)
        if(partida.game.players)
            for (i in partida.game.players){
                partida.game.players[i] = {
                    id: partida.game.players[i].id,
                    free_nodes: [...partida.game.players[i].free_nodes],
                    free_roads: [...partida.game.players[i].free_roads],
                    villages: [...partida.game.players[i].villages],
                    cities: [...partida.game.players[i].cities],
                    roads: [...partida.game.players[i].roads],
                    resources: partida.game.players[i].resources,
                    growth_cards: partida.game.players[i].growth_cards,
                    used_knights: partida.game.players[i].used_knights,
                    first_roll : partida.game.players[i].first_roll
                }
            }
    return next()
})


GameSchema.post(/find*/, async function(result) {
    console.log("post find")
    if(result.game)
        if(result.game.players){
            for (i in result.game.players){
                result.game.players[i] = {
                    id: result.game.players[i].id,
                    free_nodes: new Set(result.game.players[i].free_nodes),
                    free_roads: new Set(result.game.players[i].free_roads),
                    villages: new Set(result.game.players[i].villages),
                    cities: new Set(result.game.players[i].cities),
                    roads: new Set(result.game.players[i].roads),
                    resources: result.game.players[i].resources,
                    growth_cards: result.game.players[i].growth_cards,
                    used_knights: result.game.players[i].used_knights,
                    first_roll : result.game.players[i].first_roll
                }

            }
    }
})

const GameModel = mongoose.model('Game', GameSchema)
module.exports  = GameModel