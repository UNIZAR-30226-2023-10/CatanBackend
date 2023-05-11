//=============================================================================
// FUNCIONES AUXILIARES 
//=============================================================================
const MoveType = require("./movesTypes")

function random(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function generate_id() {
    let symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', id = '';
    for (var i = 0; i < 8; i++) {
        id += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }
    return id; 
}

function generate_code() {
    let symbols = '0123456789', code = '';
    for (var i = 0; i < 6; i++) {
        code += symbols.charAt(random(0, symbols.length))
    }
    return code;
}

function ncoor_toString(coords) {
    return coords.x.toString() + "," + coords.y.toString()
}

function rcoor_toString(game, coords) {
    let fst_coor = ncoor_toString(coords[0])
    let snd_coor = ncoor_toString(coords[1])
    let rcoor = fst_coor + ":" + snd_coor
    console.log(rcoor)
    if (rcoor in game.board.roads) {
        return rcoor
    } else {
        rcoor = snd_coor + ":" + fst_coor
        if (rcoor in game.board.roads) {
            return rcoor
        } else {
            return undefined
        }
    }
}

//=============================================================================
// PARTIDA 
//=============================================================================
// Una partida tiene:
// - Lista de jugadores.
// - Id del host: no creo que haga falta siendo que guardas la partida con el host 
//   en la base de datos.
// - Tablero.
// - Codigo.
// - Turno actual de partida.
// - Si esta comenzada o no (phase)
function create_game(code) {  
    return {
        //cartas_desarrollo: [],
        players: [],
        board: create_board(),      // No es necesario un tablero nada más crear la partida.
        code: code,       // Hay que discutir muchas cosas sobre esto...
        current_turn : 0, //
        phase: 0          // Indica el estado de la partida:
                          // - (0). Ni se ha empezado. Se empezará partida y se elegirá el orden de juego.
                          // - (1). Primera ronda: los jugadores colocan un pueblo y una carretera en un sitio a elección en el orden elegido.
                          // - (2). Segunda Ronda: los jugadores colocan un pueblo y una carretera en un sitio a elección pero en orden inverso.
                          // - (3). Resto de rondas.
    }
}

// Un jugador tiene:
// - Un id.
// - Nodos en los que puede construir.
// - Caminos en los que puede construir.
// - Pueblos construidos (sus coordenadas).
// - Ciudades construidas (sus coordenadas).
// - Caminos construidos (sus coordenadas).
// - Recursos que posee.
// - Cartas de desarrollo que posee.
// - Caballeros usados.
function create_player(id) {
    return {
        id: id,
        free_nodes: new Set(),
        free_roads: new Set(),
        villages: new Set(),
        cities: new Set(),
        roads: new Set(),
        resources: null,
        growth_cards: {
            'Caballeros': 0,
            'Carreteras': 0,
            'Monopolios': 0,
            'Descubrimientos': 0,
            'Puntos': 0
        },
        // TODO: Yo sacaria este valor fuera de growth_cards
        // Ya esta sacado.
        used_knights: 0,
        first_roll: [],
    }
}

function first_roll(game,idPalyer){
    let index = game.players.findIndex(player => player.id === idPalyer)
    game.players[index].first_roll[0]=random(1,6)
    game.players[index].first_roll[1]=random(1,6)
}
// Un tablero tiene:
// Para su construcción:
// - Terraformación de biomas:
//  1. Tierra de cultivo/Trigo   4
//  2. Bosque/Madera             4
//  3. Colinas/Ladrillo          3
//  4. Montañas/Piedra           3
//  5. Pasto/Lana                4
//  6. Desierto                  1
const biome_terraform    = [4, 4, 3, 3, 4, 1]
const biome_names        = ['Farmland','Forest','Hill','Mountain','Pasture','Desert']
const biome_resources    = ['Trigo','Madera','Ladrillo','Piedra','Lana']
const biome_token_starts = [0, 2, 4, 6, 8, 10]

// - Fichas numericas ----- A  B  C  D  E  F   G  H   I   J  K  L   M  N  O  P  Q  R
const biome_token_values = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11];
// - Limites para el calculo de coordenadas en el grid cuadrado.
const borders = [[3,7],[2,8],[2,8],[1,9],[1,9],[0,10],[0,10],[1,9],[1,9],[2,8],[2,8],[3,7]];
// Como objeto final:
// - Biomas (celdas hexagonales).
// - Id del bioma donde se encuentra el ladron.
// - Nodos de construccion (vertices).
// - Caminos de construccion (aristas).
// - Construcciones hechas y a quien pertenecen.
// - Una baraja con cartas de desarrollo
function create_board() {
    // Generar hexagonos:
    let terraform    = [...biome_terraform]
    let tokens_start = biome_token_starts[random(0, biome_token_starts.length)]
    let biomes       = []
    let offset       = 0
    for (let i = 0; i < 19; i++) {
        //TODO: Esto no acaba de ser aleatorio 100%. Es lo mejor que tenemos en JS. ¯\_(ツ)_/¯
        let type = random(0,6)
        while (terraform[type] == 0) {
            type = random(0,6)
        }
        terraform[type]--
        if (type === 5) {
            biomes.push({
                type: 'Desert',
                resource: 'None',
                token: 0
            })
            offset++
        } else {
            biomes.push({ 
                type: biome_names[type],
                resource: biome_resources[type],
                token: biome_token_values[(i-offset+tokens_start)%18]
            })
        }
    }

    // Generar nodos:
    let nodes = {
        '0,3'  : { building: null, biomes:[0]},
        '0,5'  : { building: null, biomes:[1]},
        '0,7'  : { building: null, biomes:[2]},
        '1,2'  : { building: null, biomes:[0]},
        '1,4'  : { building: null, biomes:[0,1]},
        '1,6'  : { building: null, biomes:[1,2]},
        '1,8'  : { building: null, biomes:[2]},
        '2,2'  : { building: null, biomes:[0,11]},
        '2,4'  : { building: null, biomes:[0,1,12]},
        '2,6'  : { building: null, biomes:[1,2,13]},
        '2,8'  : { building: null, biomes:[2,3]},
        '3,1'  : { building: null, biomes:[11]},
        '3,3'  : { building: null, biomes:[0,11,12]},
        '3,5'  : { building: null, biomes:[1,12,13]},
        '3,7'  : { building: null, biomes:[2,13,3]},
        '3,9'  : { building: null, biomes:[3]},
        '4,1'  : { building: null, biomes:[11,10]},
        '4,3'  : { building: null, biomes:[11,12,17]},
        '4,5'  : { building: null, biomes:[12,13,18]},
        '4,7'  : { building: null, biomes:[13,3,14]},
        '4,9'  : { building: null, biomes:[3,4]},
        '5,0'  : { building: null, biomes:[10]},
        '5,2'  : { building: null, biomes:[11,10,17]},
        '5,4'  : { building: null, biomes:[12,17,18]},
        '5,6'  : { building: null, biomes:[13,18,14]},
        '5,8'  : { building: null, biomes:[3,14,4]},
        '5,10' : { building: null, biomes:[4]},
        '6,0'  : { building: null, biomes:[10]},
        '6,2'  : { building: null, biomes:[10,17,9]},
        '6,4'  : { building: null, biomes:[17,18,16]},
        '6,6'  : { building: null, biomes:[18,14,15]},
        '6,8'  : { building: null, biomes:[14,4,5]},
        '6,10' : { building: null, biomes:[4]},
        '7,1'  : { building: null, biomes:[10,9]},
        '7,3'  : { building: null, biomes:[17,9,16]},
        '7,5'  : { building: null, biomes:[18,16,15]},
        '7,7'  : { building: null, biomes:[14,15,5]},
        '7,9'  : { building: null, biomes:[4,5]},
        '8,1'  : { building: null, biomes:[9]},
        '8,3'  : { building: null, biomes:[9,16,8]},
        '8,5'  : { building: null, biomes:[16,15,7]},
        '8,7'  : { building: null, biomes:[15,5,6]},
        '8,9'  : { building: null, biomes:[5]},
        '9,2'  : { building: null, biomes:[9,8]},
        '9,4'  : { building: null, biomes:[16,8,7]},
        '9,6'  : { building: null, biomes:[15,7,6]},
        '9,8'  : { building: null, biomes:[5,6]},
        '10,2' : { building: null, biomes:[8]},
        '10,4' : { building: null, biomes:[8,7]},
        '10,6' : { building: null, biomes:[7,6]},
        '10,8' : { building: null, biomes:[6]},
        '11,3' : { building: null, biomes:[8]},
        '11,5' : { building: null, biomes:[7]},
        '11,7' : { building: null, biomes:[6]},
    }

    // Generar aristas:
    //  - Para x = par (2n). (x,y) -> (x-1,y),(x+1,y-1),(x+1,y+1)
    //  - Para x = impar (2n+1). (x,y) -> (x-1,y-1),(x-1,y+1),(x+1,y)
    let edges = {}
    for (var ncoor in nodes) {
        let coords = ncoor.split(","), x = parseInt(coords[0]), y = parseInt(coords[1]), mcoor = ""
        // Para x = par (2n). (x,y) -> (x-1,y),(x+1,y-1),(x+1,y+1):
        if (x % 2 === 0) {
            if (x-1 > 0) {
                mcoor = ncoor_toString({x:x-1, y:y})
                if (!(ncoor+":"+mcoor in edges) && !(mcoor+":"+ncoor in edges)) {
                    edges[ncoor+":"+mcoor] = { id: null }
                }
            }
            if (y-1 >= borders[x+1][0]) {
                mcoor = ncoor_toString({x:x+1,y:y-1})
                if (!(ncoor+":"+mcoor in edges) && !(mcoor+":"+ncoor in edges)) {
                    edges[ncoor+":"+mcoor] = { id: null }
                }
            }
            if (y+1 <= borders[x+1][1]) {
                mcoor = ncoor_toString({x:x+1,y:y+1})
                if (!(ncoor+":"+mcoor in edges) && !(mcoor+":"+ncoor in edges)) {
                    edges[ncoor+":"+mcoor] = { id: null }
                }
            }
        // Para x = impar (2n+1). (x,y) -> (x-1,y-1),(x-1,y+1),(x+1,y):
        } else {
            if (y-1 >= borders[x-1][0]) {
                mcoor = ncoor_toString({x:x-1,y:y-1})
                if (!(ncoor+":"+mcoor in edges) && !(mcoor+":"+ncoor in edges)) {
                    edges[ncoor+":"+mcoor] = { id: null }
                }
            }
            if (y+1 <= borders[x-1][1]) {
                mcoor = ncoor_toString({x:x-1,y:y+1})
                if (!(ncoor+":"+mcoor in edges) && !(mcoor+":"+ncoor in edges)) {
                    edges[ncoor+":"+mcoor] = { id: null }
                }
            }
            if (x+1 < 12) {
                mcoor = ncoor_toString({x:x+1, y:y})
                if (!(ncoor+":"+mcoor in edges) && !(mcoor+":"+ncoor in edges)) {
                    edges[ncoor+":"+mcoor] = { id: null }
                }
            }
        }
    }
    return {
        biomes: biomes,
        thief_biome: -1,
        nodes: nodes,
        roads: edges,
        buildings: new Set(),
        growth_cards: {
            Caballero : 14,
            Carreteras : 2,
            Monopolio  : 2,
            Descubrimiento : 2,
            Punto: 5
        },
        cartasDesarrollo: [],
        max_knights: 2,
        player_max_knights: -1,
        max_roads: 4,
        player_max_roads: -1,
    }
}

