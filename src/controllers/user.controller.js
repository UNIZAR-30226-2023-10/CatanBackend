

const { response } = require ('express')

const UserModel = require ('../models/user.model.js')
const Session = require ('./session.controller.js')
const jwt = require( 'jsonwebtoken')
const jwt_secret = '123456';
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'catanrecoveryservice@gmail.com',
      pass: 'csimbjjquadfoebm'
    }
});

function createEmail(username,token){
    return 
    `<div>
        <h1>¡Hola ${username}!</h1>
            <p>Aquí está el enlace para cambiar la contrasenya:</p>
    <div><a href="http://localhost:3000/recover?token=${token}%22%3EHaz click aqui</a></div>
    <p>Saludos</p>
    </div>`
}

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

    async recover (req, res) {
        try {
            const user = await UserModel.findOne({ email: req.body.email });
            if(user) {

                var token = jwt.sign({ id: user._id }, jwt_secret)
                const mailOptions = {
                    from: 'catanrecoveryservice@gmail.com',
                    to: user.email,
                    subject: 'Change Password',
                    html: createEmail(user.username,token)
                };

                console.log("Encontrado usuario para cambiar su contraseña");
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                   console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                      // do something useful
                    }
                  });

                return res.status(200).json();
            } else {
                console.log('Usuario no encontrado');
                return res.status(300).json();
            }
        } catch (error) {
            return res.status(400).json();
        }
    },

    async update (req, res){
        let me = await UserModel.findOne(
            { _id : res.locals.decoded.id }
        )

        if(me) {
            for(let clave in req.body){
                me[clave] = req.body[clave]
            }
            try{
                me = await me.save() 
                me = await UserModel.findOne(
                    { _id : res.locals.decoded.id }
                )
                return res.status(200).json(me);
            }catch(e){
                return res.status(300).json({
                    error : 'parametros no validos'
                })
            }

        } else {
            console.log('Usuario no encontrado');
            return res.status(300);
        }
    }

}

module.exports =  User