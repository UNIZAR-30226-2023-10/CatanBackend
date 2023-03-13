
const db = require( '../models/index.js')
const UserModel = require( '../models/user.model.js')
const { jwt_secret } = require( '../config/jwt.config.js')
const bcrypt = require( 'bcrypt')
const jwt = require( 'jsonwebtoken')



const Session = {
    async create(req, res) {
        try {
            UserModel.findOne({
                email: req.body.email,
            }).exec((err, user) => {
                if (err) {
                    res.status(500).send({ message: err })
                    return
                }
                if (!user) {
                    return res.status(404).send({
                        status: 'error',
                        error: { code: '3', message: 'User Not found.' },
                    })
                }
                var passwordIsValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                )

                if (!passwordIsValid) {
                    return res.status(401).json({})
                }

                var token = jwt.sign({ id: user._id }, jwt_secret)
                res.status(200).json({
                    username: user.username,
                    email: user.email,
                    accessToken: token,
                })
            })
        } catch (err) {
            res.status(400).json({ error: 'err' })
            console.error(err)
        }
    },
    async read(req, res) {
        try {
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
                return res.status(200).json({ status: 'okay' })
            })
        } catch (err) {}
    },
    async update(req, res) {
        try {
            UserModel.findOne({
                email: req.body.email,
            }).exec((err, user) => {
                if (err) {
                    res.status(500).send({ message: err })
                    return
                }
                if (!user) {
                    return res.status(404).send({
                        status: 'error',
                        error: { code: '3', message: 'User Not found.' },
                    })
                }
                var passwordIsValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                )

                if (!passwordIsValid) {
                    return res.status(401).json({})
                }

                var token = jwt.sign(user, jwt_secret)
                res.status(200).json({
                    username: user.username,
                    email: user.email,
                    accessToken: token,
                })
            })
        } catch (err) {
            res.status(400).json({ error: 'err' })
            console.error(err)
        }
    },
    async delete(req, res) {},
}

module.exports =  Session