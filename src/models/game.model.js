const  mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching-v3')

const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/



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

const UserModel = mongoose.model('Game', GameSchema)

module.exports = UserModel