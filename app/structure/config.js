
    jugadores: {
        var IdJugadores = [];   //id de los 4 jugadores, si no juegan 4 se inicializa con -1, ordenados en orden de turno
        cartasJugador1 = [],    //11 -> 1 carta de madera
        cartasJugador2 = [],    //42 -> 4 cartas de trigo
        cartasJugador3 = [],    //Primer numero cantidad y segundo tipo -> 1 (madera), 2(trigo), 3(oveja), 4(roca) y 5(barro)
        cartasJugador4 = []     
    }

    turnode: {
               
        idJugador: x            //id del jugador del turno actual, como en jugadores tienes el orden completo solo con guardar un id tienes el resto
        
    }

    cartasDesarrollo: {
        var orden = []; //caballero -> 1, carreteras -> 2, inventario -> 3, monopolio -> 4, punto -> 5
        usadas: x       //total de cartas ya compradas
    }

    ladron: {
        posicion: x     //en que hexagono se encuentra el ladron, inicialmente estara en el desierto
    }

    tablero: {
        numeros : x                     //del 1 al 6 para saber donde empieza la colocacion de los numeros
        var biomas = []                 //1 (bioma madera), 2(bioma trigo), 3(bioma oveja), 4(bioma roca) y 5(bioma barro)
        carreterasPosibles = [],        //00  10,00 11, concatenacion de las coordenadas de los 2 vertices que comparten la carretera
        asentamientosPosibles = [],     //0 0, 0 1,0 2,...,11 2 concatenacion de las coordenas del vertice
        carreterasContruidas = [],      //jugador carreteta (cordenadas)
        asentamientosConstruidos = []   //jugador tipoAsentamiento (cordenadas)
    }