// ============================================================================
// SIN LIMPIAR
// ============================================================================
// Primer turno:
/*
function next_turn(game, id, phase) {
    let index = game.players.findIndex(player => player.id === id)  
    if (phase === 0) {                                                                  //Primera ronda, solo de construccion
        // Primera ronda
        build_village(game, id,coords, phase);                                          //Construye el primer poblado
        build_road(game,id,coords);                                                     //Construye la primera carretera
        if(index==3){                                                                   //Pasa a la segunda ronda
            next_turn(game,id,1);
        }else{                                                                          //Pasa el turno para la primera ronda                                   
            next_turn(game,jugadores[id+1],0);
        }
    } else if (phase === 1) {                                                           //Segunda ronda, solo contruccion. Recibe recursos por la contruccion del poblado
        // Segunda ronda
        build_village(game, id,coords, phase);                                          //Construye el segundo poblado
        build_road(game,id,coords);                                                     //Construye la segunda carretera
        for(let i = 0; i < nodes[coords].biomes.length; i++){                           
            game.players[index].resources[biome_resources[nodes[coords].biomes[i]]]++   //Roba materia prima
        }
        if(index==0){                                                                   //Pasa al turno normal    
            next_turn(game,id,2);
        }else{                                                                          //Pasa el turno para la segunda ronda
            next_turn(game,jugadores[id-1],0);                                          
        }
    } else {                                                                            //TODO: Primera version sin opciones de usar antes caballero???
        if(index==3){                                                                   //TODO: Comprobar si hay ganador al finalizar el turno???
            next_turn(game,jugadores[0],2)
        }else{
            next_turn(game,jugadores[index+1],2) 
        }
        
        // Resto de la partida igual
    }
}
*/


