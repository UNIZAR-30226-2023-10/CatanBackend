

const { response } = require ('express')

const UserModel = require ('../models/user.model.js')
const Session = require ('./session.controller.js')

const User = {

    async create(req, res) {       
        try {
            console.log (req.body)
            if (req.body.password == req.body.confirm_password) {
                let NewUser = new UserModel({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                })
                let user = await NewUser.save()
                console.log("-------")
                console.log(user)
                console.log("-------")
                return Session.create(req,res)
            } else {
                throw {
                    errors: {
                        password: 'password and confirm_password do not match',
                    },
                }
            }


        } catch (err) {
            res.status(400).json(err)
            console.error(err)
        }
    },
    
    async search(req, res) {

        let me = await  UserModel.findOne(
            { _id : res.locals.decoded.id }
        )

        let users

        if (req.query.username){
            users = await UserModel.fuzzySearch(req.query.username)
        }
        else {
            users = await UserModel.find()
        }

        
        let respuesta = []

        return res.status(200).json(respuesta)

    },
}

module.exports =  User