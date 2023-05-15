const  { notify }  = require('../routes/auth.routes.js');
const  { 

    build_city,
    build_road,
    build_village,
    buy_cards,
    next_turn,
    roll_the_dices,
    use_knight,
    use_monopoly,
    use_roads_build_4_free,
    use_year_of_plenty,

} = require('./catan.js');

const MoveType = require( './movesTypes.js')
let move = {
    id: 0,            // Tipo de movimiento
    coords: '',       // Coordenadas de construccion, valido para todos.
    robber_biome: -1, // Siguiente bioma del ladron (si hay).
    resource: null,   // Recurso seleccionado, tiene diferentes movimientos.
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
            roll_the_dices(game, player)
        } else if (move.id === MoveType.use_knight) {
            console.log("Using the knight")
            use_knight(game, player, move.robber_biome)
        } else if (move.id === MoveType.use_monopoly) {
            console.log("Using the monopoly")
            use_monopoly(game, player, move.resource)
        } else if (move.id === MoveType.use_roads_build_4_free) {
            console.log("Using free roads")
            build_road(game, player, move.coords, true)
            use_roads_build_4_free(game, player)
        } else if (move.id === MoveType.use_year_of_plenty) {
            console.log("Using Year of plenty")
            use_year_of_plenty(game, player, move.resource)
        } else {
            console.log('Unknown move')
        }

        /*switch(move.id) {            
            case MoveType.order_selection:
                console.log("order_selection")
                order_selection(game,id);
                break;

            case MoveType.change_recourse:
                console.log("change_recourse")
                change_recourse(game,id,resource, resource2);
                break;
        }
        */
        return game
    },
}

module.exports = CatanModule