ids   = ["Jkilo90o", "XXXZ89xx", "45TRej23", "5ty62sw1"]
/**
 * Función auxiliar. Calcula el número de cartas totales del jugador.
 * 
 * @param {*} player    Estructura jugador recibida.
 * @returns 
 */
function total_resources(player) { //TODO:Player no deberia ser el id?? No, es una funcion privada.
    let total = 0
    for (let resource of Object.values(player.resources)) {
        total += resource
    }
    return total
}



function get_resources(game, res) {
    if (game.phase === 2) {
        for (let i = 0; i < game.players.length; i++) {
            let villages_arr = [...game.players[i].villages]
            last_built = villages_arr[villages_arr.length-1]
            game.board.nodes[last_built].biomes.forEach((biome) => {
                game.players[i].resources[game.board.biomes[biome].resource]++
            })
        }
    } else {
        for (let i = 0; i < game.players.length; i++){
            for (let building of game.players[i].villages) {
                game.board.nodes[building].biomes.forEach((biome) => {
                    if (game.board.biomes[biome].token === res) {
                        game.players[i].resources[game.board.biomes[biome].resource]++
                    }
                });
            }
            for (let building of game.players[i].cities) {
                game.board.nodes[building].biomes.forEach((biome) => {
                    if (game.board.biomes[biome].token === res) {
                        game.players[i].resources[game.board.biomes[biome].resource] += 2
                    }
                })
            }
        }
    }
}

function dices() {
    return random(1,6) + random(1,6)
}

