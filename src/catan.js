//=============================================================================
// FUNCIONES AUXILIARES 
//=============================================================================

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

function coor_to_string(x,y) {
    return x.toString() + "," + y.toString()
}

//=============================================================================
// PARTIDA 
//=============================================================================
// Una partida tiene:
// - Codigo.
// - Turno actual de partida.
// - Lista de jugadores.
// - Tablero.
// - Si esta comenzada o no.
/*
class partida {
    constructor(anfitrion, turno, jugadores, tablero) {
        // General
        this.code      = 
        this.anfitrion = anfitrion; // Id del usuario que es anfitrion.
        this.turno     = turno;     // Turno actual (1->4).
        this.jugadores = jugadores; // Jugadores de la partida.
        this.tablero   = tablero;   // Tablero.
    }
}
*/

// == BOARD
// Terraformación de biomas:
// 1. Tierra de cultivo/Trigo   4
// 2. Bosque/Madera             4
// 3. Colinas/Ladrillo          3
// 4. Montañas/Piedra           3
// 5. Pasto/Lana                4
// 6. Desierto                  1
const biome_terraform    = [4, 4, 3, 3, 4, 1]
const biome_names        = ['Cultivo','Bosque','Colina','Montaña','Pasto','Desierto']
const biome_resources    = ['Trigo','Madera','Ladrillo','Piedra','Lana']
const biome_token_starts = [0, 2, 4, 6, 8, 10]
// Fichas numericas ------- A  B  C  D  E  F   G  H   I   J  K  L   M  N  O  P  Q  R
const biome_token_values = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11];
const borders = [[3,7],[2,8],[2,8],[1,9],[1,9],[0,10],[0,10],[1,9],[1,9],[2,8],[2,8],[3,7]];
const growth_cards = {
    'Caballeros':14,
    'Carreteras': 2,
    'Monopolio': 2,
    'Descubrimiento': 2,
    'Punto': 5
}

function create_board() {
    // Generar hexagonos:
    let terraform    = biome_terraform
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
                type: 'Desierto',
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
                mcoor = coor_to_string(x-1, y)
                if (!(ncoor+":"+mcoor in edges) && !(mcoor+":"+ncoor in edges)) {
                    edges[ncoor+":"+mcoor] = { id: null }
                }
            }
            if (y-1 >= borders[x+1][0]) {
                mcoor = coor_to_string(x+1,y-1)
                if (!(ncoor+":"+mcoor in edges) && !(mcoor+":"+ncoor in edges)) {
                    edges[ncoor+":"+mcoor] = { id: null }
                }
            }
            if (y+1 <= borders[x+1][1]) {
                mcoor = coor_to_string(x+1,y+1)
                if (!(ncoor+":"+mcoor in edges) && !(mcoor+":"+ncoor in edges)) {
                    edges[ncoor+":"+mcoor] = { id: null }
                }
            }
        // Para x = impar (2n+1). (x,y) -> (x-1,y-1),(x-1,y+1),(x+1,y):
        } else {
            if (y-1 >= borders[x-1][0]) {
                mcoor = coor_to_string(x-1,y-1)
                if (!(ncoor+":"+mcoor in edges) && !(mcoor+":"+ncoor in edges)) {
                    edges[ncoor+":"+mcoor] = { id: null }
                }
            }
            if (y+1 <= borders[x-1][1]) {
                mcoor = coor_to_string(x-1,y+1)
                if (!(ncoor+":"+mcoor in edges) && !(mcoor+":"+ncoor in edges)) {
                    edges[ncoor+":"+mcoor] = { id: null }
                }
            }
            if (x+1 < 12) {
                mcoor = coor_to_string(x+1, y)
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
        buildings: new Set()
    }
}

