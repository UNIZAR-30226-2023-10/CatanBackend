const { Router } = require('express')
const { TopologyDescription } = require('mongodb')
const { notify } = require('./auth.routes')
const GameRouter = Router()

GameRouter.use('create', Game.create)//crea partida y genera un codigo
GameRouter.use('join' Game.join)
module.exports = GameRouter

