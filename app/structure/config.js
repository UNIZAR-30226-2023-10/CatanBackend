//=============================================================================
// FUNCIONES AUXILIARES 
//=============================================================================
function randInt(min, max) {
    return Math.floor(Math.random() * max) + min;
}

//=============================================================================
// JUGADOR 
//=============================================================================
class jugador {
    constructor(id, orden, baraja) {
        this.id     = id;    // Id del usuario.  
        this.orden  = orden; // Su turno para jugar (1->4).
        this.baraja = baraja; // Baraja del jugador:
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

//=============================================================================
// TABLERO 
//=============================================================================
class figura {
    constructor(id, tipo) {
        this.id = id;     // Id del jugador al que pertenece.
        this.tipo = tipo; // Tipo de figura. 0:Pueblo, 1:Ciudad.
    }
}

class Biome {
    constructor(type) {
        this.type   = type; // Tipo del bioma. 0:Bosque, 1:Cultivo, 2:Campo, 3:Montaña, 4:Terreno, 5:Desierto.
        this.number = 0;    // Numero del bioma: 1-12. Si es desierto, no tiene (0).
    }
};

class Node {
    constructor(x, y, biomas) {
        this.x      = x;      // Coordenadas del nodo.
        this.y      = y;
        this.biomas = biomas; // Biomas colindantes al nodo.
        this.figura = null;   // Figura que hay construida si hay.   
    }
};

class Path {
    constructor(points) {
        this.points   = points; // Nodos entre los que esta la arista.
        this.has_road = 0;      // Carretera construida. 0:No, 1:Si.
    }
};

class tablero {
    constructor(biomas, nodos, caminos) {
        this.biomas = biomas;   // Hexagonos (biomas) del tablero.
        this.bioma_ladron = -1; // Bioma en el que esta el ladron.
        this.nodos = nodos;     // Vertices (nodos) del tablero.
        this.caminos = caminos; // Aristas (caminos) del tablero.
        this.figuras = [];      // Coordenadas de las figuras construidas.
    }
};

// Biomas repartidos:
// 1. Tierra de cultivo/Grano   4
// 2. Bosque/Leña               4
// 3. Colinas/Ladrillos         3
// 4. Montañas/Mineral-Roca     3
// 5. Pasto/Lana                4
// 6. Desierto                  1
const Biome_terraform = [4, 4, 3, 3, 4, 1];
const Biome_name = { 0:"Tierra de cultivo", 1:"Bosque", 2:"Colinas", 3:"Montañas", 4:"Pasto", 5:"Desierto" }
const Biome_id   = { Farmland:0, Forest:1, Hill:2, Mountain:3, Pasture:4, Desert:5}

// Inicio para la colocación de las fichas númericas.
const Tokens_start_pos = { 0:0, 1:2, 2:4, 3:6, 4:8, 5:10 }
// Fichas numericas para 
// los dados:          A  B  C  D  E  F   G  H   I   J  K  L   M  N  O  P  Q  R
const Number_tokens = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11];

const Coords_limits = [2,3,3,4,4,5,5,4,4,3,3,2];

// Pido perdon por tremenda monstruosidad pero no se me ocurre una manera
// algoritmica de generar el tablero, es una fumada la generacion de mapas
// hexagonales.
function generar_tablero() {

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
    console.log("INICIO DE LOS TOKENS. BIOMA: ", tokens_start);
    for (let i = 0; i < 18; i++) {
        let j = (i+tokens_start)%19;
        if (biomes[j].type == Biome_id.Desert) {
            j = (i+(++tokens_start))%19;
        }
        //console.log("i: ",i,"j: ",j);
        biomes[j].number = Number_tokens[i]
    }

    // Para comprobar:
    for (let i = 0; i < 19; i++) {
        console.log("Bioma ", i, ": ", Biome_name[biomes[i].type], ", numerito: ", biomes[i].number)
    }

    // Generar nodos: NO SIRVE.
    var nodes = {
        00: new Node(0,0,[biomes[0]]),
        01: new Node(0,1,[biomes[1]]), 
        02: new Node(0,2,[biomes[2]]),
        10: new Node(1,0,[biomes[0]]),
        11: new Node(1,1,[biomes[0], biomes[1]]),
        12: new Node(1,2,[biomes[1], biomes[2]]),
        13: new Node(1,3,[biomes[2]]),
        20: new Node(2,0,[biomes[0], biomes[11]]),
        21: new Node(2,1,[biomes[0], biomes[1], biomes[12]]),
        22: new Node(2,2,[biomes[1], biomes[2], biomes[13]]),
        23: new Node(2,3,[biomes[2], biomes[3]]),
        30: new Node(3,0,[biomes[11]]),
        31: new Node(3,1,[biomes[0], biomes[11], biomes[12]]),
        32: new Node(3,2,[biomes[1], biomes[12], biomes[13]]),
        33: new Node(3,3,[biomes[2], biomes[13], biomes[3]]),
        34: new Node(3,4,[biomes[3]]),
        40: new Node(4,0,[biomes[11], biomes[10]]),
        41: new Node(4,1,[biomes[11], biomes[12], biomes[18]]),
        42: new Node(4,2,[biomes[12], biomes[13], biomes[19]]),
        43: new Node(4,3,[biomes[13], biomes[3], biomes[14]]),
        44: new Node(4,4,[biomes[3], biomes[4]]),
        50: new Node(5,0,[biomes[10]]),
        51: new Node(5,1,[biomes[11], biomes[10], biomes[18]]),
        52: new Node(5,2,[biomes[12], biomes[18], biomes[19]]),
        53: new Node(5,3,[biomes[13], biomes[19], biomes[14]]),
        54: new Node(5,4,[biomes[3], biomes[14], biomes[4]]),
        55: new Node(5,5,[biomes[4]]),
        60: new Node(6,0,[biomes[10]]),
        61: new Node(6,1,[biomes[10], biomes[18], biomes[9]]),
        62: new Node(6,2,[biomes[18], biomes[19], biomes[16]]),
        63: new Node(6,3,[biomes[19], biomes[14], biomes[15]]),
        64: new Node(6,4,[biomes[14], biomes[4], biomes[5]]),
        65: new Node(6,5,[biomes[4]]),
        70: new Node(7,0,[biomes[10], biomes[9]]),
        71: new Node(7,1,[biomes[18], biomes[9], biomes[16]]),
        72: new Node(7,2,[biomes[19], biomes[16], biomes[15]]),
        73: new Node(7,3,[biomes[14], biomes[15], biomes[5]]),
        74: new Node(7,4,[biomes[4], biomes[5]]),
        80: new Node(8,0,[biomes[9]]),
        81: new Node(8,1,[biomes[9], biomes[16], biomes[8]]),
        82: new Node(8,2,[biomes[16], biomes[15], biomes[7]]),
        83: new Node(8,3,[biomes[15], biomes[5], biomes[6]]),
        84: new Node(8,4,[biomes[5]]),
        90: new Node(9,0,[biomes[9], biomes[8]]),
        91: new Node(9,1,[biomes[16], biomes[8], biomes[7]]),
        92: new Node(9,2,[biomes[15], biomes[7], biomes[6]]),
        93: new Node(9,3,[biomes[5], biomes[6]]),
        100: new Node(10,0,[biomes[8]]),
        101: new Node(10,1,[biomes[8], biomes[7]]),
        102: new Node(10,2,[biomes[7], biomes[6]]),
        103: new Node(10,3,[biomes[6]]),
        110: new Node(11,0,[biomes[8]]),
        111: new Node(11,1,[biomes[7]]),
        112: new Node(11,2,[biomes[6]])
    };

    var paths = {}
    // Para x par: sea (x,y) comprobar (x-1,y), (x+1,y), (x+1,y+1).
    // Para x impar: sea (x,y) comprobar (x-1,y-1), (x-1,y), (x+1,y). 
    for (let key in nodes) {
        let key_x, key_y, x = nodes[key].x, y = nodes[key].y;
        if (x%2 == 0) {
            if (x-1 >= 0) {
                key_x = (x-1).toString();
                key_y = y.toString();
                if (!((key_x+key_y) in paths)) {
                    paths[path_key] = new Path([nodes[key_x], nodes[key_y]]);
                }
            }

        } else {

        }
    }

    /*
    var nodos = {};
    for (let i = 0; i <= 11; i++) {
        for (let j = 0; j <= 12; j++) {
            var coords = i.toString() + j.toString();
            var biomeList = [];
            if (i == 0) {
                biomeList.push(biomes[0]);
            } else if (i == 11) {
                biomeList.push(biomes[8]);
            } else {
                if (j == 0) {
                    biomeList.push(biomes[i]);
                } else if (j == 12) {
                    biomeList.push(biomes[i+5]);
                } else {
                    biomeList.push(biomes[i]);
                    biomeList.push(biomes[i+1]);
                }
            }
            nodos[coords] = new Node(biomeList);
        }
    }*/
    for (var key in nodos) {
        if (nodos.hasOwnProperty(key)) {
            var nodo = nodos[key];
            console.log(key, nodo);
        }
    }
    return tablero;
};


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
