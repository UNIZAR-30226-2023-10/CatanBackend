const mongoose = require('mongoose')
const pass = 'tomyrRHX2Y4xQAG9'
const dbname = 'test' // "prod"
const uri = `mongodb+srv://admin:admin@clustercatan.yixy5xm.mongodb.net/?retryWrites=true&w=majority`
const users = require('./user.model.js')
const games = require('./game.model.js')

mongoose.Promise = global.Promise

const db = {
    uri : uri,
    users : users,
    games : games,
    mongoose: mongoose
}

module.exports = db