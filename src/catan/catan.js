// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

// -- Math purposes

function random(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function shuffle(arr) {
    let shuffled = arr
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    return shuffled
}

function sum(array, end) {
    let res = 0
    for (let i = 0; i < end; i++) {
        res += array[i]
    }
    return res
}

// -- Catan purposes 

function ncoor_toString(coords) {
    return coords.x.toString() + "," + coords.y.toString()
}

function string_toNcoor(coords) {
    let splited_coords = coords.split(',')
    return {x: parseInt(splited_coords[0]), y: parseInt(splited_coords[1]) }
}

function rcoor_toString(game, coords) {
    let fst_coor = ncoor_toString(coords[0])
    let snd_coor = ncoor_toString(coords[1])
    let rcoor = fst_coor + ":" + snd_coor
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

function string_toRcoor(coords) {
    let splited_coords = coords.split(':')
    return [string_toNcoor(splited_coords[0]), string_toNcoor(splited_coords[1])]
}

//=============================================================================
// PARTIDA 
//=============================================================================
// Una partida tiene:
// - Lista de jugadores.
// - Tablero. Un tablero tiene:
//   - Para su construcción:
//     - Terraformación de biomas:
//       1. Tierra de cultivo/Trigo   4
//       2. Bosque/Madera             4
//       3. Colinas/Ladrillo          3
//       4. Montañas/Piedra           3
//       5. Pasto/Lana                4
//       6. Desierto                  1
//     ----------------------------------
//       TOTAL                       19
const nBiomes           = 19
const biomesNames       = ['Cultivo', 'Bosque', 'Colina', 'Monte', 'Pasto', 'Desierto']
const biomesResources   = ['Trigo', 'Madera', 'Ladrillo', 'Piedra', 'Lana', 'None']
const biomesQuant       = [4, 4, 3, 3, 4, 1]
const biomesProbs       = biomesQuant.map(x => x / nBiomes)
const biomesTokenStarts = [0, 2, 4, 6, 8, 10]
const biomesTokenLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R' ]
const biomesTokenValues = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11];

//     - Limites para el calculo de coordenadas en el grid cuadrado.
const borders = [[3,7],[2,8],[2,8],[1,9],[1,9],[0,10],[0,10],[1,9],[1,9],[2,8],[2,8],[3,7]];
//   - Como objeto final:
//     - Biomas (celdas hexagonales).
//     - Id del bioma donde se encuentra el ladron.
//     - Nodos de construccion (vertices).
//     - Caminos de construccion (aristas).
//     - Construcciones hechas y a quien pertenecen.
//     - Una baraja con cartas de desarrollo
function create_board() {

    // Generar biomas:
    let new_biomes  = [...biomesQuant], shuffled_biomes = []
    let tokens_start = biomesTokenStarts[random(0, biomesTokenStarts.length)], offset = 0
    let biomes_left = nBiomes

    while (biomes_left > 0) {
        let selected_biome = Math.random()
        for (let i = 0; i < new_biomes.length; i++) {
            if (new_biomes[i] > 0 && selected_biome < sum(biomesProbs, i+1)) {
                new_biomes[i]--
                shuffled_biomes.push({
                    type: biomesNames[i],
                    resource: biomesResources[i],
                    token: (i !== 5) ? 
                        {letter: biomesTokenLetter[((19-biomes_left)-offset+tokens_start)%18], value: biomesTokenValues[((19-biomes_left)-offset+tokens_start)%18]} :
                        {letter: 'S', value: 0 }
                })
                if (i === 5) {
                    offset++
                }
                biomes_left--
            }
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
        biomes: shuffled_biomes,
        robber_biome: -1,
        nodes: nodes,
        roads: edges,
        max_knights: 2,
        player_max_knights: 0,
        max_roads: 4,
        player_max_roads: 0,
    }
}

// - Cartas de desarrollo:
//   1. Caballeros                  14
//   2. Construccion de carreteras   2
//   3. Año de prosperidad           2
//   4. Monopolio                    2
//   5. Biblioteca (1PTO)            1
//   6. Capilla (1PTO)               1
//   7. Gran salon (1PTO)            1
//   8. Mercado (1PTO)               1
//   9. Uninversidad (1PTO)          1
// --------------------------------------
//   TOTAL                          25
const nDevelopCards     = 25
const developCardsNames = ['Caballeros', 'Carreteras', 'Descubrimiento', 'Monopolio', 'Biblioteca', 'Capilla', 'Palacio', 'Mercado', 'Universidad']
const puntosNames       = ['Capilla','Biblioteca','Mercado','Palacio','Universidad']
const developCardsQuant = [14, 2, 2, 2, 1, 1, 1, 1, 1]
const developCardsProbs = developCardsQuant.map(x => x / nDevelopCards);

/**
 * Funcion para barajar una bajara de cartas de desarrollo.
 * 
 * @returns Baraja de cartas de desarrollo en orden aleatorio
 */
function create_development_deck() {

    let new_deck   = [...developCardsQuant], shuffled_deck = [];
    let cards_left = nDevelopCards
    while (cards_left > 0) {
        let selected_card = Math.random()
        for (let i = 0; i < new_deck.length; i++) {
            if (new_deck[i] > 0 && selected_card < sum(developCardsProbs, i+1)) {
                new_deck[i]--
                shuffled_deck.push(developCardsNames[i])
                cards_left--
            }
        }
    }
    return shuffle(shuffle(shuffled_deck))
}

// - Codigo.
// - Turno actual de partida.
// - Si esta comenzada o no (phase)
function create_game(code, players) { 

    //players = shuffle(players)
    let game    = {
        code: code,       // Codigo de la partida
        players: [],      // Jugadores de la partida
        current_turn : 0, // Que jugador esta jugando ahora
        board: create_board(),
                          // Tablero de la partida
        develop_cards: create_development_deck(),
                          // Baraja de cartas de desarrollo
        dices_res: [0,0], // Tirada del turno actual
        winner: 0,
        phase: 1,         // Indica el estado de la partida:
                          // - (0). Ni se ha empezado. Se empezará partida y se elegirá el orden de juego (sin implementar).
                          // - (1). Primera ronda: los jugadores colocan un pueblo y una carretera en un sitio a elección en el orden elegido.
                          // - (2). Segunda Ronda: los jugadores colocan un pueblo y una carretera en un sitio a elección pero en orden inverso.
                          // - (3). Resto de rondas.
    }
    for (let i = 0; i < players.length; i++) {
        game.players.push({
            name: players[i],
            free_nodes: Object.keys(game.board.nodes),
            free_roads: [],
            first_roads: [],
            villages: [],
            cities: [],
            roads: [],
            buildings: {
                'Villages': 5,
                'Cities': 4,
                'Roads': 15
            },
            resources: {
                'Trigo': 10,
                'Madera': 10,
                'Ladrillo': 10,
                'Piedra': 10,
                'Lana': 10
            },
            can_build: [ false, false, false ],
            develop_cards: {
                'Caballeros': 10,
                'Carreteras': 10,
                'Monopolios': 10,
                'Descubrimientos': 10,
                'Capilla': 0,
                'Biblioteca': 0,
                'Mercado': 0,
                'Palacio': 0,
                'Universidad': 0,
            },
            can_buy: false,
            used_knights: 0,
            force_knight: false,
            roads_build_4_free: 0, 
            used_develop_cards: 0,
            harbors: {
                'Trigo': false,
                'Madera': false,
                'Ladrillo': false,
                'Piedra': false,
                'Lana': false,
                'Puerto Norte': false,
                'Puerto Este': false,
                'Puerto Sur': false,
                'Puerto Oeste': false
            },
            can_change: [false, false, false, false, false],
            trade_costs: [4,4,4,4,4]
        })
    }
    console.log('Tablero creado')
    return game
}

/**
 * Función para construir una ciudad. Esta función SOLO SE LLAMA cuando se sabe
 * de antemano que puede seguir construyendo.
 * 
 * @param {*} game      Partida sobre la que transcurre el juego.
 * @param {*} id        Jugador que ha pedido construir.
 * @param {{x:any, y:any}} coords    Coordenadas del nodo donde construir.
 */
function build_city(game, player, ncoor) {

    let i = game.players.findIndex(curr_player => curr_player.name === player)
    game.board.nodes[ncoor].building.type = 'City'

    // Taking the needed resources:
    // - Poblado: 1, Trigo: 2, Piedra: 3
    game.players[i].buildings['Cities']--
    game.players[i].resources['Trigo']  -= 2
    game.players[i].resources['Piedra'] -= 3
    update_actions_with_cost(game)

    // Adding the new city
    let cities_set = (game.players[i].cities.length > 0) ? new Set(game.players[i].cities) : new Set()
    cities_set.add(ncoor)
    game.players[i].cities = [...cities_set]
    // Removing the old village
    let villages_set = (game.players[i].villages.length > 0) ? new Set(game.players[i].villages) : new Set()
    villages_set.delete(ncoor)
    game.players[i].villages = [...villages_set]

}

/**
 * Función para construir una carretera. Esta función SOLO SE LLAMA cuando se sabe
 * de antemano que puede seguir construyendo.
 * 
 * @param {*} game      Partida sobre la que transcurre el juego.
 * @param {*} player        Jugador que ha pedido construir.
 * @param {[{x:any, y:any}, {x:any, y:any}]} coords    Coordenadas del nodo donde construir.
 */
function build_road(game, player, rcoor, free_road = false) {

    //console.log("NOMBRE DEL JUGADOR: ", player, ", COORDS: ", string_toRcoor(rcoor))
    let i = game.players.findIndex(curr_player => curr_player.name === player)
    let coords = string_toRcoor(rcoor)

    // Taking the needed resources:
    // - Madera: 1, Ladrillo: 1
    game.players[i].buildings['Roads']--
    if (game.phase === 3 && !free_road) {
        game.players[i].resources['Madera']--
        game.players[i].resources['Ladrillo']--
        update_actions_with_cost(game)
    }

    // Adding the new road
    game.board.roads[rcoor].id = player
    let roads_set = (game.players[i].roads.length > 0) ? new Set(game.players[i].roads) : new Set()
    roads_set.add(rcoor)
    game.players[i].roads = [...roads_set]
    // Deleting the road from the available roads
    for (let p of game.players) {
        let free_roads_set = (p.free_roads.length > 0) ? new Set(p.free_roads) : new Set()
        free_roads_set.delete(rcoor)
        p.free_roads = [...free_roads_set]
    }

    // Adding the possible new roads
    let free_nodes_set = (game.players[i].free_nodes.length > 0) ? new Set(game.players[i].free_nodes) : new Set()
    let free_roads_set = (game.players[i].free_roads.length > 0) ? new Set(game.players[i].free_roads) : new Set()
    for (let coord of coords) {
        let x = coord.x, y = coord.y, ncoor = ncoor_toString(coord), free_node = true
        // Para x = par (2n). (x,y) -> (x-1,y),(x+1,y-1),(x+1,y+1):
        if (x % 2 === 0) {
            if (x-1 > 0) {
                let mcoor = {x:x-1, y:y}
                if (game.board.nodes[ncoor].building == null || game.board.nodes[ncoor].building.id === player) {
                    rcoor = rcoor_toString(game, [coord, mcoor]);
                    if (game.board.roads[rcoor].id == null) {
                        free_roads_set.add(rcoor)
                    }
                }
                if (game.board.nodes[ncoor].building != null || game.board.nodes[ncoor_toString(mcoor)].building != null) {
                    free_node = false
                }
            }
            if (y-1 >= borders[x+1][0]) {
                let mcoor = {x:x+1, y:y-1}
                if (game.board.nodes[ncoor].building == null || game.board.nodes[ncoor].building.id === player) {
                    rcoor = rcoor_toString(game, [coord, mcoor]);
                    if (game.board.roads[rcoor].id == null) {
                        free_roads_set.add(rcoor)
                    }
                }
                if (game.board.nodes[ncoor].building != null || game.board.nodes[ncoor_toString(mcoor)].building != null) {
                    free_node = false
                }
            }
            if (y+1 <= borders[x+1][1]) {
                let mcoor = {x:x+1, y:y+1}
                if (game.board.nodes[ncoor].building == null || game.board.nodes[ncoor].building.id === player) {
                    rcoor = rcoor_toString(game, [coord, mcoor]);
                    if (game.board.roads[rcoor].id == null) {
                        free_roads_set.add(rcoor)
                    }
                }
                if (game.board.nodes[ncoor].building != null || game.board.nodes[ncoor_toString(mcoor)].building != null) {
                    free_node = false
                }
            }
        // Para x = impar (2n+1). (x,y) -> (x-1,y-1),(x-1,y+1),(x+1,y):
        } else {
            if (y-1 >= borders[x-1][0]) {
                let mcoor = {x:x-1, y:y-1}
                if (game.board.nodes[ncoor].building == null || game.board.nodes[ncoor].building.id === player) {
                    rcoor = rcoor_toString(game, [coord, mcoor]);
                    if (game.board.roads[rcoor].id == null) {
                        free_roads_set.add(rcoor)
                    }
                } 
                if (game.board.nodes[ncoor].building != null || game.board.nodes[ncoor_toString(mcoor)].building != null) {
                    free_node = false
                }
            }
            if (y+1 <= borders[x-1][1]) {
                let mcoor = {x:x-1, y:y+1}
                if (game.board.nodes[ncoor].building == null || game.board.nodes[ncoor].building.id === player) {
                    rcoor = rcoor_toString(game, [coord, mcoor]);
                    if (game.board.roads[rcoor].id == null) {
                        free_roads_set.add(rcoor)
                    }
                }
                if (game.board.nodes[ncoor].building != null || game.board.nodes[ncoor_toString(mcoor)].building != null) {
                    free_node = false
                }
            }
            if (x+1 < 12) {
                let mcoor = {x:x+1, y:y}
                if (game.board.nodes[ncoor].building == null || game.board.nodes[ncoor].building.id === player) {
                    rcoor = rcoor_toString(game, [coord, mcoor]);
                    if (game.board.roads[rcoor].id == null) {
                        free_roads_set.add(rcoor)
                    }
                }
                if (game.board.nodes[ncoor].building != null || game.board.nodes[ncoor_toString(mcoor)].building != null) {
                    free_node = false
                }
            } 
        }
        if (free_node) {
            free_nodes_set.add(ncoor)
        }
    }
    game.players[i].free_nodes = [...free_nodes_set]
    game.players[i].free_roads = [...free_roads_set]
}

/**
 * Función para construir un pueblo. Esta función SOLO SE LLAMA cuando se sabe
 * de antemano que puede seguir construyendo.
 * 
 * @param {*} game      Partida sobre la que transcurre el juego.
 * @param {*} id        Jugador que ha pedido construir.
 * @param {*} coords    Coordenadas del nodo donde construir (como string).
 */
function build_village(game, player, ncoor) {

    //console.log("NOMBRE DEL JUGADOR: ", player, ", COORDS: ", string_toNcoor(ncoor))
    let i = game.players.findIndex(curr_player => curr_player.name === player)
    let coords = string_toNcoor(ncoor), x = coords.x, y = coords.y, rcoor = ''

    // Taking the needed resources:
    // - Trigo: 1, Madera: 1, Ladrillo: 1, Lana: 1
    game.players[i].buildings['Villages']--
    if (game.phase === 3) {
        game.players[i].resources['Trigo']--
        game.players[i].resources['Madera']--
        game.players[i].resources['Ladrillo']--
        game.players[i].resources['Lana']--
    }

    // Updating player harbors
    if (ncoor === '0,5' || ncoor === '1,6') {
        game.players[i].harbors['Trigo'] = true
        game.players[i].trade_costs[0] = 2
    } else if (ncoor === '3,1' || ncoor === '4,1') {
        game.players[i].harbors['Madera'] = true
        game.players[i].trade_costs[1] = 2
    } else if (ncoor === '7,1' || ncoor === '8,1') {
        game.players[i].harbors['Ladrillo'] = true
        game.players[i].trade_costs[2] = 2
    } else if (ncoor === '2,8' || ncoor === '3,9') {
        game.players[i].harbors['Piedra'] = true
        game.players[i].trade_costs[3] = 2
    } else if (ncoor === '8,9' || ncoor === '9,8') {
        game.players[i].harbors['Lana'] = true
        game.players[i].trade_costs[4] = 2
    } else if (ncoor === '0,3' || ncoor === '1,2') {
        game.players[i].harbors['Puerto Norte'] = true
        for (let j = 0; j < 5; j++) {
            game.players[i].trade_costs[j] = Math.min(game.players[i].trade_costs[j], 3)
        }
    } else if (ncoor === '5,10' || ncoor === '6,10') {
        game.players[i].harbors['Puerto Este'] = true
        for (let j = 0; j < 5; j++) {
            game.players[i].trade_costs[j] = Math.min(game.players[i].trade_costs[j], 3)
        }
    } else if (ncoor === '10,6' || ncoor === '11,5') {
        game.players[i].harbors['Puerto Sur'] = true
        for (let j = 0; j < 5; j++) {
            game.players[i].trade_costs[j] = Math.min(game.players[i].trade_costs[j], 3)
        }
    } else if (ncoor === '10,2' || ncoor === '11,3') {
        game.players[i].harbors['Puerto Oeste'] = true
        for (let j = 0; j < 5; j++) {
            game.players[i].trade_costs[j] = Math.min(game.players[i].trade_costs[j], 3)
        }
    }
    update_actions_with_cost(game)


    // Adding the new village:
    let villages_set = (game.players[i].villages.length > 0) ? new Set(game.players[i].villages) : new Set()
    game.board.nodes[ncoor].building = { player: player, type: 'Village'}
    villages_set.add(ncoor)
    game.players[i].villages = [...villages_set]

    // Adding the new roads:
    let free_roads_set = (game.players[i].free_roads.length > 0) ? new Set(game.players[i].free_roads) : new Set()
    let first_roads_set = new Set()
    if (x%2 === 0) {
        if (x-1 > 0) {
            rcoor = rcoor_toString(game, [coords, {x:x-1, y:y}])
            if (game.board.roads[rcoor].id == null) {
                free_roads_set.add(rcoor)
                if (game.phase !== 3) {
                    first_roads_set.add(rcoor)
                }
            }
        }
        if (y-1 >= borders[x+1][0]) {
            rcoor = rcoor_toString(game, [coords, {x:x+1, y:y-1}]);
            if (game.board.roads[rcoor].id == null) {
                free_roads_set.add(rcoor)
                if (game.phase !== 3) {
                    first_roads_set.add(rcoor)
                }
            }
        }
        if (y+1 <= borders[x+1][1]) {
            rcoor = rcoor_toString(game, [coords, {x:x+1, y:y+1}]);
            if (game.board.roads[rcoor].id == null) {
                free_roads_set.add(rcoor)
                if (game.phase !== 3) {
                    first_roads_set.add(rcoor)
                }
            }
        }
    } else {
        if (y-1 >= borders[x-1][0]) {
            rcoor = rcoor_toString(game, [coords, {x:x-1, y:y-1}]);
            if (game.board.roads[rcoor].id == null) {
                free_roads_set.add(rcoor)
                if (game.phase !== 3) {
                    first_roads_set.add(rcoor)
                }
            }
        }
        if (y+1 <= borders[x-1][1]) {
            rcoor = rcoor_toString(game, [coords, {x:x-1, y:y+1}]);
            if (game.board.roads[rcoor].id == null) {
                free_roads_set.add(rcoor)
                if (game.phase !== 3) {
                    first_roads_set.add(rcoor)
                }
            }
        }
        if (x+1 < 12) {
            rcoor = rcoor_toString(game, [coords, {x:x+1, y:y}]);
            if (game.board.roads[rcoor].id == null) {
                free_roads_set.add(rcoor)
                if (game.phase !== 3) {
                    first_roads_set.add(rcoor)
                }
            }
        }
    }
    game.players[i].free_roads  = [...free_roads_set]
    game.players[i].first_roads = [...first_roads_set]

    // Removing the blocked nodes:
    for (let p = 0; p < 4; p++) {
        let free_nodes_set = (game.players[p].free_nodes.length > 0) ? new Set(game.players[p].free_nodes) : new Set()
        // A) The selected node from each player:
        free_nodes_set.delete(ncoor)
        // B) The colindant nodes from each player:
        // Para x = par (2n). (x,y) -> (x-1,y),(x+1,y-1),(x+1,y+1):
        if (x % 2 === 0) {
            if (x-1 > 0) {
                free_nodes_set.delete(ncoor_toString({x:x-1, y:y}))
            }
            if (y-1 >= borders[x+1][0]) {
                free_nodes_set.delete(ncoor_toString({x:x+1,y:y-1}))
            }
            if (y+1 <= borders[x+1][1]) {
                free_nodes_set.delete(ncoor_toString({x:x+1,y:y+1}))
            }
        // Para x = impar (2n+1). (x,y) -> (x-1,y-1),(x-1,y+1),(x+1,y):
        } else {
            if (y-1 >= borders[x-1][0]) {
                free_nodes_set.delete(ncoor_toString({x:x-1,y:y-1}))
            }
            if (y+1 <= borders[x-1][1]) {
                free_nodes_set.delete(ncoor_toString({x:x-1,y:y+1}))
            }
            if (x+1 < 12) {
                free_nodes_set.delete(ncoor_toString({x:x+1,y:y}))
            }
        }
        game.players[p].free_nodes = [...free_nodes_set]
    }
}

/**
 * Función para comprar una carta de desarrollo. Esta función SOLO SE LLAMA cuando se sabe
 * de antemano que tiene los recursos necesarios y quedan cartas de desarrollo disponibles.
 * 
 * @param {*} game      Partida sobre la que transcurre el juego.
 * @param {*} id        Jugador que ha pedido construir.
 */
function buy_cards(game, player) {

    let i = game.players.findIndex(curr_player => curr_player.name === player)
    // Taking the needed resources for the purchase
    game.players[i].resources['Trigo']--
    game.players[i].resources['Piedra']--
    game.players[i].resources['Lana']--
    update_actions_with_cost(game)

    // Getting the first develop card of the deck
    if (game.develop_cards.length > 0) {
        let card = game.develop_cards.shift()
        // Adding the new card to the player inventory
        game.players[i].develop_cards[card]++
    } else {
        for (p of game.players) {
            p.can_buy = false
        }
    }
}

/**
 * 
 * @param {*} game 
 * @param {*} player 
 * @param {*} resource 
 */
function change_resource(game, player, resource) {  //resource -> recurso que quiero ||resource2 -> recurso por el que cambio
    
    let i   = game.players.findIndex(curr_player => curr_player.name === player)
    let r_i = biomesResources.findIndex(curr_resource => curr_resource === resource[0])
    
    // En el frontend solo deben dar opciones de cambio si tiene 4 o mas del recurso que cambia
    game.players[i].resources[resource[0]] -= game.players[i].trade_costs[r_i]        
    game.players[i].resources[resource[1]]++
    update_actions_with_cost(game)
}

/**
 * Funcion para cambiar de turno.
 */
function next_turn(game, player) {
    // console.log("PHASE: ", game.phase, ", CURRENT TURN: ", game.current_turn)
    if (player === game.players[game.current_turn].name) {
        //Primera ronda, solo de construccion
        if (game.phase === 1) {
            if (game.current_turn !== game.players.length-1) {
                game.current_turn++
            } else {
                console.log("=========================== DE FASE 1 a FASE 2 ===========================")
                // Change to the second phase (in this phase doesn't ocurr anything)
                game.phase = 2
            }
        //Segunda ronda, solo contruccion. Recibe recursos por la contruccion de este ultimo poblado
        } else if (game.phase === 2) {
            if (game.current_turn !== 0) {
                game.current_turn--
            } else {
                console.log("=========================== DE FASE 2 a FASE 3 ===========================")
                // Cleaning free nodes:
                game.players.forEach((player) => {
                    player.free_nodes = new Set()
                })
                // Gathering resources of the last built village
                for (let p of game.players) {
                    let last_built = p.villages[p.villages.length-1]
                    game.board.nodes[last_built].biomes.forEach((biome) => {
                        p.resources[game.board.biomes[biome].resource]++
                    })
                }
                // Change to the third phase
                game.phase = 3
            }
        } else {
            if (win_check(game, player)) {
                game.phase  = 4
                game.winner = game.players[game.current_turn].name
            } else {
                game.current_turn = (game.current_turn+1)%(game.players.length)
            }
        }
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
function roll_the_dices(game, player) {

    game.dices_res = [random(1,6), random(1,6)]
    let res = game.dices_res[0] + game.dices_res[1]
    if (res !== 7) {
        for (let p of game.players) {
            for (let v of p.villages) {
                game.board.nodes[v].biomes.forEach((biome) => {
                    if (game.board.biomes[biome].token.value === res && game.board.robber_biome !== biome) {
                        p.resources[game.board.biomes[biome].resource]++
                    }
                })
            }
            for (let c of p.cities) {
                game.board.nodes[c].biomes.forEach((biome) => {
                    if (game.board.biomes[biome].token.value === res && game.board.robber_biome !== biome) {
                        p.resources[game.board.biomes[biome].resource] += 2
                    }
                })
            }
        }
    } else {
        console.log("Ha salido 7")
        let i = game.players.findIndex(curr_player => curr_player.name === player)
        game.players[i].force_knight = true

        for (let p of game.players) {
            let total_resources = Object.values(p.resources).reduce((total, num) => {
                return total + num
            },0)
            if (total_resources > 7) {
                for (let i = 0; i < total_resources/2; i++) {
                    let kill_resource = biomesResources[random(0, 5)]
                    while (p.resources[kill_resource] === 0) {
                        kill_resource = biomesResources[random(0, 5)]
                    }
                    p.resources[kill_resource]--
                    console.log(p.name, ':', p.resources)
                }
            }
        }
    }
    update_actions_with_cost(game)
}

/**
 * Funcion que actualiza la posibilidad de los jugadores de construir segun los
 * recursos que tengan
 * 
 * @param {*} game 
 */
function update_actions_with_cost(game) {
    for (let p of game.players) {

        // Village
        if (p.buildings['Villages'] > 0 && p.resources['Trigo'] > 0 && p.resources['Madera'] > 0 && p.resources['Ladrillo'] > 0 && p.resources['Lana']) {
            p.can_build[0] = true
        } else {
            p.can_build[0] = false
        }
        // City
        if (p.buildings['Cities'] > 0 && p.villages.length > 0 && p.resources['Trigo'] > 1 && p.resources['Piedra'] > 2) {
            p.can_build[1] = true
        } else {
            p.can_build[1] = false
        }
        // Road
        if (p.buildings['Roads'] > 0 && p.resources['Madera'] > 0 && p.resources['Ladrillo'] > 0) {
            p.can_build[2] = true
        } else {
            p.can_build[2] = false
        }
        // Buy cards
        if (p.resources['Trigo'] > 0 && p.resources['Piedra'] > 0 && p.resources['Lana'] > 0 && game.develop_cards.length > 0) {
            p.can_buy = true
        } else {
            p.can_buy = false
        }

        // Trade costs
        for (let i = 0; i < biomesResources.length-1; i++) {
            if (p.resources[biomesResources[i]] >= p.trade_costs[i]) {
                p.can_change[i] = true
            } else {
                p.can_change[i] = false
            }
        }
    }
}

/**
 * Funcion que usa el caballero y actualiza las materias primas de los jugadores.
 * 
 * @param {*} game 
 * @param {*} player 
 * @param {*} robber_biome 
 */
function use_knight(game, player, robber_biome) {

    let i = game.players.findIndex(curr_player => curr_player.name === player)

    // Updating the knight
    if (!game.players[i].force_knight) {
        game.players[i].develop_cards['Caballeros']--
        game.players[i].used_knights++
    } else {
        game.players[i].force_knight = false
    }
    // Updating the robber
    game.board.robber_biome = robber_biome

    Object.values(game.board.nodes).forEach((node) => {
        let biomes_set = new Set(node.biomes)
        if (biomes_set.has(robber_biome) && (node.building != null && node.building.player != player)) {
            let victim = game.players.findIndex(curr_player => curr_player.name === node.building.player)
            let total_resources   = Object.values(game.players[victim].resources).reduce((total, num) => {
                return total + num;
            }, 0)
            if (total_resources > 0) {
                let selected_resource = Math.floor(Math.random() * total_resources)
                if (node.building.type === 'Village') {
                    if (game.players[victim].resources['Trigo'] > 0 && selected_resource < game.players[victim].resources['Trigo']) {
                        game.players[i].resources['Trigo']++
                        game.players[victim].resources['Trigo']--
                    } else if (game.players[victim].resources['Madera'] > 0 && selected_resource < (game.players[victim].resources['Trigo'] + game.players[victim].resources['Madera'])) {
                        game.players[i].resources['Madera']++
                        game.players[victim].resources['Madera']--
                    } else if (game.players[victim].resources['Ladrillo'] > 0 && selected_resource < (game.players[victim].resources['Trigo'] + game.players[victim].resources['Madera'] + game.players[victim].resources['Ladrillo'])) {
                        game.players[i].resources['Ladrillo']++
                        game.players[victim].resources['Ladrillo']--
                    } else if (game.players[victim].resources['Piedra'] > 0 && selected_resource < (game.players[victim].resources['Trigo'] + game.players[victim].resources['Madera'] + game.players[victim].resources['Ladrillo'] + game.players[victim].resources['Piedra'])) {
                        game.players[i].resources['Piedra']++
                        game.players[victim].resources['Piedra']--
                    } else if (game.players[victim].resources['Lana'] > 0) {
                        game.players[i].resources['Lana']++
                        game.players[victim].resources['Lana']--
                    }
                } else if (node.building.type === 'City') {
                    if (game.players[victim].resources['Trigo'] > 1 && selected_resource < game.players[victim].resources['Trigo']) {
                        game.players[i].resources['Trigo'] += 2
                        game.players[victim].resources['Trigo'] -= 2
                    } else if (game.players[victim].resources['Madera'] > 1 && selected_resource < (game.players[victim].resources['Trigo'] + game.players[victim].resources['Madera'])) {
                        game.players[i].resources['Madera'] += 2
                        game.players[victim].resources['Madera'] -= 2
                    } else if (game.players[victim].resources['Ladrillo'] > 1 && selected_resource < (game.players[victim].resources['Trigo'] + game.players[victim].resources['Madera'] + game.players[victim].resources['Ladrillo'])) {
                        game.players[i].resources['Ladrillo'] += 2
                        game.players[victim].resources['Ladrillo'] -= 2
                    } else if (game.players[victim].resources['Piedra'] > 1 && selected_resource < (game.players[victim].resources['Trigo'] + game.players[victim].resources['Madera'] + game.players[victim].resources['Ladrillo'] + game.players[victim].resources['Piedra'])) {
                        game.players[i].resources['Piedra'] += 2
                        game.players[victim].resources['Piedra'] -= 2
                    } else if (game.players[victim].resources['Lana'] > 1) {
                        game.players[i].resources['Lana'] += 2
                        game.players[victim].resources['Lana'] -= 2
                    }
                }
            }


        }
    })
    update_actions_with_cost(game)
}

/**
 * 
 * @param {*} game 
 * @param {*} player 
 * @param {*} resource 
 */
function use_monopoly(game, player, resource) {
    let i = game.players.findIndex(curr_player => curr_player.name === player)
    game.players[i].develop_cards['Monopolios']--

    // Se quitan los recursos del recurso seleccionado a todos los jugadores
    let total_resource = 0
    for (let p of game.players) {
        total_resource += p.resources[resource]
        p.resources[resource] = 0
    }
    // Se le asigna todos los recursos al jugador que ha jugado el monopolio 
    game.players[i].resources[resource] = total_resource  
    update_actions_with_cost(game)
}

/**
 * 
 * @param {*} game 
 * @param {*} player 
 */
function use_roads_build_4_free(game, player) {
    let i = game.players.findIndex(curr_player => curr_player.name === player)
    game.players[i].roads_build_4_free++
    if (game.players[i].roads_build_4_free === 1) {
        game.players[i].develop_cards['Carreteras']--
    } else if (game.players[i].roads_build_4_free === 2) {
        game.players[i].roads_build_4_free = 0
    }
}

/**
 * 
 * @param {*} game 
 * @param {*} player 
 * @param {*} resources 
 */
function use_year_of_plenty(game, player, resources) {
    let i = game.players.findIndex(curr_player => curr_player.name === player)
    game.players[i].develop_cards.Descubrimientos--
    game.players[i].resources[resources[0]]++
    game.players[i].resources[resources[1]]++
    update_actions_with_cost(game)
}


// Win functions:
function knights_points(game, player){
    let index = game.players.findIndex(curr_player => curr_player.name === player)
    if(game.players[index].used_knights > game.board.max_knights){
        game.board.max_knights = game.players[index].used_knights
        game.board.player_max_knights = player.name
    }
}

function roads_points(game, player) {
    let index = game.players.findIndex(curr_player => curr_player.name === player)
    console.log('game.players[index].roads: ',game.players[index].roads.length)
    if(game.players[index].roads.length > game.board.max_roads){
        game.board.max_roads =game.players[index].roads.length
        game.board.player_max_roads = player.name
    }
}

/**
 * 
 * @param {*} game 
 * @param {*} player 
 * @returns 
 */
function win_check(game, player){
    let index = game.players.findIndex(curr_player => curr_player.name === player)
    let puntos = 0
    for (let i = 0; i < 5; i++) { 
        puntos += game.players[index].develop_cards[puntosNames[i]]
    }
    puntos = game.players[index].villages.length + 2*(game.players[index].cities.length)
    knights_points(game,player)
    if (player.name==game.board.player_max_knights) {
        puntos += 2
    }
    roads_points(game,player)
    if (player.name==game.board.player_max_roads) {
        puntos += 2
    }
    return puntos >= 10
}

module.exports = {
    create_game,
    build_city,
    build_road,
    build_village,
    buy_cards,
    change_resource,
    next_turn,
    roll_the_dices,
    use_knight,
    use_monopoly,
    use_roads_build_4_free,
    use_year_of_plenty,
}