const { Router } = require('express')

const UserRouter = Router()


const User = require('../controllers/user.controller')

UserRouter.post('/update', User.update)

module.exports =  UserRouter;