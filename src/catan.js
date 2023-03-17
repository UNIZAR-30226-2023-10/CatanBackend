//=============================================================================
// FUNCIONES AUXILIARES 
//=============================================================================
const { create } = require('domain');
const { off } = require('process');

function random(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function generate_id() {
    var symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var id = '';
    for (var i = 0; i < 8; i++) {
        id += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }
    return id; 
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
// 1. Tierra de cultivo/Grano   4
// 2. Bosque/Madera               4
// 3. Colinas/Ladrillo          3
// 4. Montañas/Piedra           3
// 5. Pasto/Lana                4
// 6. Desierto                  1
const biome_terraform    = [4, 4, 3, 3, 4, 1]
const biome_names        = ['Cultivo','Bosque','Colina','Montaña','Pasto','Desierto']
const biome_resources    = ['Grano','Madera','Ladrillo','Piedra','Lana', 'Caballero']
const biome_token_starts = [0, 2 ,4 ,6 ,8 ,10]
// Fichas numericas ------- A  B  C  D  E  F   G  H   I   J  K  L   M  N  O  P  Q  R
const biome_token_values = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11];
const borders = [[3,7],[2,8],[2,8],[1,9],[1,9],[0,10],[0,10],[1,9],[1,9],[2,8],[2,8],[3,7]];

function create_board() {
    // Generar hexagonos:
    let terraform    = biome_terraform
    let tokens_start = biome_token_starts[random(0, biome_token_starts.length)]
    let biomes       = []
    let offset       = 0
    for (let i = 0; i < 19; i++) {
        let type = random(0,6)
        while (terraform[type] == 0) {
            type = random(0,6)
        }
        terraform[type]--
        if (type === 5) {
            biomes.push({
                type: biome_names[type],
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
        '0,3'  : { building: null, biomes:[biomes[0]]},
        '0,5'  : { building: null, biomes:[biomes[1]]},
        '0,7'  : { building: null, biomes:[biomes[2]]},
        '1,2'  : { building: null, biomes:[biomes[0]]},
        '1,4'  : { building: null, biomes:[biomes[0],biomes[1]]},
        '1,6'  : { building: null, biomes:[biomes[1],biomes[2]]},
        '1,8'  : { building: null, biomes:[biomes[2]]},
        '2,2'  : { building: null, biomes:[biomes[0],biomes[11]]},
        '2,4'  : { building: null, biomes:[biomes[0],biomes[1],biomes[12]]},
        '2,6'  : { building: null, biomes:[biomes[1],biomes[2],biomes[13]]},
        '2,8'  : { building: null, biomes:[biomes[2],biomes[3]]},
        '3,1'  : { building: null, biomes:[biomes[11]]},
        '3,3'  : { building: null, biomes:[biomes[0],biomes[11],biomes[12]]},
        '3,5'  : { building: null, biomes:[biomes[1],biomes[12],biomes[13]]},
        '3,7'  : { building: null, biomes:[biomes[2],biomes[13],biomes[3]]},
        '3,9'  : { building: null, biomes:[biomes[3]]},
        '4,1'  : { building: null, biomes:[biomes[11],biomes[10]]},
        '4,3'  : { building: null, biomes:[biomes[11],biomes[12],biomes[17]]},
        '4,5'  : { building: null, biomes:[biomes[12],biomes[13],biomes[18]]},
        '4,7'  : { building: null, biomes:[biomes[13],biomes[3],biomes[14]]},
        '4,9'  : { building: null, biomes:[biomes[3],biomes[4]]},
        '5,0'  : { building: null, biomes:[biomes[10]]},
        '5,2'  : { building: null, biomes:[biomes[11],biomes[10],biomes[17]]},
        '5,4'  : { building: null, biomes:[biomes[12],biomes[17],biomes[18]]},
        '5,6'  : { building: null, biomes:[biomes[13],biomes[18],biomes[14]]},
        '5,8'  : { building: null, biomes:[biomes[3],biomes[14],biomes[4]]},
        '5,10' : { building: null, biomes:[biomes[4]]},
        '6,0'  : { building: null, biomes:[biomes[10]]},
        '6,2'  : { building: null, biomes:[biomes[10],biomes[17],biomes[9]]},
        '6,4'  : { building: null, biomes:[biomes[17],biomes[18],biomes[16]]},
        '6,6'  : { building: null, biomes:[biomes[18],biomes[14],biomes[15]]},
        '6,8'  : { building: null, biomes:[biomes[14],biomes[4],biomes[5]]},
        '6,10' : { building: null, biomes:[biomes[4]]},
        '7,1'  : { building: null, biomes:[biomes[10],biomes[9]]},
        '7,3'  : { building: null, biomes:[biomes[17],biomes[9],biomes[16]]},
        '7,5'  : { building: null, biomes:[biomes[18],biomes[16],biomes[15]]},
        '7,7'  : { building: null, biomes:[biomes[14],biomes[15],biomes[5]]},
        '7,9'  : { building: null, biomes:[biomes[4],biomes[5]]},
        '8,1'  : { building: null, biomes:[biomes[9]]},
        '8,3'  : { building: null, biomes:[biomes[9],biomes[16],biomes[8]]},
        '8,5'  : { building: null, biomes:[biomes[16],biomes[15],biomes[7]]},
        '8,7'  : { building: null, biomes:[biomes[15],biomes[5],biomes[6]]},
        '8,9'  : { building: null, biomes:[biomes[5]]},
        '9,2'  : { building: null, biomes:[biomes[9],biomes[8]]},
        '9,4'  : { building: null, biomes:[biomes[16],biomes[8],biomes[7]]},
        '9,6'  : { building: null, biomes:[biomes[15],biomes[7],biomes[6]]},
        '9,8'  : { building: null, biomes:[biomes[5],biomes[6]]},
        '10,2' : { building: null, biomes:[biomes[8]]},
        '10,4' : { building: null, biomes:[biomes[8],biomes[7]]},
        '10,6' : { building: null, biomes:[biomes[7],biomes[6]]},
        '10,8' : { building: null, biomes:[biomes[6]]},
        '11,3' : { building: null, biomes:[biomes[8]]},
        '11,5' : { building: null, biomes:[biomes[7]]},
        '11,7' : { building: null, biomes:[biomes[6]]},
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
        buildings: []
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
        villages: Grano=1, Madera=1, Ladrillo=1, Lana=1
        cities:   Grano=2, Piedra=2, Poblado=1
        roads:
        resources: [0]Grano, [1]Madera, [2]Ladrillo, [4]Piedra, [5]Lana 
    }
*/

board = create_board()
ids   = ["Jkilo90o", "XXXZ89xx", "45TRej23", "5ty62sw1"]
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
                resources : { Grano: 2, Madera:2, Ladrillo:2, Piedra:2, Lana:2, Caballero: 3 }
                // cartas_desarrollo: (???)
            })
        }
        return players
    })(),
    board: board,
    current_turn: -1
}
//console.log(game)