/*
    Juego:
        jugadores: [],
        tablero: null,
        turno_actual:  
*/
/*
    Tablero {
        biomes: biomes,
        thief_biome: -1,
        nodes:  nodes,
        roads:  edges,
        figures: []
    }
*/
/*
    Jugador {
        id:
        order:
        deck:
        free_nodes:
        free_edges:
        villages: Trigo=1, Madera=1, Ladrillo=1, Lana=1
        cities:   Trigo=2, Piedra=2, Poblado=1
        roads:
        resources: [0]Trigo, [1]Madera, [2]Ladrillo, [4]Piedra, [5]Lana 
    }
*/


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
// ---
ids   = ["Jkilo90o", "XXXZ89xx", "45TRej23", "5ty62sw1"]
/*
board = create_board()
//console.log(board)
game = {
    players: (() => {
        players = []
        for (let i = 0; i < 4; i++) {
            players.push({ 
                id: ids[i],
                order: i+1,
                free_nodes: new Set(Object.keys(board.nodes)),
                free_roads: new Set(),
                villages: new Set(),
                cities: new Set(),
                roads: new Set(),
                resources : { Trigo:0, Madera:0, Ladrillo:0, Piedra:0, Lana:0 },
                growth_cards: {
                    Caballero: 30,
                    Caballeros_usados: 0
                },
            })
        }
        return players
    })(),
    board: board,
    current_turn: 0,
    phase: 0
}
*/
//console.log(game)


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

/**
 * Función auxiliar. Calcula el número de cartas totales del jugador.
 * 
 * @param {*} player    Estructura jugador recibida.
 * @returns 
 */
function poblar_desarrollos(game) {

    for (let resource of Object.values(player.resources)) {
        total += resource
    }
    return total
}


