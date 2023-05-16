
const { Router } = require('express')

const AuthRouter = Router()


const User = require('../controllers/user.controller')
const Session = require('../controllers/session.controller')


AuthRouter.post('/register', User.create)
AuthRouter.post('/login', Session.create)
AuthRouter.post('/recover', User.recover)

module.exports =  AuthRouter;