/**
 * Función auxiliar. Calcula el número de cartas totales del jugador.
 * 
 * @param {*} player    Estructura jugador recibida.
 * @returns 
 */
function total_resources(player) {
    let total = 0
    for (let resource of Object.values(player.resources)) {
        total += resource
    }
    return total
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
function roll_dices(game, id) {
    if ((random(1, 6) + random(1, 6)) !== 7) {
        let index = game.players.findIndex(player => player.id === id)
        console.log(game.players[index].villages)
        for (let building of game.players[index].villages) {
            game.board.nodes[building].biomes.forEach(function(biome) {
                if (biome.token === res) {
                    game.players[index].resources[biome.resource]++
                }
            });
        }
        for (let building of game.players[index].cities) {
            game.board.nodes[building].biomes.forEach(function(biome) {
                if (biome.token === res) {
                    game.players[index].resources[biome.resource] += 2
                }
            })
        }
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
    let x = coords.x, y = coords.y, ncoor = coor_to_string(x,y)

    game.board.nodes[ncoor].building = { player: id, type: 'Village' }
    game.players[index].villages.add(ncoor)
    // COSTO: Grano=1, Madera=1, Ladrillo=1, Lana=1
    game.players[index].resources['Grano']--
    game.players[index].resources['Madera']--
    game.players[index].resources['Ladrillo']--
    game.players[index].resources['Lana']--
    // Adding new roads:
    if (x % 2 === 0) {
        if (x-1 > 0) {
            game.players[index].free_roads.add(ncoor + ":" + coor_to_string(x-1, y))
        }
        if (y-1 >= borders[x+1][0]) {
            game.players[index].free_roads.add(ncoor + ":" + coor_to_string(x+1,y-1))
        }
        if (y+1 <= borders[x+1][1]) {
            game.players[index].free_roads.add(ncoor + ":" + coor_to_string(x+1,y+1))
        }
    // Para x = impar (2n+1). (x,y) -> (x-1,y-1),(x-1,y+1),(x+1,y):
    } else {
        if (y-1 >= borders[x-1][0]) {
            game.players[index].free_roads.add(ncoor + ":" + coor_to_string(x-1,y-1))
        }
        if (y+1 <= borders[x-1][1]) {
            game.players[index].free_roads.add(ncoor + ":" + coor_to_string(x-1,y+1))
        }
        if (x+1 < 12) {
            game.players[index].free_roads.add(ncoor + ":" + coor_to_string(x+1, y))
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
    // COSTO: Poblado=1, Grano=2, Piedra=2 
    game.players[index].villages.delete(ncoor)
    game.players[index].resources['Grano']  -= 2
    game.players[index].resources['Piedra'] -= 2
}

/**
 * Función para construir una carretera. Esta función SOLO SE LLAMA cuando se sabe
 * de antemano que puede seguir construyendo.
 * 
 * @param {*} game      Partida sobre la que transcurre el juego.
 * @param {*} id        Jugador que ha pedido construir.
 * @param {[{x:any, y:any}, {x:any, y:any}]} coords    Coordenadas del nodo donde construir.
 */
function build_road(game, id, coords) {
    let index = game.players.findIndex(player => player.id === id)
    let rcoor = coor_to_string(coords[0].x, coords[0].y) + ":" + coor_to_string(coords[0].x, coords[0].y);

    game.board.roads[rcoor].id = id
    game.players[index].roads.add(rcoor)
    for (let i = 0; i < 4; i++) {
        game.players[i].free_roads.delete(rcoor)
    }
    
}


console.log('BEFORE BUILDING VILLAGE:')
for (let i = 0; i < 4; i++) {
    console.log(game.players[i])
}

roll_dices(game, "XXXZ89xx")
build_village(game, "XXXZ89xx", {x:0, y:3}) 
roll_dices(game, "XXXZ89xx")
//build_city(game, "XXXZ89xx", {x:0, y:3})´

console.log('AFTER BUILDING VILLAGE:')
for (let i = 0; i < 4; i++) {
    console.log(game.players[i])
}


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

// INICIO DE LA PARTIDA:
// 1. Selección de orden
var nplayer = 0;
function simulate_select_order() {
    if (players.length === 4 && nplayer < 4) {
        select_order(players[nplayer].id);
        nplayer++;
    }
}

var rolls = [0,0,0,0];
function select_order(id) {
    const player_index  = players.findIndex(player => player.id === id);
    rolls[player_index] = roll_dices();
    document.getElementById('ver_id').value = id;
    document.getElementById('ver_tirada').value = rolls[player_index];
    console.log(rolls);

    if (rolls.every(i => i != 0)) {
        console.log("Hola");
        players.sort(function(a,b) {
            let fst_roll = rolls[players.indexOf(a)];
            let snd_roll = rolls[players.indexOf(b)];
            if (fst_roll == snd_roll) {
                return randInt(1,2);
            } else {
                return snd_roll - fst_roll;
            }
        });
        rolls.sort((a, b) => b - a);
        let list = document.getElementById('orden-jugada').getElementsByTagName('tbody')[0];
        for (let i = 0; i < players.length; i++) {
            let row  = list.insertRow();
            let cell = row.insertCell(0);
            cell.innerHTML = players[i].id;
            cell = row.insertCell(1);
            cell.innerHTML = rolls[i];
        }
    }
}

//comprueba si el nodo es valido
function isValidNode(x, y) {
    var validNodes = Object.keys(nodes);
    return validNodes.includes(x.toString()+y.toString());
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


/*
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('Who are you? ', name => {
    console.log(`Hey there ${name}!`);
    readline.close();
  });
  */