function get_resources(game) {
    if (game.phase === 2) {

    } else {
        for (let i = 0; i < 4; i++){
            for (let building of game.players[i].villages) {
                game.board.nodes[building].biomes.forEach((biome) => {
                    if (biome.token === res) {
                        game.players[i].resources[game.board.biomes[biome].resource]++
                    }
                });
            }
            for (let building of game.players[i].cities) {
                game.board.nodes[building].biomes.forEach((biome) => {
                    if (biome.token === res) {
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
    let res = dices()
    if (res !== 7) {
        get_resources(game)
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
}


function road_coords(game, ncoor, mcoor) {
    let rcoor = ncoor + ":" + mcoor
    if (rcoor in game.board.roads) {
        return rcoor
    } else {
        return mcoor + ":" + ncoor
    }
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
    let x = coords.x, y = coords.y, ncoor = coor_to_string(x,y), rcoor = ''

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
            rcoor = road_coords(game, ncoor, coor_to_string(x-1, y))
            if (game.board.roads[rcoor].id == null) {
                game.players[index].free_roads.add(rcoor)
            }
        }
        if (y-1 >= borders[x+1][0]) {
            rcoor = road_coords(game, ncoor, coor_to_string(x+1,y-1))
            if (game.board.roads[rcoor].id == null) {
                game.players[index].free_roads.add(rcoor)
            }
        }
        if (y+1 <= borders[x+1][1]) {
            rcoor = road_coords(game, ncoor, coor_to_string(x+1,y+1))
            console.log(rcoor)
            if (game.board.roads[rcoor].id == null) {
                game.players[index].free_roads.add(rcoor)
            }
        }
    // Para x = impar (2n+1). (x,y) -> (x-1,y-1),(x-1,y+1),(x+1,y):
    } else {
        if (y-1 >= borders[x-1][0]) {
            rcoor = road_coords(game, ncoor, coor_to_string(x-1,y-1))
            console.log(rcoor)
            if (game.board.roads[rcoor].id == null) {
                game.players[index].free_roads.add(rcoor)
            }
        }
        if (y+1 <= borders[x-1][1]) {
            rcoor = road_coords(game, ncoor, coor_to_string(x-1,y+1))
            if (game.board.roads[rcoor].id == null) {
                game.players[index].free_roads.add(rcoor)
            }
        }
        if (x+1 < 12) {
            rcoor = road_coords(game, ncoor, coor_to_string(x+1, y))
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
                game.players[i].free_nodes.delete(coor_to_string(x-1, y))
            }
            if (y-1 >= borders[x+1][0]) {
                game.players[i].free_nodes.delete(coor_to_string(x+1,y-1))
            }
            if (y+1 <= borders[x+1][1]) {
                game.players[i].free_nodes.delete(coor_to_string(x+1,y+1))
            }
        // Para x = impar (2n+1). (x,y) -> (x-1,y-1),(x-1,y+1),(x+1,y):
        } else {
            if (y-1 >= borders[x-1][0]) {
                game.players[i].free_nodes.delete(coor_to_string(x-1,y-1))
            }
            if (y+1 <= borders[x-1][1]) {
                game.players[i].free_nodes.delete(coor_to_string(x-1,y+1))
            }
            if (x+1 < 12) {
                game.players[i].free_nodes.delete(coor_to_string(x+1, y))
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
    let ncoor = coor_to_string(coords.x,coords.y)

    game.board.nodes[ncoor].building.type = 'City'
    game.players[index].cities.add(ncoor)
    // COSTO: Poblado=1, Trigo=2, Piedra=2
    if (game.phase === 3) {
        game.players[index].villages.delete(ncoor)
        game.players[index].resources['Trigo']  -= 2
        game.players[index].resources['Piedra'] -= 3
    }

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
    let rcoor = coor_to_string(coords[0].x, coords[0].y) + ":" + coor_to_string(coords[0].x, coords[0].y);

    game.board.roads[rcoor].id = id
    game.players[index].roads.add(rcoor)
    // COSTO: Madera=1, Ladrillo=1
    game.players[index].resources['Madera']--
    game.players[index].resources['Ladrillo']--
    for (let i = 0; i < 4; i++) {
        game.players[i].free_roads.delete(rcoor)
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
    let card = growth_cards.shift();   //Sacamos la primera carta del vector
    game.players[index].resources['Grano']--
    game.players[index].resources['Piedra']--
    game.players[index].resources['Lana']--
    if(card == 'Caballero'){
        game.players[index].growth_cards.Caballeros;
    }else if(card == 'Descubrimiento'){
        game.players[index].growth_cards.Descubrimientos;
    }else if(card == 'Carreteras'){
        game.players[index].growth_cards.Cartas_Carreteras;
    }else if(card == 'Monopolio'){
        game.players[index].growth_cards.Monopolios;
    }else if(card == 'Punto'){
        game.players[index].growth_cards.Puntos++;
    }
}

function barajar_desarrollos(game) {
    let randomNumber = 0;
    let numCards = 25;
    for(let i = 0; i < 25; i++){
        randomNumber = Math.floor(Math.random() * numCards);
        numCards--;
        if(randomNumber < cartasDesarrollo_num[0]){//Coloca caballero
            cartasDesarrollo_num[0]--;
            cartas_desarrollo.push(cartasDesarrollo[0]);
        }else if(randomNumber < (cartasDesarrollo_num[0]+ cartasDesarrollo_num[1])){//Coloca Carreteras
            cartasDesarrollo_num[1]--;
            cartas_desarrollo.push(cartasDesarrollo[1]);
        }else if(randomNumber < (cartasDesarrollo_num[0]+ cartasDesarrollo_num[1]+cartasDesarrollo_num[2])){//Coloca Monopolio
            cartasDesarrollo_num[2]--;
            cartas_desarrollo.push(cartasDesarrollo[2]);
        }else if(randomNumber < (cartasDesarrollo_num[0]+ cartasDesarrollo_num[1]+cartasDesarrollo_num[2]+cartasDesarrollo_num[3])){//Coloca Descubrimiento
            cartasDesarrollo_num[3]--;
            cartas_desarrollo.push(cartasDesarrollo[3]);
        }else { //Coloca Punto
            cartasDesarrollo_num[4]--;
            cartas_desarrollo.push(cartasDesarrollo[4]);
        }
    }
}



function usar_monopolio(game, id, materia) {
    let index = game.players.findIndex(player => player.id === id)
    game.players[index].growth_cards.Monopolios--
    let res = 0;
    for(let i = 0; i < game.players.length; i++){
        res += game.players[i].resources[materia]
        game.players[i].resources[materia]=0
    }
    game.players[index].resources[materia]=res
}

function usar_descubrimiento(game, id, materia1, materia2) {
    let index = game.players.findIndex(player => player.id === id)
    game.players[index].growth_cards.Descubrimientos--
    game.players[index].resources[materia1]++
    game.players[index].resources[materia2]++
}

function usar_caballero(game, id, hexagono, idJugadorRobar) {
    let index = game.players.findIndex(player => player.id === id)
    game.players[index].growth_cards.Caballeros--
    game.players[index].growth_cards.Caballeros_usados++
    game.board.thief_biome=hexagono
    let index2 = game.players.findIndex(player => player.id === idJugadorRobar)

    let randomNumber = Math.floor(Math.random() * total_resources(idJugadorRobar));

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
    }else { //Coloca Punto
        game.players[index2].resources['Lana']--;
        game.players[index].resources['Lana']++;
    }
}

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function next_turn(game) {
    if (game.phase === 0) {
        if (game.current_turn !== game.players.length-1) {
            game.current_turn++
        } else {
            game.phase = 1
        }
    } else if (game.phase === 1) {
        if (game.current_turn !== 0) {
            game.current_turn--
        } else {
            game.phase = 2
            game.players.forEach((player) => {
                player.free_nodes = new Set()
            })
            get_resources(game)
        }
    } else {
        game.current_turn = (game.current_turn+1)%(game.players.length)
    }
}

// ============================================================================
// SIMULACION
// ============================================================================
function create_game(code) {
    return {
        players: [],
        board: null, // No es necesario un tablero nada más crear la partida.
        code: code, // Hay que discutir muchas cosas sobre esto...
        current_turn : 0,
        phase: 0
    }
}

function create_player(id) {
    return {
        id: id,
        free_nodes: new Set(),
        free_roads: new Set(),
        villages: new Set(),
        cities: new Set(),
        roads: new Set(),
        resources: null,
        growth_cards: null,
        // TODO: Yo sacaria este valor fuera de growth_cards
        // Ya esta sacado.
        used_knights: 0,
    }
}

function start_game(game) {
    game.board = create_board()
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
            Carretera: 0,
            Descubrimiento: 0,
            Monopolio: 0,
            Punto: 0
        }
    }
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
                    console.log(order_selection_rolls)
                    order_selection(game, order_selection_rolls)
                    console.log('<Ordered players>', game.players)
                    round_simulation(game)
                })
            })
        })
    })
}