//TODO : Completar
function getMoves(id, game){

    let coordsVillage = [{x: 1, y: 1},
                    {x: 2, y: 2}]
    let coordsRoad =[coordsVillage, coordsVillage] 
    return {
        //roll_dices
        "0" : "aux",
        //build_village
        "1" : coordsVillage,
        // build_city
        "2" : coordsVillage,
        // build_road
        "3": coordsRoad,
        // buy_cards
        "4": "aux",
        // monopoly
        "5" : ["resurce1", "resurce2"],
        // discovery
        "6" : [["resurce1", "resurce2"],["resurce1", "resurce2"]],
        // knight
        "7" : [ {hexagon : 1, idPlayer : 2},
                {hexagon: 3, idPlayer: 4}],
        // order_selection
        "8" : "aux",
        // change_recourse
        "9" : [["resurce1", "resurce2"],["resurce1", "resurce2"]],
        // next_turn
        "10" : "aux"
 

    }
}
/**
 * Funcion para tirar los dados:
 *  1. El jugador ha de decidir tirar los datos (pulsar el boton).
 *  2. Se tiran los dados:
 *      a. Si sale distinto de 7, obtiene materiales de sus biomas.
 *      b. Si sale igual a 7, todo jugador con más de 7 cartas pierde la mitad.
 * 
 * @param {*} game  Partida sobre la que se juega.
 * @param {*} id    Jugador que ha decidido tirar los dados.
 */
function roll_dices(game) {
    game.last_roll  = dices()
    if (game.last_roll !== 7) {
        get_resources(game, game.last_roll)
    } else {
        for (let i = 0; i < 4; i++) {
            total = total_resources(game.players[i]);
            if (total > 7) {
                for (let j = 0; j < total/2; j++) {
                    let resources = Object.keys(game.players[i].resources)
                    let kill_resource = biome_resources[random(0, resources.length)]
                    while (game.players[i].resources[kill_resource] == 0) {
                        kill_resource = biome_resources[random(0, resources.length)]
                    }
                    game.players[i].resources[kill_resource]--
                }
            }
        }
    }
    return game
}

/**
 * Función para construir un pueblo. Esta función SOLO SE LLAMA cuando se sabe
 * de antemano que puede seguir construyendo.
 * 
 * @param {*} game      Partida sobre la que transcurre el juego.
 * @param {*} id        Jugador que ha pedido construir.
 * @param {{x:any, y:any}} coords    Coordenadas del nodo donde construir.
 */
function build_village(game, id, coords) {
    let index = game.players.findIndex(player => player.id === id)
    let x = coords.x, y = coords.y, ncoor = ncoor_toString(coords), rcoor = ''

    game.board.nodes[ncoor].building = { player: id, type: 'Village' }
    game.players[index].villages.add(ncoor)
    // COSTO: Trigo=1, Madera=1, Ladrillo=1, Lana=1
    if (game.phase === 3) {
        game.players[index].resources['Trigo']--
        game.players[index].resources['Madera']--
        game.players[index].resources['Ladrillo']--
        game.players[index].resources['Lana']--
    }
    // Adding new roads:
    if (x % 2 === 0) {  //TODO: Carretera ya creada- Hecho
        if (x-1 > 0) {
            rcoor = rcoor_toString(game, [coords, {x:x-1, y:y}]);
            if (game.board.roads[rcoor].id == null) {
                game.players[index].free_roads.add(rcoor)
            }
        }
        if (y-1 >= borders[x+1][0]) {
            rcoor = rcoor_toString(game, [coords, {x:x+1, y:y-1}]);
            if (game.board.roads[rcoor].id == null) {
                game.players[index].free_roads.add(rcoor)
            }
        }
        if (y+1 <= borders[x+1][1]) {
            rcoor = rcoor_toString(game, [coords, {x:x+1, y:y+1}]);
            if (game.board.roads[rcoor].id == null) {
                game.players[index].free_roads.add(rcoor)
            }
        }
    // Para x = impar (2n+1). (x,y) -> (x-1,y-1),(x-1,y+1),(x+1,y):
    } else {
        if (y-1 >= borders[x-1][0]) {
            rcoor = rcoor_toString(game, [coords, {x:x-1, y:y-1}]);
            if (game.board.roads[rcoor].id == null) {
                game.players[index].free_roads.add(rcoor)
            }
        }
        if (y+1 <= borders[x-1][1]) {
            rcoor = rcoor_toString(game, [coords, {x:x-1, y:y+1}]);
            if (game.board.roads[rcoor].id == null) {
                game.players[index].free_roads.add(rcoor)
            }
        }
        if (x+1 < 12) {
            rcoor = rcoor_toString(game, [coords, {x:x+1, y:y}]);
            if (game.board.roads[rcoor].id == null) {
                game.players[index].free_roads.add(rcoor)
            }
        }
    }

    // Deleting blocked nodes:
    for (let i = 0; i < 4; i++) {
        // a) The selected node from each player:
        game.players[i].free_nodes.delete(ncoor)
        // b) The colindant nodes from each player:
        // Para x = par (2n). (x,y) -> (x-1,y),(x+1,y-1),(x+1,y+1):
        if (x % 2 === 0) {
            if (x-1 > 0) {
                game.players[i].free_nodes.delete(ncoor_toString({x:x-1, y:y}))
            }
            if (y-1 >= borders[x+1][0]) {
                game.players[i].free_nodes.delete(ncoor_toString({x:x+1,y:y-1}))
            }
            if (y+1 <= borders[x+1][1]) {
                game.players[i].free_nodes.delete(ncoor_toString({x:x+1,y:y+1}))
            }
        // Para x = impar (2n+1). (x,y) -> (x-1,y-1),(x-1,y+1),(x+1,y):
        } else {
            if (y-1 >= borders[x-1][0]) {
                game.players[i].free_nodes.delete(ncoor_toString({x:x-1,y:y-1}))
            }
            if (y+1 <= borders[x-1][1]) {
                game.players[i].free_nodes.delete(ncoor_toString({x:x-1,y:y+1}))
            }
            if (x+1 < 12) {
                game.players[i].free_nodes.delete(ncoor_toString({x:x+1,y:y}))
            }
        }
    }
}

