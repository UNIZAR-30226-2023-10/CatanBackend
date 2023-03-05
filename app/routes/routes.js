import { Router } from 'express'
import { verifyToken } from '../utils/auth'

import AuthRouter from './auth.routes'
//anyadir resto de subrutas que necesitan de login 
const router = Router()

router.use('/', AuthRouter)
//anyadir resto de subrutas que necesitan de login 
//router.use('/users', verifyToken, UsersRouter)

export default router