function round_simulation(game) {
    console.log("=================== SIMULACION DE UNA RONDA ===================")
    console.log(`Turn ${game.current_turn}`)
    console.log(`Player #${game.players[game.current_turn].id}`)
    if (game.phase === 1) {
        build_simulation(game)
    }
}

function build_simulation(game) {
    rl.question('(0) Pueblo, (1) Ciudad, (2) Carretera: ', (option) => {
        if (option === "0") {
            rl.question('Coordenada en x: ', (x) => {
                rl.question('Coordenada en y: ', (y) => {
                    build_village(game, game.players[game.current_turn].id, {x:parseInt(x),y:parseInt(y)})
                    round_simulation(game)
                })
            })
        } else if (option === "1") {
            rl.question('Coordenada en x: ', (x) => {
                rl.question('Coordenada en y: ', (y) => {
                    build_city(game, game.players[game.current_turn].id, {x:parseInt(x),y:parseInt(y)})
                    round_simulation(game)
                })
            })
        } else if (option === "2") {
            rl.question('Coordenada en x del primer nodo: ', (x_1) => {
                rl.question('Coordenada en y del primer nodo: ', (y_1) => {
                    rl.question('Coordenada en x del segundo nodo: ', (x_2) => {
                        rl.question('Coordenada en y del segundo nodo: ', (y_2) => {
                            build_road(game, game.players[game.current_turn].id, 
                                [{x:parseInt(x_1),y:parseInt(y_1)},{x:parseInt(x_2),y:parseInt(y_2)}])
                            round_simulation(game)
                        })
                    })
                })
            })
        }
    })
}

game_simulation()

/*
function game_simulation() {
    console.log(`Turn ${game.current_turn}`)
    console.log(`Player #${game.players[game.current_turn].id}`)
    rl.question('(0) Pueblo, (1) Ciudad, (2) Carretera: ', (option) => {
        if (option === "0") {
            rl.question('Coordenada en x: ', (x) => {
                rl.question('Coordenada en y: ', (y) => {
                    build_village(game, game.players[game.current_turn].id, { x:parseInt(x), y:parseInt(y) }, 0)
                    next_turn(game)
                    console.log(game.players)
                    game_simulation()
                })
            })
        } else if (option === "1") {
            rl.question('Coordenada en x: ', (x) => {
                rl.question('Coordenada en y: ', (y) => {
                    build_city(game, game.players[game.current_turn].id, { x:parseInt(x), y:parseInt(y) }, 0)
                    next_turn(game)
                })
            })
        } else if (option === "2") {
            rl.question('Coordenada en x del primer nodo: ', (x_1) => {
                rl.question('Coordenada en y del primer nodo: ', (y_1) => {
                    rl.question('Coordenada en x del segundo nodo: ', (x_2) => {
                        rl.question('Coordenada en y del segundo nodo: ', (y_2) => {
                            build_road(game, game.players[game.current_turn].id, [{x:x_1,y:y_1},{x:x_2,y:y_2}], 0)
                            next_turn(game)
                        })
                    })
                })
            })
        }
    })
}
game_simulation();
*/


