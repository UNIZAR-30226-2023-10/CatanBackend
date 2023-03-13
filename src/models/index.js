const mongoose = require('mongoose')

const users = require('./user.model.js')
const games = require('./game.model.js')

mongoose.Promise = global.Promise

const db = {
    url: 'mongodb://localhost:27017/catan',
    mongoose: mongoose,
    users: users,
    games: games,
}

module.exports = db