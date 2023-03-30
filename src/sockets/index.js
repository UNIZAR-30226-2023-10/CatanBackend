const io = require("socket.io");
const UsersModel = require('../models/user.model')
const GamesModel = require('../models/game.model')
// TODO: anyadir modulo de jugablidad
// const CatanModule = require()
const jwt_secret  = '123456'
const jwt = require( 'jsonwebtoken')



const Socket = 
{   
    async start(server){
        this.sockets = io(server)
        this.sockets.on("connection", (socket) => {
            // enlazar el socket con la partida
            socket.on('joinGame', (token, codigo_partida) => {
            // verificamos el token
            jwt.verify(token, jwt_secret, (err, decoded) => {
                if (err) {
                    socket.emit('error','invalid_token')
                }
                else {
                    // buscamos la partida
                    let partida = GamesModel.findOne({
                        codigo_partida: codigo_partida
                    }).exec()
                    if (!partida.jugadores.includes(decoded)){
                        socket.emit('error', 'you arent player this game')
                        return
                    }
                    
                    // socket.emit('ok')
                    socket.join(`${decoded}_${codigo_partida}`)
                    socket.join(`${codigo_partida}`)
                    socket.on('move', (token, codigo_partida, move) =>{ 
                        jwt.verify(token, jwt_secret, (err, decoded) => {
                            if (err) {
                                socket.emit('error','invalid_token')
                            }
                            else {
                                // buscamos la partida
                                let partida = GamesModel.findOne({
                                    codigo_partida: codigo_partida
                                }).exec()

                                if (!partida.jugadores.includes(decoded)){
                                    socket.emit('error', 'you arent player this game')
                                    return
                                }
                                if(!partida.comenzada){
                                    socket.emit('error', 'the game havent stared yet')
                                    return
                                }
                                // TODO: recoger resultados, guardar patida , enviar notificaciones y partida
                                // partida.game , notificaiones = CatanModule.move(partida.game , decoded, move)
    
                                // sockets.in(codigo_partida).emit('update',partida.game)
                                // socket.emit('notify')
                            }
                        })
                    })
                        socket.on('msg',(token, codigo_partida, msg) => {
                            jwt.verify(token, jwt_secret, (err, decoded) => {
                                if (err) {
                                    socket.emit('error','invalid_token')
                                }
                                else {
                                Socket.broadCastMsg(decoded, codigo_partida, msg)
                            }
                        })
                    })
                }
            })
    
        })
      
    });
    },


    async broadCastMsg(user, codigo_partida, msg){
        this.sockets.in(codigo_partida).emit('new_msg',msg)
    },

    async sendAll(codigo_partida, event, data){
        this.sockets.in(`${codigo_partida}`).emit(event, data)
        
    },
    async send(user, codigo_partida, event, data){
        this.sockets.in(`${user}_${codigo_partida}`).emit(event, data)
    },
    async sendGame(user, codigo_partida, game){

    },

    async starGame(user, codigo_partida, game){
    }     
}







module.exports = Socket