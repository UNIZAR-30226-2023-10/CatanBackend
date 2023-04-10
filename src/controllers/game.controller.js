const GamesModel = require('../models/game.model')
const UsersModel = require('../models/user.model')
const CatanModule = require('../catan/move')
const Socket = require('../sockets/index')
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
       catch(e){
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

            // comprobamos si existe la partida con el codigo enviado

            let game = await GamesModel.findOne({
                codigo_partida : req.body.codigo_partida
            })

            if (game){

                //si el jugador ya se encuentra en la partida devolvemos la respuesta anterior
                if (game.jugadores.includes(res.locals.decoded.id)){
                    return res.status(201).json({
                        status: 'sussces',
                        jugadores: game.jugadores
                    })
                }

                //comprobamos si la partida esta llena
                //y si no ha empezado
                if (game.jugadores.length < 4 && !game.comenzada) {

                    
                    //buscamos el usuario
                    let user = await UsersModel.findById(res.locals.decoded.id)

                   
                    //se anyade el jugador a la partida
                    game.jugadores.push(res.locals.decoded.id)
                    await game.save()

                    
                    Socket.sendNewPlayer(req.body.codigo_partida, { username : user.username })

                    return res.status(200).json({
                        status: 'sussces', 
                        jugadores : game.jugadores
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

                    
                    game.game = {}
                    // game.game = CatanModule.crearPartida(game.jugadores, game.codigo_partida)
                    game.comenzada = true 
                    game.save()
                    Socket.sendGame(game.codigo_partida, game.game)
                    return res.status(200).json({ 
                        status: 'sussces',
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
        catch(e){
             res.status(500).json(err)
             console.error(err)
        }
    }
}

module.exports = Game