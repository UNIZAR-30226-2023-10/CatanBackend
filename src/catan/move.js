const  { notify }  = require('../routes/auth.routes.js');
const  { 
    // De momento estos estan limpiados:
    create_game,
    build_city,
    build_road,
    build_village,
    buy_cards,
    next_turn,
    roll_the_dices,
    use_knight,

    // De momento estos no estan limpiados:
    monopoly,
    discovery,
    change_recourse,
    start_game,
    getMoves,
    barajar_desarrollos

} = require('./catan.js');

const MoveType = require( './movesTypes.js')
let move = {
    id: 0,            // Tipo de movimiento
    coords: '',       // Coordenadas de construccion, valido para todos.
    robber_biome: -1, // Siguiente bioma del ladron (si hay).
    // Sin limpiar
    resource: 'None',   //Tipo de recurso
    resource2: 'None',  //Tipo de recurso
}

const CatanModule = {

    move(move, game, player) {
        if (move.id === MoveType.build_city) {
            console.log("Build a city")
            build_city(game, player, move.coords)
        } else if (move.id === MoveType.build_road) {
            console.log("Build a road")
            build_road(game, player, move.coords)
        } else if (move.id === MoveType.build_village) {
            console.log("Build a village")
            build_village(game, player, move.coords)
        } else if (move.id === MoveType.buy_cards){
            console.log("Buy cards")
            buy_cards(game, player);
        } else if (move.id === MoveType.next_turn) {
            console.log("Next turn")
            next_turn(game, player)  
        } else if (move.id === MoveType.roll_dices) {
            console.log("Roll the dices")
            roll_the_dices(game)
        } else if (move.id === MoveType.use_knight) {
            console.log("Using the knight")
            use_knight(game, player, move.robber_biome)
        }
        
        /*switch(move.id) {
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

            case MoveType.first_roll:
                console.log("first_roll")
                first_roll(game,id); 
            default: 
                console.log("id incorrecto")
        }
        */
        return game
    },

    //findMoves(id,game){
    //    return getMoves(id,game)
    //},

    //crearPartida(jugadores, code){
    //    
    //    let game = create_game(code)
    //    for (j in jugadores){
    //        game.players.push(create_player(j))
    //    }
    //    console.log(jugadores)
    //    start_game(game)
    //    console.log(code)
    //    return game
    //}
}

module.exports = CatanModule