const io = require("socket.io");
const UsersModel = require('../models/user.model')
const GamesModel = require('../models/game.model')
// TODO: anyadir modulo de jugablidad
// const CatanModule = require()
const jwt_secret  = '123456'
const jwt = require('jsonwebtoken');
const User = require("../controllers/user.controller");
const UserModel = require("../models/user.model");
const CatanModule = require("../catan/move");
const { notify } = require("../routes");




const Socket = {   
    async move(socket, token, codigo_partida, move){ 
        try{ 
            jwt.verify(token, jwt_secret, async (err, decoded) => {
                if (err) {
                    console.log(err)
                    this.sockets.to(`${decoded.id}_${codigo_partida}`).emit('error','invalid_token')
                }
                else {
                    // buscamos la partida
                    let partida = await GamesModel.findOne({
                        codigo_partida: codigo_partida
                    })
    
    
                    if (!partida.jugadores.includes(decoded.id)){
                        this.sockets.to(`${decoded.id}_${codigo_partida}`).emit('error', 'you aren\'t a player of this game')
                        return
                    }
                    if(!partida.comenzada){
                        this.sockets.to(`${decoded.id}_${codigo_partida}`).emit('error', 'the game haven\'t stared yet')
                        return
                    }
                    // TODO: recoger resultados, guardar patida , enviar notificaciones y partida
                    console.log("-------------------")
                    console.log("Patida previa")
                    console.log(partida.game.current_turn, partida._id)
                    console.log("-------------------")
                    let game = CatanModule.move(decoded, move, partida.game)
                    partida = await GamesModel.findOneAndUpdate(
                        {codigo_partida: codigo_partida},
                        { game: game },
                        {new : true}
                        )
                    console.log("Partida actual")
                    console.log(partida.game.current_turn)
                    console.log("-------------------")
                    this.sendGame(codigo_partida, partida.game)
                    
                    for (jugador in partida.jugadores ){
    
                        this.sockets.in(`${jugador}_${codigo_partida}`).emit("notify", CatanModule.findMoves(jugador, partida.game))
    
                    }
                }
            })
        }
        catch(e){
            console.log(e)
        }
        
    },
    async msg (socket, token, codigo_partida, msg){

        jwt.verify(token, jwt_secret, async (err, decoded) => {
            if (err) {
                socket.emit('error','invalid_token')
            }
            else {
                // buscamos la partida
                let partida = await GamesModel.findOne({
                    codigo_partida: codigo_partida
                })

                if (!partida.jugadores.includes(decoded.id)){
                    socket.emit('error', 'you aren\'t a player of this game')
                    return
                }

                //buscamos el emisor
                let emisor = await UserModel.findOne({
                    _id : decoded.id
                })
                
                //creamos el mensaje
                let newMsg = {
                    msg: msg,
                    user : emisor.username,
                    timestamp : Date.now()
                }

                //lo guardamos en el chat de la partida
                partida.chat.push(newMsg)
                await partida.save()

                //lo emitimos a todos
                Socket.broadCastMsg(codigo_partida, newMsg)
            }
        })
    },
    async joinGame(socket, token, codigo_partida){
        // verificamos el token
        jwt.verify(token, jwt_secret, async (err, decoded) => {
            if (err) {
                console.log(err)
                socket.emit('error','invalid_token')
            }
            else {
                // buscamos la partida
                let partida = await GamesModel.findOne({
                    codigo_partida: codigo_partida
                })

                if (!partida.jugadores.includes(decoded.id)){
                    socket.emit('error', 'You aren\'t player of this game')
                   return
                }
                console.log(decoded.id, " entra en la partida " , codigo_partida)
                // socket.emit('ok')
                // anyadimos el socket a las salas correspondientes
                socket.join(`${decoded.id}_${codigo_partida}`)
                socket.join(`${codigo_partida}`)

                //anyadimos las funcionales de move y msg
                socket.on('move', (token, codigo_partida, move) => {
                    this.move(socket, token, codigo_partida, move)
                })  
                socket.on('msg',  (token, codigo_partida, msg) => this.msg (socket, token, codigo_partida, msg))

                //si ya esta comenzada se necesita una reconexion 
                //if (partida.comenzada){
                //    socket.emit('update', game.game)
                //}
            }
        })
    },
    
    async start(server){
        //iniciamos el server de los sockets
        this.sockets = io(server, {
            cors: {
                //acceptamos conexiones locales
                origin: "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        })
        
        this.sockets.on("connection", (socket) => {
            // enlazar el socket con la partida
            console.log('nuevo socket abierto: ', socket.rooms)
            socket.on('joinGame',(token, codigo_partida)=> this.joinGame(socket,token, codigo_partida ))
            socket.on("disconnect", () => console.log('socket cerrado'))  
            socket.on('move', (token, codigo_partida, move) => {
                this.move(socket, token, codigo_partida, move)
            })   
        })
    }, 

    async sendNewPlayer(codigo_partida, data){
        try{
            this.sockets.to(codigo_partida).emit('new_player', data)
        }catch(e){
            console.log(e)
        }
    },

    async broadCastMsg(codigo_partida, msg){
        this.sockets.to(`${codigo_partida}`).emit('new_msg',msg)
    },

    async sendNotify(codigo_partida, data, player){
        this.sockets.to(`${player}_${codigo_partida}`).emit('notify', data)
        
    },
    async sendGame(codigo_partida, data){
        this.sockets.to(`${codigo_partida}`).emit('update', data)
    },
    async startGame(codigo_partida, players){
        let game = CatanModule.crearPartida(players,codigo_partida)
        this.sockets.to(`${codigo_partida}`).emit('redirectToGame', game)
        this.sendGame(codigo_partida, game)
        console.log('Game: ', game)
        console.log('Board: ', game.board)
    }     
}



module.exports = Socket