const GamesModel = require('../models/game.model')
const UsersModel = require('../models/user.model')
const max = 999999
const min = 100000

const Game = {
    async create(req, res){
        console.log("create")
       return res.status(202).json({})
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
                jugador1: res.locals.decoded.id
            })
            game = await game.save()

            //devolvemos el codigo de partida
            return res.status(200).json({
                idPartida : game._id,
                codigo_partida : game.codigo_partida
            })

       }
       catch(e){
            res.status(500).json(err)
            console.error(err)
       }
    },
    async join(req, res){
        console.log("join")
        return res.status(203).json({})
        try {

        }
        catch(e){
             res.status(500).json(err)
             console.error(err)
        }
    },
    async start(req, res){
        console.log("start")
        return  res.status(204).json({})
        try {

        }
        catch(e){
             res.status(500).json(err)
             console.error(err)
        }
    }
}

module.exports = Game