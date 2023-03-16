//=============================================================================
// FUNCIONES AUXILIARES 
//=============================================================================
function random(min, max) {
    return Math.floor(Math.random() * max) + min;
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
// 2. Bosque/Leña               4
// 3. Colinas/Ladrillos         3
// 4. Montañas/Mineral-Roca     3
// 5. Pasto/Lana                4
// 6. Desierto                  1
const biome_terraform    = [4, 4, 3, 3, 4, 1]
const biome_token_starts = [0, 2 ,4 ,6 ,8 ,10]
// Fichas numericas ------- A  B  C  D  E  F   G  H   I   J  K  L   M  N  O  P  Q  R
const biome_token_values = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11];
const borders = [[3,7],[2,8],[2,8],[1,9],[1,9],[0,10],[0,10],[1,9],[1,9],[2,8],[2,8],[3,7]];
//const Biome_name        = { 0:"Tierra de cultivo", 1:"Bosque", 2:"Colinas", 3:"Montañas", 4:"Pasto", 5:"Desierto" }

function create_board() {
    // Generar hexagonos:
    let terraform    = biome_terraform
    let tokens_start = biome_token_starts[random(0, biome_token_starts.length)]
    let biomes       = []
    for (let i = 0; i < 19; i++) {
        do {
            var type = random(0, 6)
        } while (terraform[type] == 0)
        terraform[type]--
        biomes.push({
            // Tipo del bioma.
            biome_type: type,  
            // Numero del bioma: 1-12. Si es desierto, no tiene (0).
            biome_token: (type != 5 ? biome_token_values[(i+tokens_start)%19] : 0) 
        })
    }

    // Generar nodos:
    let nodes = {
        03 : { x:0,  y:3,  figure: null, biomes:[biomes[0]]},
        05 : { x:0,  y:5,  figure: null, biomes:[biomes[1]]},
        07 : { x:0,  y:7,  figure: null, biomes:[biomes[2]]},
        12 : { x:1,  y:2,  figure: null, biomes:[biomes[0]]},
        14 : { x:1,  y:4,  figure: null, biomes:[biomes[0],biomes[1]]},
        16 : { x:1,  y:6,  figure: null, biomes:[biomes[1],biomes[2]]},
        18 : { x:1,  y:8,  figure: null, biomes:[biomes[2]]},
        22 : { x:2,  y:2,  figure: null, biomes:[biomes[0],biomes[11]]},
        24 : { x:2,  y:4,  figure: null, biomes:[biomes[0],biomes[1],biomes[12]]},
        26 : { x:2,  y:6,  figure: null, biomes:[biomes[1],biomes[2],biomes[13]]},
        28 : { x:2,  y:8,  figure: null, biomes:[biomes[2],biomes[3]]},
        31 : { x:3,  y:1,  figure: null, biomes:[biomes[11]]},
        33 : { x:3,  y:3,  figure: null, biomes:[biomes[0],biomes[11],biomes[12]]},
        35 : { x:3,  y:5,  figure: null, biomes:[biomes[1],biomes[12],biomes[13]]},
        37 : { x:3,  y:7,  figure: null, biomes:[biomes[2],biomes[13],biomes[3]]},
        39 : { x:3,  y:9,  figure: null, biomes:[biomes[3]]},
        41 : { x:4,  y:1,  figure: null, biomes:[biomes[11],biomes[10]]},
        43 : { x:4,  y:3,  figure: null, biomes:[biomes[11],biomes[12],biomes[17]]},
        45 : { x:4,  y:5,  figure: null, biomes:[biomes[12],biomes[13],biomes[18]]},
        47 : { x:4,  y:7,  figure: null, biomes:[biomes[13],biomes[3],biomes[14]]},
        49 : { x:4,  y:9,  figure: null, biomes:[biomes[3],biomes[4]]},
        50 : { x:5,  y:0,  figure: null, biomes:[biomes[10]]},
        52 : { x:5,  y:2,  figure: null, biomes:[biomes[11],biomes[10],biomes[17]]},
        54 : { x:5,  y:4,  figure: null, biomes:[biomes[12],biomes[17],biomes[18]]},
        56 : { x:5,  y:6,  figure: null, biomes:[biomes[13],biomes[18],biomes[14]]},
        58 : { x:5,  y:8,  figure: null, biomes:[biomes[3],biomes[14],biomes[4]]},
        510: { x:5,  y:10, figure: null, biomes:[biomes[4]]},
        60 : { x:6,  y:0,  figure: null, biomes:[biomes[10]]},
        62 : { x:6,  y:2,  figure: null, biomes:[biomes[10],biomes[17],biomes[9]]},
        64 : { x:6,  y:4,  figure: null, biomes:[biomes[17],biomes[18],biomes[16]]},
        66 : { x:6,  y:6,  figure: null, biomes:[biomes[18],biomes[14],biomes[15]]},
        68 : { x:6,  y:8,  figure: null, biomes:[biomes[14],biomes[4],biomes[5]]},
        610: { x:6,  y:10, figure: null, biomes:[biomes[4]]},
        71 : { x:7,  y:1,  figure: null, biomes:[biomes[10],biomes[9]]},
        73 : { x:7,  y:3,  figure: null, biomes:[biomes[17],biomes[9],biomes[16]]},
        75 : { x:7,  y:5,  figure: null, biomes:[biomes[18],biomes[16],biomes[15]]},
        77 : { x:7,  y:7,  figure: null, biomes:[biomes[14],biomes[15],biomes[5]]},
        79 : { x:7,  y:9,  figure: null, biomes:[biomes[4],biomes[5]]},
        81 : { x:8,  y:1,  figure: null, biomes:[biomes[9]]},
        83 : { x:8,  y:3,  figure: null, biomes:[biomes[9],biomes[16],biomes[8]]},
        85 : { x:8,  y:6,  figure: null, biomes:[biomes[16],biomes[15],biomes[7]]},
        87 : { x:8,  y:7,  figure: null, biomes:[biomes[15],biomes[5],biomes[6]]},
        89 : { x:8,  y:9,  figure: null, biomes:[biomes[5]]},
        92 : { x:9,  y:2,  figure: null, biomes:[biomes[9],biomes[8]]},
        94 : { x:9,  y:4,  figure: null, biomes:[biomes[16],biomes[8],biomes[7]]},
        96 : { x:9,  y:6,  figure: null, biomes:[biomes[15],biomes[7],biomes[6]]},
        98 : { x:9,  y:8,  figure: null, biomes:[biomes[5],biomes[6]]},
        102: { x:10, y:2,  figure: null, biomes:[biomes[8]]},
        104: { x:10, y:4,  figure: null, biomes:[biomes[8],biomes[7]]},
        106: { x:10, y:6,  figure: null, biomes:[biomes[7],biomes[6]]},
        108: { x:10, y:8,  figure: null, biomes:[biomes[6]]},
        113: { x:11, y:3,  figure: null, biomes:[biomes[8]]},
        115: { x:11, y:5,  figure: null, biomes:[biomes[7]]},
        117: { x:11, y:7,  figure: null, biomes:[biomes[6]]},
    }

    // Generar aristas:
    //  - Para x = par (2n). (x,y) -> (x-1,y),(x+1,y-1),(x+1,y+1)
    //  - Para x = impar (2n+1). (x,y) -> (x-1,y-1),(x-1,y+1),(x+1,y)
    let edges = {}
    for (var ncoor in nodes) {
        n = nodes[ncoor];
        if (n.x % 2 == 0) {
            if (n.x-1 > 0) {
                let m = (n.x-1).toString() + (n.y).toString();
                if (!(ncoor+m in nodes) && !(m+ncoor in nodes)) {
                    edges[ncoor+m] = { id: null }
                }
            }
            if (n.y-1 >= borders[n.x+1][0]) {
                let m = (n.x+1).toString() + (n.y-1).toString();
                if (!(ncoor+m in nodes) && !(m+ncoor in nodes)) {
                    edges[ncoor+m] = { id: null }
                }
            }
            if (n.y+1 <= borders[n.x+1][1]) {
                let m = (n.x+1).toString() + (n.y+1).toString();
                if (!(ncoor+m in nodes) && !(m+ncoor in nodes)) {
                    edges[ncoor+m] = { id: null }
                }
            }
        } else {
            if (n.y-1 >= borders[n.x-1][0]) {
                let m = (n.x-1).toString() + (n.y-1).toString();
                if (!(ncoor+m in nodes) && !(m+ncoor in nodes)) {
                    edges[ncoor+m] = { id: null }
                } 
            }
            if (n.y+1 <= borders[n.x-1][1]) {
                let m = (n.x-1).toString() + (n.y+1).toString();
                if (!(ncoor+m in nodes) && !(m+ncoor in nodes)) {
                    edges[ncoor+m] = { id: null }
                }
            }
            if (n.x+1 < 12) {
                let m = (n.x+1).toString() + (n.y).toString();
                if (!(ncoor+m in nodes) && !(m+ncoor in nodes)) {
                    edges[ncoor+m] = { id: null }
                }
            }
        }
    }
    return {
        biomes: biomes,
        thief_biome: -1,
        nodes:  nodes,
        roads:  edges,
        figures: []
    }
}

