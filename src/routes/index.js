const { Router } = require('express')


const router = Router()
const AuthRouter = require('./auth.routes')

router.use('/', AuthRouter)
//anyadir resto de subrutas que necesitan de login 
//router.use('/users', verifyToken, UsersRouter)

module.exports = router