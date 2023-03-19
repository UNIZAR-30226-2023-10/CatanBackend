import { notify } from '../routes/auth.routes.js';
import { 
    roll_dices, 
    build_village, 
    build_city,
    build_road,
    buy_cards,
    monopoly,
    discovery,
    knight
} from './catan.js';

let move = {
    id: 0,  
    /*
    1->roll_dices 
    2->build_village -> need (coords) 
    3->build_city -> need (coords) 
    4->build_road -> need (coords,coords2)
    5->buy_cards
    6->monopoly -> need (resource)
    7->discovery -> need (resource,resource2)
    8->knight -> need (hexagono)
    9->order_selection
    */
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

    movimiento ( id, move, game){
        switch(move.id){

            case 1:
                roll_dices( game);
                break;

            case 2:
                build_village( game,id,move.coords);
                break;

            case 3:
                build_city( game,id,move,move.coords);
                break;
            
            case 4:
                const coordsRoad = [
                    {x: move.coords.x, y: move.coords.y},
                    {x: move.coords2.x, y: move.coords2.y},
                ];
                build_road( game, id, coordsRoad);
                break;

            case 5:
                buy_cards( game,id);
                break;
            
            case 6:
                monopoly( game, id, move.resource);
                break;
            
            case 7:
                discovery( game, id, move.resource, move.resource2);
                break;
            
            case 8:
                knight(game, id, move.hexagon, move.idPlayer);
                break;
            
            case 9:
                order_selection(game,id);
                break;

            

        }
    },

    crearPartida(jugadores){
        return game, notificaciones
    }
}

module.exports = CatanModule