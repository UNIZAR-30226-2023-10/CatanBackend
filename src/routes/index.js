const { Router } = require('express')
const { verifyToken } = require( '../utils/auth')

const router = Router()
const AuthRouter = require('./auth.routes')
const GameRouter = require('./auth.routes')

router.use('/', AuthRouter)
router.use('/game', verifyToken, GameRouter)
//anyadir resto de subrutas que necesitan de login 
//router.use('/users', verifyToken, UsersRouter)

module.exports = router