//console.log(board.nodes)

/*
function build_road(game, id, coords) {
    let index = game.players.findIndex(player => player.id === id);
    let coord_0 = coor_to_string(coords[0].x, coords[0].y) + coor_to_string(coords[1].x, coords[1].y)
    game.players[index].roads.push[coord_0]
    game.board.roads[coord_0].path = id
    for (let i = 0; i < game.players.length; i++) {
        game.players[i].free_edges.filter(free_coord => free_coord !== coord_0)
    }

    closed = [false, false]
    for (let i = 0; i < coords.length; i++) {
        let x = coords[i].x, y = coords[i].y;
        if (x % 2 == 0) {
            if (x-1 > 0) {
                if (game.board.nodes[coor_to_string(x-1, y)].figure != null) {
                    closed[i] = true
                    continue
                }
            }
            if (y-1 >= borders[x+1][0]) {
                if (game.board.nodes[coor_to_string(x+1,y-1)].figure != null) {
                    closed[i] = true
                    continue
                }
            }
            if (y+1 <= borders[x+1][1]) {
                if (game.board.nodes[coor_to_string(x+1,y+1)].figure != null) {
                    closed[i] = true
                    continue
                }
            }
        } else {
            if (y-1 >= borders[x-1][0]) {
                if (game.board.nodes[coor_to_string(x-1,y-1)].figure != null) {
                    closed[i] = true
                    continue
                }
            }
            if (y+1 <= borders[x-1][1]) {
                if (game.board.nodes[coor_to_string(x-1,y+1)].figure != null) {
                    closed[i] = true
                    continue
                }
            }
            if (x+1 < 12) {
                if (game.board.nodes[coor_to_string(x+1, y)].figure != null) {
                    closed[i] = true
                    continue
                }
            }
        }
    }
    if (!closed[0]) {
        players.free_nodes.push(coor_to_string(coords[0].x + coords[0].y))
    }
    if (!closed[1]) {
        players.free_nodes.push(coor_to_string(coords[1].x + coords[1].y))
    }
}

// 2. Poner poblados y carreteras:
var current_turn = 0;

//  Orden descendente
function first_turn() {
    document.getElementById("cur_turn").value = players[current_turn].id;
    const x = parseInt(playerCoords[0]);
    const y = parseInt(playerCoords[1]);

    while (!isValidNode(x, y)) {
        alert("Invalid node! Please try again.");
        x = parseInt(prompt("Enter x-coordinate:"));
        y = parseInt(prompt("Enter y-coordinate:"));
    }

    let options;//opciones de contruir carretera

    if (x % 2 === 0) {
    options = [
        { x: x + 1, y: y - 1 },
        { x: x + 1, y: y + 1 },
        { x: x, y: y + 1 }
    ];
    } else {
    options = [
        { x: x - 1, y: y - 1 },
        { x: x - 1, y: y + 1 },
        { x: x, y: y - 1 }
    ];
    }

    const selectedOption = prompt("Selecciona una de las carreteras hacia la direción: " + options.join(", "));

    current_turn++;
    if (current_turn >= players.length) {
        current_turn = players.length - 1;
        second_turn();
    }else{
        first_turn();
    }

}

//  Orden ascendente

function second_turn() {
    document.getElementById("cur_turn").value = players[current_turn].id;
    const x = parseInt(playerCoords[0]);
    const y = parseInt(playerCoords[1]);

    while (!isValidNode(x, y)) {
        alert("Invalid node! Please try again.");
        x = parseInt(prompt("Enter x-coordinate:"));
        y = parseInt(prompt("Enter y-coordinate:"));
    }
    let c = x.toString() + y.toString();
    build_figure(c, 1)//1 = poblado
    
    let options;//opciones de contruir carretera

    if (x % 2 === 0) {
    options = [
        { x: x + 1, y: y - 1 },
        { x: x + 1, y: y + 1 },
        { x: x, y: y + 1 }
    ];
    } else {
    options = [
        { x: x - 1, y: y - 1 },
        { x: x - 1, y: y + 1 },
        { x: x, y: y - 1 }
    ];
    }

    const selectedOption = prompt("Selecciona una de las carreteras hacia la direción: " + options.join(", "));
    
    bulld_road(c,selectedOption);//construye la carretera con las 2 nodos que une

    current_turn--;
    if (current_turn < 0) {
        current_turn = 0;
        normal_turn();
    }else{
        second_turn();
    }

}
*/

