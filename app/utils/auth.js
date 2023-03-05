import { jwt_secret } from '../config/jwt.config'
import jwt from 'jsonwebtoken'

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: 'error',
            error: { code: '1', message: 'No token provided' },
        })
    }

    let token = req.headers.authorization.split(' ')[1]
    if (!token) {
        return res.status(403).send({
            status: 'error',
            error: { code: '1', message: 'No token provided' },
        })
    }
    jwt.verify(token, jwt_secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                status: 'error',
                error: { code: '2', message: 'Unauthorized' },
            })
        }
        res.locals.decoded = decoded
    })
    next()
}

export { verifyToken }