/**
 * Función para construir una ciudad. Esta función SOLO SE LLAMA cuando se sabe
 * de antemano que puede seguir construyendo.
 * 
 * @param {*} game      Partida sobre la que transcurre el juego.
 * @param {*} id        Jugador que ha pedido construir.
 * @param {{x:any, y:any}} coords    Coordenadas del nodo donde construir.
 */
function build_city(game, id, coords) {
    let index = game.players.findIndex(player => player.id === id)
    let ncoor = ncoor_toString(coords)

    game.board.nodes[ncoor].building.type = 'City'
    game.players[index].cities.add(ncoor)
    // COSTO: Poblado=1, Trigo=2, Piedra=2
    game.players[index].villages.delete(ncoor)
    game.players[index].resources['Trigo']  -= 2
    game.players[index].resources['Piedra'] -= 3
}

/**
 * Función para construir una carretera. Esta función SOLO SE LLAMA cuando se sabe
 * de antemano que puede seguir construyendo.
 * 
 * @param {*} game      Partida sobre la que transcurre el juego.
 * @param {*} id        Jugador que ha pedido construir.
 * @param {[{x:any, y:any}, {x:any, y:any}]} coords    Coordenadas del nodo donde construir.
 */
function build_road(game, id, coords) { //TODO:Añadir posibilidad de contruir
    let index = game.players.findIndex(player => player.id === id)
    let rcoor = rcoor_toString(game, coords)
    game.board.roads[rcoor].id = id
    game.players[index].roads.add(rcoor)
    // COSTO: Madera=1, Ladrillo=1
    if (game.phase === 3) {
        game.players[index].resources['Madera']--
        game.players[index].resources['Ladrillo']--
    }
    for (let i = 0; i < 4; i++) {
        game.players[i].free_roads.delete(rcoor)
    }

    // Add possible new roads.
    // TODO: se puede optimizar, para despues sino.
    // - Se puede evitar si una arista es ocupada o no ya que el nodo a comprobar es el nodo
    // de la arista que ya hemos recibido.
    // - Se puede evitar la comprobacion de si es par o no, se puede hacer que si o si
    // el primero sea par y el segundo sea impar.
    for (let coord of coords) {
        let x = coord.x, y = coord.y, ncoor = ncoor_toString(coord), free_node = true
        // Para x = par (2n). (x,y) -> (x-1,y),(x+1,y-1),(x+1,y+1):
        if (x % 2 === 0) {
            if (x-1 > 0) {
                let mcoor = {x:x-1, y:y}
                if (game.board.nodes[ncoor].building == null || game.board.nodes[ncoor].building.id === id) {
                    rcoor = rcoor_toString(game, [coord, mcoor]);
                    if (game.board.roads[rcoor].id == null) {
                        game.players[index].free_roads.add(rcoor)
                    }
                }
                if (game.board.nodes[ncoor_toString(mcoor)].building != null) {
                    free_node = false
                }
            }
            if (y-1 >= borders[x+1][0]) {
                let mcoor = {x:x+1, y:y-1}
                if (game.board.nodes[ncoor].building == null || game.board.nodes[ncoor].building.id === id) {
                    rcoor = rcoor_toString(game, [coord, mcoor]);
                    if (game.board.roads[rcoor].id == null) {
                        game.players[index].free_roads.add(rcoor)
                    }
                }
                if (game.board.nodes[ncoor_toString(mcoor)].building != null) {
                    free_node = false
                }
            }
            if (y+1 <= borders[x+1][1]) {
                let mcoor = {x:x+1, y:y+1}
                if (game.board.nodes[ncoor].building == null || game.board.nodes[ncoor].building.id === id) {
                    rcoor = rcoor_toString(game, [coord, mcoor]);
                    if (game.board.roads[rcoor].id == null) {
                        game.players[index].free_roads.add(rcoor)
                    }
                }
                if (game.board.nodes[ncoor_toString(mcoor)].building != null) {
                    free_node = false
                }
            }
        // Para x = impar (2n+1). (x,y) -> (x-1,y-1),(x-1,y+1),(x+1,y):
        } else {
            if (y-1 >= borders[x-1][0]) {
                let mcoor = {x:x-1, y:y-1}
                if (game.board.nodes[ncoor].building == null || game.board.nodes[ncoor].building.id === id) {
                    rcoor = rcoor_toString(game, [coord, mcoor]);
                    if (game.board.roads[rcoor].id == null) {
                        game.players[index].free_roads.add(rcoor)
                    }
                } 
                if (game.board.nodes[ncoor_toString(mcoor)].building != null) {
                    free_node = false
                }
            }
            if (y+1 <= borders[x-1][1]) {
                let mcoor = {x:x-1, y:y+1}
                if (game.board.nodes[ncoor].building == null || game.board.nodes[ncoor].building.id === id) {
                    rcoor = rcoor_toString(game, [coord, mcoor]);
                    if (game.board.roads[rcoor].id == null) {
                        game.players[index].free_roads.add(rcoor)
                    }
                }
                if (game.board.nodes[ncoor_toString(mcoor)].building != null) {
                    free_node = false
                }
            }
            if (x+1 < 12) {
                let mcoor = {x:x+1, y:y}
                if (game.board.nodes[ncoor].building == null || game.board.nodes[ncoor].building.id === id) {
                    rcoor = rcoor_toString(game, [coord, mcoor]);
                    if (game.board.roads[rcoor].id == null) {
                        game.players[index].free_roads.add(rcoor)
                    }
                }
                if (game.board.nodes[ncoor_toString(mcoor)].building != null) {
                    free_node = false
                }
            } 
        }
        if (free_node) {
            game.players[index].free_nodes.add(ncoor)
        }
    }
}

