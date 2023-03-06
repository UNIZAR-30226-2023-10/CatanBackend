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

class bioma {
    constructor(tipo, ficha) {
        this.tipo = tipo;   // Tipo del bioma. 0:Bosque, 1:Cultivo, 2:Campo, 3:Montaña, 4:Terreno, 5:Desierto.
        this.ficha = ficha; // Numero del bioma: 1-12. Si es desierto, no tiene (0).
    }
};

class nodo {
    constructor(/*coords,*/biomas) {
        //this.coords = coords; // Coordenadas del nodo.
        this.biomas = biomas; // Biomas colindantes al nodo.
        this.figura = null;   // Figura que hay construida si hay.   
    }
};

class camino {
    constructor(extremos) {
        this.extremos = extremos; // Nodos entre los que esta la arista.
        this.tiene_carretera = 0; // Carretera construida. 0:No, 1:Si.
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

function generar_tablero() {
    let desierto = false;
    let biomas = [];
    for (let i = 0; i < 19; i++) {
        let tipo = bioma(randInt(0,7))
        if (tipo == 5) {
            desierto = true;
            biomas.push(bioma(tipo, 0));
        } else {
            biomas.push(bioma(tipo, randInt(0,0)));
        }
    }
    if (desierto == false) {
        biomas[randInt(0,19)] = bioma(tipo, 0);
    }
    var nodos = {
        00: nodo([biomas[0]]),
        01: nodo([biomas[1]]), 
        02: nodo([biomas[2]]),
        10: nodo([biomas[0]]),
        11: nodo([biomas[0], biomas[1]]),
        12: nodo([biomas[1], biomas[2]]),
        13: nodo([biomas[2]]),
        20: nodo([biomas[0], biomas[3]]),
        21: nodo([biomas[0], biomas[1], biomas[4]]),
        22: nodo([biomas[1], biomas[2], biomas[5]]),
        23: nodo([biomas[2], biomas[6]]),
        30: nodo([biomas[3]]),
        31: nodo([biomas[0], biomas[3], biomas[4]]),
        32: nodo([biomas[1], biomas[4], biomas[5]]),
        33: nodo([biomas[2], biomas[5], biomas[6]]),
        34: nodo([biomas[6]]),
        40: nodo([biomas[3], biomas[7]]),
        41:
        42:
        43:
        44:
        50:
        51:
        52:
        53:
        54:
        55:
        60:
        61:
        62:
        63:
        64:
        65: 
        70:
        71:
        72:
        73:
        74:  
        80:
        81:
        82:
        83:
        84:
        90:
        91:
        92:
        93:
        100:
        101:
        102:
        103:
        110:
        111:
        112:
    }
    





    const nodos   = {
        00: nodo([0,0])
    }
    const tablero = {

    };
    
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
