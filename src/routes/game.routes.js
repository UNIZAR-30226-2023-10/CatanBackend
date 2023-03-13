const { Router } = require('express')
const Game = require("../controllers/game.controller")
const GameRouter = Router()

GameRouter.use('create', Game.create)
GameRouter.use('join', Game.join)
GameRouter.use('star' , Game.start)
module.exports = GameRouter