function roll_dices() {
    return random(1, 6) + random(1, 6)
}



//  - Para x = par (2n). (x,y) -> (x-1,y),(x+1,y-1),(x+1,y+1)
//  - Para x = impar (2n+1). (x,y) -> (x-1,y-1),(x-1,y+1),(x+1,y)
/*
Jugador {
    id:
    order:
    deck:
    free_nodes:
    free_edges:
    villages:
    cities:
    roads: 
}
*/


function coor_to_string(x,y) {
    return x.toString() + y.toString()
}

// Figuras: (0) Pueblo, (1) Ciudad, (2) Carretera
function build_village(game, id, coords) {
    let index = game.players.findIndex(player => player.id === id);
    let x = coords.x, y = coords.y
    let coord_0 = coor_to_string(x, y), coord_1 = "", coord_2 = "", coord_3 = "";

    game.players[index].villages.push[coord_0];
    if (x % 2 == 0) {
        coord_1 = coor_to_string(x-1,y)
        coord_2 = coor_to_string(x+1,y-1)
        coord_3 = coor_to_string(x+1,y+1)
    } else {
        coord_1 = coor_to_string(x-1,y-1)
        coord_2 = coor_to_string(x-1,y+1)
        coord_3 = coor_to_string(x+1,y)   
    }
    for (let player in game.players) {
        player.free_nodes.filter(free_coord => 
            free_coord !== coord_0 ||
            free_coord !== coord_1 || 
            free_coord !== coord_2 ||
            free_coord !== coord_3
        )
    }
    game.board.nodes[coord_0] = { id: id, type: 0}
}

function build_city(game, id, coords) {
    let index = game.players.findIndex(player => player.id === id);
    let x = coords.x, y = coords.y
    let coord_0 = coor_to_string(x, y)
    game.players[index].villages.filter(free_cord => free_cord !== coord_0)
    game.players[index].cities.push(coord_0)
    game.board.nodes[coord_0].figure.type = 1
}

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


