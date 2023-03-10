
const { Router } = require('express')

const AuthRouter = Router()


const User = require('../controllers/user.controller')
const Session = require('../controllers/session.controller')


AuthRouter.post('/register', User.logup)
AuthRouter.post('/login', Session.login)

module.exports =  AuthRouter;