const { Router } = require('express')
const { verifyToken } = require( '../utils/auth')
const CatanModule = require('../catan/move')
const GamesModel = require('../models/game.model')

const router = Router()
const AuthRouter = require('./auth.routes')
const GameRouter = require('./game.routes')
const UserRouter = require('./user.routes')

router.use('/', AuthRouter)
router.use('/game', verifyToken, GameRouter)
router.use('/user', verifyToken, UserRouter)
router.post('/test', async (req, res) => {   

    let codigoPartida = Math.floor(Math.random() * (90000 - 10000 + 1) +10000 )

    let game = CatanModule.crearPartida(req.body.jugadores, codigoPartida)

    let partida = new GamesModel({
        codigo_partida : codigoPartida,
        jugadores : req.body.jugadores,
        game : game,
        anfitrion : req.body.jugadores[0],
        comenzada : true
    })

    await partida.save()

    return res.status(200).json({
        codigo_partida: codigoPartida,
        game : game
    })
    
})
//anyadir resto de subrutas que necesitan de login 
//router.use('/users', verifyToken, UsersRouter)

module.exports = router