import { Router } from 'express'

import User from '../controllers/user.controller'
import Session from '../controllers/session.controller.js'

const AuthRouter = Router()

AuthRouter.post('/register', Session.logup )
AuthRouter.post('/login', Session.lognin)

export default AuthRouter;