/**
 * Función para comprar una carta de desarrollo. Esta función SOLO SE LLAMA cuando se sabe
 * de antemano que tiene los recursos necesarios y quedan cartas de desarrollo disponibles.
 * 
 * @param {*} game      Partida sobre la que transcurre el juego.
 * @param {*} id        Jugador que ha pedido construir.
 */
function buy_cards(game, id) {
    let index = game.players.findIndex(player => player.id === id)
    let card = game.board.growth_cards.shift();   //Sacamos la primera carta del vector
    game.players[index].resources['Grano']--
    game.players[index].resources['Piedra']--
    game.players[index].resources['Lana']--
    if(card == 'Caballero'){
        game.players[index].growth_cards.Caballero++;
    }else if(card == 'Descubrimiento'){
        game.players[index].growth_cards.Descubrimiento++;
    }else if(card == 'Carreteras'){
        game.players[index].growth_cards.Cartas_Carreteras++;
    }else if(card == 'Monopolio'){
        game.players[index].growth_cards.Monopolio++;
    }else if(card == 'Punto'){
        game.players[index].growth_cards.Punto++;
    }
}

function barajar_desarrollos(game) {
    let randomNumber = 0;
    let numCards = 25;
    for(let i = 0; i < 25; i++){
        randomNumber = Math.floor(Math.random() * numCards);
        numCards--;
        if(randomNumber < game.board.growth_cards.Caballero){//Coloca caballero
            game.board.growth_cards.Caballero--;
            game.board.cartasDesarrollo.push('Caballero');
        }else if(randomNumber < (game.board.growth_cards.Caballero+ game.board.growth_cards.Carreteras)){//Coloca Carreteras
            game.board.growth_cards.Carreteras--;
            game.board.cartasDesarrollo.push('Carreteras');
        }else if(randomNumber < (game.board.growth_cards.Caballero+ game.board.growth_cards.Carreteras+game.board.growth_cards.Monopolio)){//Coloca Monopolio
            game.board.growth_cards.Monopolio--;
            game.board.cartasDesarrollo.push('Monopolio');
        }else if(randomNumber < (game.board.growth_cards.Caballero+ game.board.growth_cards.Carreteras+game.board.growth_cards.Monopolio+game.board.growth_cards.Descubrimiento)){//Coloca Descubrimiento
            game.board.growth_cards.Descubrimiento--;
            game.board.cartasDesarrollo.push('Descubrimiento');
        }else { //Coloca Punto
            game.board.growth_cards.Punto--;
            game.board.cartasDesarrollo.push('Punto');
        }
    }
}

function monopoly(game, id, resource) {
    let index = game.players.findIndex(player => player.id === id)
    game.players[index].growth_cards.Monopolios--
    let res = 0;
    for(let i = 0; i < game.players.length; i++){
        res += game.players[i].resources[resource]
        game.players[i].resources[resource]=0
    }
    game.players[index].resources[resource]=res
}

function discovery (game, id, resource, resource2) {
    let index = game.players.findIndex(player => player.id === id)
    game.players[index].growth_cards.Descubrimientos--
    game.players[index].resources[resource]++
    game.players[index].resources[resource2]++
}

