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


function build_figure(coords, type) {//se ocuparia de crear un poblado o la ciudad
}
//Rael: Creo que podriamos modificar el nodo para que ahora dicho nodo tenga un poblado construido por un jugador



// 3. Recibir materias de los poblados puestos en orden ascendente.
