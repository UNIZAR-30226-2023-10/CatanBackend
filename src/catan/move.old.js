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
    change_recourse,
    create_game,
    start_game,
    create_player,
    getMoves,
    next_turn,
    first_roll

} = require( './catan.js');

const MoveType = require( './movesTypes.js')
let move = {
    id: 0,  
    coords: '',
    resource: 'None',   //Tipo de recurso
    resource2: 'None',  //Tipo de recurso
    hexagon: 0,         //Hexagono donde ponen el ladron
    idPlayer: 0       //Id del jugador que quiere robar
}

const CatanModule = {

    move (id, move, game){
        //console.log(move.id)

        switch(move.id) {
            case MoveType.roll_dices:
                roll_dices(game);
                break;

            case MoveType.build_village:
                build_village(game, id, move.coords);
                break;

            case MoveType.build_city:
                console.log("build_city")
                build_city( game,id,move,move.coords);
                break;
            
            case MoveType.build_road:
                build_road(game, id, move.coords)
                break;

            case MoveType.buy_cards:
                console.log("buy_cards")
                buy_cards( game,id);
                break;
            
            case MoveType.monopoly:
                console.log("monopoly")
                monopoly( game, id, move.resource);
                break;
            
            case MoveType.discovery:
                console.log("discovery")
                discovery( game, id, move.resource, move.resource2);
                break;
            
            case MoveType.knight:
                console.log("knight")
                knight(game, id, move.hexagon, move.idPlayer);
                break;
            
            case MoveType.order_selection:
                console.log("order_selection")
                order_selection(game,id);
                break;

            case MoveType.change_recourse:
                console.log("change_recourse")
                change_recourse(game,id,resource, resource2);
                break;
            
            case MoveType.next_turn:
                console.log("next_turn")
                next_turn(game);
                break;
            case MoveType.first_roll:
                console.log("first_roll")
                first_roll(game,id); 
            default: 
                console.log("id incorrecto")
        }
        return game
    },

    findMoves(id,game){
        return getMoves(id,game)
    },

    crearPartida(jugadores, code){
        
        let game = create_game(code)
        for (j in jugadores){
            game.players.push(create_player(j))
        }
        console.log(jugadores)
        start_game(game)
        console.log(code)
        return game
    }
}

module.exports = CatanModule