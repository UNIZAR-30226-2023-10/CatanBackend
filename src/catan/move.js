const  { notify }  = require('../routes/auth.routes.js');
const  { 
    roll_dices, 
    build_village, 
    build_city,
    build_road,
    buy_cards,
    monopoly,
    discovery,
    knight,
    change_recourse
} = require( './catan.js');

const MoveType = {
    roll_dices : 1,
    build_city : 2,
    build_city : 3,
    build_road : 4,
    buy_cards : 5,
    monopoly : 6,
    discovery: 7,
    knight: 8,
    order_selection : 9,
    change_recourse : 10
}


let move = {
    id: 0,  
    coords: {
        x:0,
        y:0,
    },
    coords2: {
        x:0,
        y:0,
    },
    resource: 'None',   //Tipo de recurso
    resource2: 'None',  //Tipo de recurso
    hexagon: 0,         //Hexagono donde ponen el ladron
    idPlayer: 0,       //Id del jugador que quiere robar
}

const CatanModule = {

    movimiento (id, move, game){
        switch(move.id){

            case MoveType.roll_dices:
                roll_dices(game);
                break;

            case MoveType.build_village:
                build_village( game,id,move.coords);
                break;

            case MoveType.build_city:
                build_city( game,id,move,move.coords);
                break;
            
            case MoveType.build_road:
                const coordsRoad = [
                    {x: move.coords.x, y: move.coords.y},
                    {x: move.coords2.x, y: move.coords2.y},
                ];
                build_road( game, id, coordsRoad);
                break;

            case MoveType.buy_cards:
                buy_cards( game,id);
                break;
            
            case MoveType.monopoly:
                monopoly( game, id, move.resource);
                break;
            
            case MoveType.discovery:
                discovery( game, id, move.resource, move.resource2);
                break;
            
            case MoveType.knight:
                knight(game, id, move.hexagon, move.idPlayer);
                break;
            
            case MoveType.order_selection:
                order_selection(game,id);
                break;

            case MoveType.change_recourse:
                change_recourse(game,id,resource, resource2);
                break;
            
            case MoveType.next_turn:
                next_turn(game);
        }
    },

    crearPartida(jugadores){
        start_game(game)
        barajar_desarrollos(game)
        return game, notificaciones
    }
}

module.exports = CatanModule