const { Router } = require('express')
const { TopologyDescription } = require('mongodb')
const { notify } = require('./auth.routes')
const GameRouter = Router()

GameRouter.use('create', Game.create)//crea partida y genera un codigo
GameRouter.use('join' Game.join)
module.exports = GameRouter


/register
/login
/game/create
/game/join



conn - [socketIO]
jugador -[Jugador]

llamada a crear partida(incluye primera tirada)

back -> guarda cambios, envia partidaActualizada a todos y envia las notificaciones

juagador envia -> acccion, idPartida

back -> coge Partida de la BD y se envia al modulo de juego(accion, partida, jugador)

modulo juego devuelve -> (err, partidaActualizada, notify)

notify {
    juagador1 : [String]
    jugador2: [String]
    jugador3: [String]
}

back -> guarda cambios, envia partidaActualizada a todos y envia las notificaciones