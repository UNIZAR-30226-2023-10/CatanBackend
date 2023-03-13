//=============================================================================
// FUNCIONES AUXILIARES 
//=============================================================================
function randInt(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generar_id() {
    var symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var id = '';
    for (var i = 0; i < 8; i++) {
        id += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }
    return id; 
}

//=============================================================================
// JUGADOR 
//=============================================================================
class Player {
    constructor(id) { 
        this.id    = id;
        this.order = -1;   // Su turno para jugar (1->4).
        this.deck  = null; // Baraja del jugador:
                              //  - [0]: Total de madera.
                              //  - [1]: Total de trigo.
                              //  - [2]: Total de oveja.
                              //  - [3]: Total de roca.
                              //  - [4]: Total de barro.
                              //  - [5]: Total de caballeros.
                              //  - [6]: Caballeros usados.
        // !!! No se como van a entrar, de momento las dejamos fuera !!!
        // figuras: null,     // Figuras que tiene.
        //cartas_de_desarrollo {
        //    var orden = []; //caballero -> 1, carreteras -> 2, inventario -> 3, monopolio -> 4, punto -> 5
        //    usadas: x       //total de cartas ya compradas
        //},
    }
}

var players = [];
function add_player() {
    if (players.length < 4) {
        let id = generar_id();
        players.push(new Player(id));
        let list = document.getElementById('tabla-jugadores').getElementsByTagName('tbody')[0];
        let row  = list.insertRow();
        let cell = row.insertCell(0);
        cell.innerHTML = id;
    }
}

//=============================================================================
// TABLERO 
//=============================================================================
// Biomas repartidos:
// 1. Tierra de cultivo/Grano   4
// 2. Bosque/Leña               4
// 3. Colinas/Ladrillos         3
// 4. Montañas/Mineral-Roca     3
// 5. Pasto/Lana                4
// 6. Desierto                  1
const Biome_terraform = [4, 4, 3, 3, 4, 1];
const Biome_name   = { 0:"Tierra de cultivo", 1:"Bosque", 2:"Colinas", 3:"Montañas", 4:"Pasto", 5:"Desierto" }
const Biome_id     = { Farmland:0, Forest:1, Hill:2, Mountain:3, Pasture:4, Desert:5}
const Biome_image = ['farmland.png','forest.png','hill.png','mountain.png','pasture.png','desert.png'];

// Inicio para la colocación de las fichas númericas.
const Tokens_start_pos = { 0:0, 1:2, 2:4, 3:6, 4:8, 5:10 }
// Fichas numericas para 
// los dados:          A  B  C  D  E  F   G  H   I   J  K  L   M  N  O  P  Q  R
const Number_tokens = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11];

const Borders = [[3,7],[2,8],[2,8],[1,9],[1,9],[0,10],[0,10],[1,9],[1,9],[2,8],[2,8],[3,7]];
//const YCoorBorders = [];

class Figure {
    constructor(id, type) {
        this.id = id;     // Id del jugador al que pertenece.
        this.tipo = type; // Tipo de figura. 0:Pueblo, 1:Ciudad.
    }
}

class Biome {
    constructor(type) {
        this.type   = type; // Tipo del bioma. 0:Bosque, 1:Cultivo, 2:Campo, 3:Montaña, 4:Terreno, 5:Desierto.
        this.number = 0;    // Numero del bioma: 1-12. Si es desierto, no tiene (0).
    }
};

class Node {
    constructor(x, y, biomes) {
        this.x      = x;      // Coordenada x del nodo.
        this.y      = y;      // Coordenada y del nodo.
        this.biomes = biomes; // Biomas colindantes al nodo.
        this.figure = null;   // Figura que hay construida si hay.   
    }
};

class Path {
    constructor(points) {
        this.points   = points; // Nodos entre los que esta la arista.
        this.has_road = 0;      // Carretera construida. 0:No, 1:Si.
    }
};

class Board {
    constructor(biomes, nodes, paths) {
        this.biomes = biomes;    // Hexagonos (biomas) del tablero.
        this.thief_biome = null; // Bioma en el que esta el ladron.
        this.nodes = nodes;      // Vertices (nodos) del tablero.
        this.paths = paths;      // Aristas (caminos) del tablero.
        this.figures = [];       // Coordenadas de las figuras construidas.
    }
};

