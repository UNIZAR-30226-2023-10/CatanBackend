const GamesModel = require('../models/game.model')
const UsersModel = require('../models/user.model')
const CatanModule = require('../catan/move')
const { create_game } = require('../catan/catan')
const Socket = require('../sockets/index')
const UserModel = require('../models/user.model')
const User = require('./user.controller')
// TODO : importar jugabilidad
// const CatanModule = require() 
const max = 999999
const min = 100000

const Game = {
    async create(req, res){
        try {
            //generamos un codigo de partida que no este siendo utilizado
            let codigoPartida = Math.floor(Math.random() * (max - min + 1) + min)
            let aux = await GamesModel.findOne({
                codigo_partida : codigoPartida
            })

            while (aux != null){
                codigoPartida = Math.floor(Math.random() * (max - min + 1) + min)
                aux = await GamesModel.findOne({
                    codigo_partida : codigoPartida
                })
            }

            let user = await UserModel.findById(res.locals.decoded.id)
            //console.log("USUARIO ENCONTRADO (CREATE): ", user)
            //creamos una partida y la guardamos
            let game = new GamesModel({
                codigo_partida : codigoPartida,
                anfitrion : res.locals.decoded.id,
                jugadores: [res.locals.decoded.id],
                comenzada : false
            })

            game = await game.save()

            //devolvemos el codigo de partida
            return res.status(200).json({
                status: 'success',
                codigo_partida : game.codigo_partida
            })

       }
       catch(err){
            res.status(500).json(err)
            console.error(err)
       }
    },

    // /api/game/join
    async join(req, res){
        try {
            // comprobamos si se hay codigo de partida
            if(!req.body.codigo_partida){
                return res.status(300).json({
                    error : 'Se necesita un codigo de partida'
                })
            }
            // Comprobamos si existe la partida con el codigo enviado
            let game = await GamesModel.findOne({
                codigo_partida : req.body.codigo_partida
            })

            if (game){
                let user = await UsersModel.findById(res.locals.decoded.id)
                //console.log("EL JUEGO (JOIN): ", game, user)
                // Si el jugador ya se encuentra en la partida devolvemos la respuesta anterior
                if (game.jugadores.includes(res.locals.decoded.id)){
                    let jugadores = []
                    for (id of game.jugadores){
                        let j = await UserModel.findById(id)
                        jugadores.push(j.username)
                    }
                    console.log(jugadores)
                    return res.status(201).json({
                        status: 'success',
                        jugadores: jugadores
                    })
                }
                //comprobamos si la partida esta llena y si no ha empezado
                if (game.jugadores.length < 4 && !game.comenzada) {
                    // Nuevo jugador en la partida:
                    game.jugadores.push(user._id)
                    await game.save()
                    //console.log(game) 

                    Socket.sendNewPlayer(req.body.codigo_partida, { username : user.username })

                    let jugadores = []
                    
                    for (id of game.jugadores){
                        let j = await UserModel.findById(id)
                        jugadores.push(j.username)
                    }

                    console.log (jugadores)
                    return res.status(200).json({
                        status: 'success', 
                        jugadores : jugadores
                    })
                }
                else {
                    return res.status(300).json({
                        error : 'Partida llena'
                    })
                }
            }
            else {
                return res.status(300).json({
                    error : 'Codigo no encontrado'
                })
            }
        }
        catch(err){
            res.status(500).json(err)
            console.error(err)
        }
    },

    async start(req, res){
        try {
            if(!req.body.codigo_partida){
                return res.status(300).json({
                    error : 'Se necesita un codigo de partida'
                })
            }  

            // comprobamos si existe la partida con el codigo enviado

            let game = await GamesModel.findOne({
                codigo_partida : req.body.codigo_partida
            })

            if (game){
                //comprobamos si hay suficientes jugadores 
                if (game.jugadores.length > 2) {
                    // comprobar si es el anfitrion
                    console.log(`comienza la partida ${game.codigo_partida}`)

                    let players_names = []
                    for (id of game.jugadores) {
                        let player = await UserModel.findById(id)
                        players_names.push(player.username)
                        player.partidaActual = game.codigo_partida
                        player = await player.save()
                    }
                    game.game = create_game(game.codigo_partida, players_names)
                    game.comenzada = true 
                    game.save()

                    console.log('LA PARTIDA: ', game.game.players[0])
                    Socket.sendGame(game.codigo_partida, game.game)
                    return res.status(200).json({ 
                        status: 'success',
                    })
                }
                else {
                    return res.status(300).json({
                        error : 'Se necesitan jugadores'
                    })
                }
            }
            else {
                return res.status(300).json({
                    error : 'Codigo no encontrado'
                })
            }

        }
        catch(err){
            res.status(500).json(err)
            console.error(err)
        }
    }
}

module.exports = Game