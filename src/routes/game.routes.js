const { Router } = require('express')
const Game = require("../controllers/game.controller")
const GameRouter = Router()

GameRouter.post('/create', Game.create)
GameRouter.post('/join', Game.join)
GameRouter.post('/start' , Game.start)

module.exports = GameRouter