function knight(game, id, hexagon, idPlayer) {
    let index = game.players.findIndex(player => player.id === id)
    game.players[index].growth_cards.Caballeros--
    game.players[index].growth_cards.Caballeros_usados++
    game.board.thief_biome=hexagon
    let index2 = game.players.findIndex(player => player.id === idPlayer)

    let randomNumber = Math.floor(Math.random() * total_resources(idPlayer));

    if(randomNumber < game.players[index2].resources['Grano']){//Coloca caballero
        game.players[index2].resources['Grano']--;
        game.players[index].resources['Grano']++;
    }else if(randomNumber < (game.players[index2].resources['Grano']+game.players[index2].resources['Madera'])){//Coloca Carreteras
        game.players[index2].resources['Madera']--;
        game.players[index].resources['Madera']++;
    }else if(randomNumber <  (game.players[index2].resources['Grano']+game.players[index2].resources['Madera']+game.players[index2].resources['Ladrillo'])){//Coloca Monopolio
        game.players[index2].resources['Ladrillo']--;
        game.players[index].resources['Ladrillo']++;
    }else if(randomNumber < (game.players[index2].resources['Grano']+game.players[index2].resources['Madera']+game.players[index2].resources['Ladrillo']+game.players[index2].resources['Piedra'])){//Coloca Descubrimiento
        game.players[index2].resources['Piedra']--;
        game.players[index].resources['Piedra']++;
    }else { 
        game.players[index2].resources['Lana']--;
        game.players[index].resources['Lana']++;
    }
}

function change_recourse (game, id, resource, resource2) {  //resource -> recurso que quiero ||resource2 -> recurso por el que cambio
    let index = game.players.findIndex(player => player.id === id)
    game.players[index].resources[resource2] -= 4          //En el frontend solo deben dar opciones de cambio si tiene 4 o mas del recurso que cambia
    game.players[index].resources[resource]++
}

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function next_turn(game) {
    if (game.phase === 1) {
        if (game.current_turn !== game.players.length-1) {
            game.current_turn++
        } else {
            console.log("=========================== DE FASE 1 a FASE 2 ===========================")
            game.phase = 2
        }
    } else if (game.phase === 2) {
        if (game.current_turn !== 0) {
            game.current_turn--
        } else {
            console.log("=========================== DE FASE 2 a FASE 3 ===========================")
            game.players.forEach((player) => {
                player.free_nodes = new Set()
            })
            get_resources(game, 0)
            console.log(game.players)
            game.phase = 3
        }
    } else {
        if(win_check){
            console.log(`The winner is player ${game.players[current_turn].id}`)
        }else{
            game.current_turn = (game.current_turn+1)%(game.players.length)
        }
    }
}

function win_check(game, id){//faltan los puntos por objetos
    let index = game.players.findIndex(player => player.id === id)
    let puntos = game.players[index].villages.size + 2*(game.players[index].cities.size)+ game.players[index].growth_cards.Puntos
    knights_points(game,id)
    if(id==game.board.player_max_knights){
        puntos += 2
    }
    roads_points(game,id)
    if(id==game.board.player_max_roads){
        puntos += 2
    }
    if(puntos >= 10){
        console.log('< La partida finalizo >')
    }
    return puntos >= 10
}

function knights_points(game, id){
    let index = game.players.findIndex(player => player.id === id)
    if(game.players[index].used_knights > game.board.max_knights){
        game.board.max_knights = game.players[index].used_knights
        game.board.player_max_knights = id
    }
}

function roads_points(game, id){//TODO: Version 1.0
    let index = game.players.findIndex(player => player.id === id)
    if(game.players[index].roads.size > game.board.max_roads){
        game.board.max_roads =game.players[index].roads.size
        game.board.player_max_roads = id
    }
}

// ============================================================================
// SIMULACION
// ============================================================================
function start_game(game) {
    game.board = create_board()
    console.log('tablero creado')
    for (let i = 0; i < game.players.length; i++) {
        game.players[i].free_nodes = new Set(Object.keys(game.board.nodes))
        game.players[i].resources  = { 
            Trigo: 0,
            Madera: 0,
            Ladrillo: 0,
            Piedra: 0,
            Lana: 0
        }
        game.players[i].growth_cards = { 
            Caballero: 0,
            Carreteras: 0,
            Descubrimiento: 0,
            Monopolio: 0,
            Punto: 0
        }
    }
    barajar_desarrollos(game)
}

function order_selection(game, order_selection_rolls) {
    game.players.sort(function(a,b) {
        let fst_roll = order_selection_rolls[game.players.indexOf(a)];
        let snd_roll = order_selection_rolls[game.players.indexOf(b)];
        if (fst_roll == snd_roll) {
            return random(1,2);
        } else {
            return snd_roll - fst_roll;
        }
    });
    game.current_turn = 0
    game.phase = 1
}

function game_simulation() {
    console.log("=================== CREACIÓN DE PARTIDA Y JUGADORES ===================")
    game = create_game(generate_code())
    rl.question(`<Press enter to join>`, () => {
        game.players.push(create_player(ids[0]))
        console.log(`====> Player #${game.players[0].id} has joined`) 
        rl.question(`<Press enter to join>`, () => {
            game.players.push(create_player(ids[1]))
            console.log(`====> Player #${game.players[1].id} has joined`) 
            rl.question(`<Press enter to join>`, () => {
                game.players.push(create_player(ids[2]))
                console.log(`====> Player #${game.players[2].id} has joined`) 
                rl.question(`<Press enter to join>`, () => {
                    game.players.push(create_player(ids[3]))
                    console.log(`====> Player #${game.players[3].id} has joined`)
                    console.log('<Before starting the game>', game)
                    start_game(game)
                    console.log('<After starting the game>', game)
                    order_selection_simulation(game)
                })
            })
        })
    })
}