var the_board;
function generate_board() {

    // Generar biomas:
    let terraform = Biome_terraform;
    let biomes    = [];
    for (let i = 0; i < 19; i++) {
        do {
            var type = randInt(0,6);
        } while (terraform[type] == 0);
        terraform[type]--;
        biomes.push(new Biome(type));
    }

    // Generar fichas númericas:
    let tokens_start = Tokens_start_pos[randInt(0,6)];
    //console.log("INICIO DE LOS TOKENS. BIOMA: ", tokens_start);
    for (let i = 0; i < 18; i++) {
        let j = (i+tokens_start)%19;
        if (biomes[j].type == Biome_id.Desert) {
            j = (i+(++tokens_start))%19;
        }
        //console.log("i: ",i,"j: ",j);
        biomes[j].number = Number_tokens[i]
    }

    // Generar nodos:
    var nodes = {
        03 : new Node(0,3,[biomes[0]]),
        05 : new Node(0,5,[biomes[1]]),
        07 : new Node(0,7,[biomes[2]]),
        12 : new Node(1,2,[biomes[0]]),
        14 : new Node(1,4,[biomes[0],biomes[1]]),
        16 : new Node(1,6,[biomes[1],biomes[2]]),
        18 : new Node(1,8,[biomes[2]]),
        22 : new Node(2,2,[biomes[0],biomes[11]]),
        24 : new Node(2,4,[biomes[0],biomes[1],biomes[12]]),
        26 : new Node(2,6,[biomes[1],biomes[2],biomes[13]]),
        28 : new Node(2,8,[biomes[2],biomes[3]]),
        31 : new Node(3,1,[biomes[11]]),
        33 : new Node(3,3,[biomes[0],biomes[11],biomes[12]]),
        35 : new Node(3,5,[biomes[1],biomes[12],biomes[13]]),
        37 : new Node(3,7,[biomes[2],biomes[13],biomes[3]]),
        39 : new Node(3,9,[biomes[3]]),
        41 : new Node(4,1,[biomes[11],biomes[10]]),
        43 : new Node(4,3,[biomes[11],biomes[12],biomes[17]]),
        45 : new Node(4,5,[biomes[12],biomes[13],biomes[18]]),
        47 : new Node(4,7,[biomes[13],biomes[3],biomes[14]]),
        49 : new Node(4,9,[biomes[3],biomes[4]]),
        50 : new Node(5,0,[biomes[10]]),
        52 : new Node(5,2,[biomes[11],biomes[10],biomes[17]]),
        54 : new Node(5,4,[biomes[12],biomes[17],biomes[18]]),
        56 : new Node(5,6,[biomes[13],biomes[18],biomes[14]]),
        58 : new Node(5,8,[biomes[3],biomes[14],biomes[4]]),
        510: new Node(5,10,[biomes[4]]),
        60 : new Node(6,0,[biomes[10]]),
        62 : new Node(6,2,[biomes[10],biomes[17],biomes[9]]),
        64 : new Node(6,4,[biomes[17],biomes[18],biomes[16]]),
        66 : new Node(6,6,[biomes[18],biomes[14],biomes[15]]),
        68 : new Node(6,8,[biomes[14],biomes[4],biomes[5]]),
        610: new Node(6,10,[biomes[4]]),
        71 : new Node(7,1,[biomes[10],biomes[9]]),
        73 : new Node(7,3,[biomes[17],biomes[9],biomes[16]]),
        75 : new Node(7,5,[biomes[18],biomes[16],biomes[15]]),
        77 : new Node(7,7,[biomes[14],biomes[15],biomes[5]]),
        79 : new Node(7,9,[biomes[4],biomes[5]]),
        81 : new Node(8,1,[biomes[9]]),
        83 : new Node(8,3,[biomes[9],biomes[16],biomes[8]]),
        85 : new Node(8,6,[biomes[16],biomes[15],biomes[7]]),
        87 : new Node(8,7,[biomes[15],biomes[5],biomes[6]]),
        89 : new Node(8,9,[biomes[5]]),
        92 : new Node(9,2,[biomes[9],biomes[8]]),
        94 : new Node(9,4,[biomes[16],biomes[8],biomes[7]]),
        96 : new Node(9,6,[biomes[15],biomes[7],biomes[6]]),
        98 : new Node(9,8,[biomes[5],biomes[6]]),
        102: new Node(10,2,[biomes[8]]),
        104: new Node(10,4,[biomes[8],biomes[7]]),
        106: new Node(10,6,[biomes[7],biomes[6]]),
        108: new Node(10,8,[biomes[6]]),
        113: new Node(11,3,[biomes[8]]),
        115: new Node(11,5,[biomes[7]]),
        117: new Node(11,7,[biomes[6]])
    }

    // Para x = par (2n). (x,y) -> (x-1,y),(x+1,y-1),(x+1,y+1)
    // Para x = impar (2n+1). (x,y) -> (x-1,y-1),(x-1,y+1),(x+1,y)
    var paths = {};
    for (var ncoor in nodes) {
        n = nodes[ncoor];
        if (n.x % 2 == 0) {
            if (n.x-1 > 0) {
                let m = (n.x-1).toString() + (n.y).toString();
                if (!(ncoor+m in nodes) && !(m+ncoor in nodes)) {
                    paths[ncoor+m] = new Path([n,nodes[m]]);
                }
            }
            if (n.y-1 >= Borders[n.x+1][0]) {
                let m = (n.x+1).toString() + (n.y-1).toString();
                if (!(ncoor+m in nodes) && !(m+ncoor in nodes)) {
                    paths[ncoor+m] = new Path([n,nodes[m]]);
                }
            }
            if (n.y+1 <= Borders[n.x+1][1]) {
                let m = (n.x+1).toString() + (n.y+1).toString();
                if (!(ncoor+m in nodes) && !(m+ncoor in nodes)) {
                    paths[ncoor+m] = new Path([n,nodes[m]]);
                }
            }
        } else {
            if (n.y-1 >= Borders[n.x-1][0]) {
                let m = (n.x-1).toString() + (n.y-1).toString();
                if (!(ncoor+m in nodes) && !(m+ncoor in nodes)) {
                    paths[ncoor+m] = new Path([n,nodes[m]]);
                } 
            }
            if (n.y+1 <= Borders[n.x-1][1]) {
                let m = (n.x-1).toString() + (n.y+1).toString();
                if (!(ncoor+m in nodes) && !(m+ncoor in nodes)) {
                    paths[ncoor+m] = new Path([n,nodes[m]]);
                }
            }
            if (n.x+1 < 12) {
                let m = (n.x+1).toString() + (n.y).toString();
                if (!(ncoor+m in nodes) && !(m+ncoor in nodes)) {
                    paths[ncoor+m] = new Path([n,nodes[m]]);
                }
            }
        }
    }

    // RAEL: comprueba que el mapa se genera correctamente:
    //for (let i = 0; i < 19; i++) {
    //    console.log("Bioma ", i, ": ", Biome_name[biomes[i].type], ", numerito: ", biomes[i].number)
    //}
    //for (let p in paths) {
    //    console.log("Path: ", p, paths[p]);
    //}

    the_board = new Board(biomes, nodes, paths);
};