function order_selection_simulation(game) {
    console.log("=================== SIMULACION DE SELECCIÓN DE TURNO ===================")
    let order_selection_rolls = new Array(game.players.length), res = 0
    rl.question(`<Press enter to roll the dices>`, () => {
        res = dices()
        order_selection_rolls[game.current_turn++] = res
        console.log(`====> Player #${game.players[0].id} got a ${res}`) 

        rl.question(`<Press enter to join>`, () => {
            res = dices()
            order_selection_rolls[game.current_turn++] = res
            console.log(`====> Player #${game.players[1].id} got a ${res}`)

            rl.question(`<Press enter to join>`, () => {
                res = dices()
                order_selection_rolls[game.current_turn++] = res
                console.log(`====> Player #${game.players[2].id} got a ${res}`) 

                rl.question(`<Press enter to join>`, () => {
                    res = dices()
                    order_selection_rolls[game.current_turn++] = res
                    console.log(`====> Player #${game.players[3].id} got a ${res}`)
                    console.log('<Unordered players>', game.players)
                    order_selection(game, order_selection_rolls)
                    console.log('<Ordered players>', game.players)
                    round_simulation(game)
                })
            })
        })
    })
}

function order_selection(game,id){
    let index = game.players.findIndex(player => player.id === id);
    game.order[index] = dices();
}

function round_simulation(game) {
    console.log("=================== SIMULACION DE UNA RONDA ===================")
    console.log(`Turn ${game.current_turn}`)
    console.log(`Player #${game.players[game.current_turn].id}`)
    console.log(game.players)

    if (game.phase < 3) {
        // =====> SIMULAMOS LA CONSTRUCCIÓN DE PUEBLO: AQUI HABRIA QUE LLAMAR A BUILD_VILLAGE UNA VEZ EL JUGADOR LE DE A ESE BOTON.
        console.log('< Construcción del poblado >')
        rl.question('Coordenada en x: ', (x) => {
            rl.question('Coordenada en y: ', (y) => {
                build_village(game, game.players[game.current_turn].id, {x:parseInt(x),y:parseInt(y)})
                // =====> SIMULAMOS LA CONSTRUCCIÓN DE CARRETERA: AQUI HABRIA QUE LLAMAR A BUILD_ROAD UNA VEZ EL JUGADOR LE DE A ESE BOTON.
                console.log('< Construcción de la carretera >')
                rl.question('Coordenada en x del primer nodo: ', (x_1) => {
                    rl.question('Coordenada en y del primer nodo: ', (y_1) => {
                        rl.question('Coordenada en x del segundo nodo: ', (x_2) => {
                            rl.question('Coordenada en y del segundo nodo: ', (y_2) => {
                                build_road(game, game.players[game.current_turn].id, 
                                    [{x:parseInt(x_1),y:parseInt(y_1)},{x:parseInt(x_2),y:parseInt(y_2)}])
                                next_turn(game)
                                round_simulation(game)
                            })
                        })
                    })
                })
            })
        })
    } else {
        build_simulation(game)
    }
}

function build_simulation(game) {
    rl.question('(0) Pueblo, (1) Ciudad, (2) Carretera: ', (option) => {
        if (option === "0") {
            console.log('< Construcción del poblado >')
            rl.question('Coordenada en x: ', (x) => {
                rl.question('Coordenada en y: ', (y) => {
                    build_village(game, game.players[game.current_turn].id, {x:parseInt(x),y:parseInt(y)})
                    next_turn(game)
                    round_simulation(game)
                })
            })
        } else if (option === "1") {
            console.log('< Construcción de la ciudad >')
            rl.question('Coordenada en x: ', (x) => {
                rl.question('Coordenada en y: ', (y) => {
                    build_city(game, game.players[game.current_turn].id, {x:parseInt(x),y:parseInt(y)})
                    next_turn(game)
                    round_simulation(game)
                })
            })
        } else if (option === "2") {
            console.log('< Construcción de la carretera >')
            rl.question('Coordenada en x del primer nodo: ', (x_1) => {
                rl.question('Coordenada en y del primer nodo: ', (y_1) => {
                    rl.question('Coordenada en x del segundo nodo: ', (x_2) => {
                        rl.question('Coordenada en y del segundo nodo: ', (y_2) => {
                            build_road(game, game.players[game.current_turn].id, 
                                [{x:parseInt(x_1),y:parseInt(y_1)},{x:parseInt(x_2),y:parseInt(y_2)}])
                            next_turn(game)
                            round_simulation(game)
                        })
                    })
                })
            })
        }
    })
}

// game_simulation()
module.exports = { 
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
    first_roll,
    barajar_desarrollos
}