function comprobar_construccion(x, y) {
    if (x % 2 == 0) {
        if (x-1 > 0) {
            let m = (x-1).toString() + (y).toString();
            if (the_board.nodes[m].figure != null) {
                return false;
            }
        }
        if (y-1 >= Borders[x+1][0]) {
            let m = (x+1).toString() + (y-1).toString();
            if (the_board.nodes[m].figure != null) {
                return false;
            }
        }
        if (y+1 <= Borders[x+1][1]) {
            let m = (x+1).toString() + (y+1).toString();
            if (the_board.nodes[m].figure != null) {
                return false;
            }
        }
    } else {
        if (y-1 >= Borders[x-1][0]) {
            let m = (x-1).toString() + (y-1).toString();
            if (the_board.nodes[m].figure != null) {
                return false;
            }
        }
        if (y+1 <= Borders[x-1][1]) {
            let m = (x-1).toString() + (y+1).toString();
            if (the_board.nodes[m].figure != null) {
                return false;
            }
        }
        if (x+1 < 12) {
            let m = (x+1).toString() + (y).toString();
            if (the_board.nodes[m].figure != null) {
                return false;
            }
        }
    }
    return true;
}

const hex_id = [[0,1,2],[11,12,13,3],[10,17,18,14,4],[9,16,15,5],[8,7,6]];
function generar_tablero() {
    const container = document.getElementById('map-container');
    container.innerHTML = '';
    const cols = [3,4,5,4,3];
    for (let hexs in cols) {
        let new_div = document.createElement('div');
        new_div.classList.add('map-row');
        for (let i = 0; i < cols[hexs]; i++) {
            let hex_div = document.createElement('div');
            hex_div.classList.add('hexagon');
            new_div.appendChild(hex_div);
            let type = the_board.biomes[hex_id[hexs][i]].type;
            hex_div.style.backgroundImage = `url('${Biome_image[type]}')`;
            if (hexs === '4') {
                hex_div.style.marginBottom = '150px';
            }
            if (type != 5) {
                hex_div.innerHTML = the_board.biomes[hex_id[hexs][i]].number;
            }
        }
        container.appendChild(new_div);
    }
}

//=============================================================================
// PARTIDA 
//=============================================================================
class partida {
    constructor(anfitrion, turno, jugadores, tablero) {
        // General
        this.anfitrion = anfitrion; // Id del usuario que es anfitrion.
        this.turno     = turno;     // Turno actual (1->4).
        this.jugadores = jugadores; // Jugadores de la partida.
        this.tablero   = tablero;   // Tablero.
    }
}

function roll_dices() {
    let fst = randInt(1,6); let snd = randInt(1,6);
    // Esto es para el test, no sirve de nada:
    document.getElementById('primer-dado').value = fst;
    document.getElementById('segundo-dado').value = snd;
    return fst + snd;
    // return randInt(1,6) + randInt(1,6);
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

// 2. Poner poblados y carreteras:
var current_turn = 0;
function first_turn() {
    document.getElementById("cur_turn").value = players[current_turn].id;

}

function build_figure(coords, type) {

}
//  Orden descendente
//  Orden ascendente

// 3. Recibir materias de los poblados puestos en orden ascendente.
