# Proyecto Software 2022-23. Universidad de Zaragoza
## Proyecto Catán. Backend
Para iniciar el sistema:
1. Descargar el repositorio.
2. Moverse a la carpeta raíz del repositorio e instalar las dependencias.
```shell
npm install
```
3. Iniciar el servidor:
```shell
npm start
```

## Funcionamiento de las conexiones:
1. Rutas:
    - /register

    - /login -> Responde token

    - /game/create -> argumento num jugadores

    - /game/join -> argumento idPartida

    - /game/start -> argumento idPartida

2. El modulo de juego devolverá lo que tenga que devolver dependiendo de la situación pero **SOLO MODIFICARÁ EXCLUSIVAMENTE LAS ESTRUCTURAS DE JUEGO QUE RECIBA. NO ACTUARÁ NI CON LOS SOCKETS NI CON LA CONEXIÓN**. Significa que ni mandará notificaciones ni dirá al modulo de backend como mandar ni que datos debe usar para la comunicación, **SOLO DEVOLVERÁ LOS DATOS DEL JUEGO**.

3. Otros:
    - conn - [socketIO]
    - jugador -[Jugador]
    - llamada a CrearPartida(incluye primera tirada)
    - back envia notify(comienzo)
    - back -> guarda cambios, envia partidaActualizada a todos y envia las notificaciones
    - juagador envia -> acccion, idPartida
    - back -> coge Partida de la BD y se envia al moduloDeJuego(accion, partida, jugador)

    - notify { juagador1 : [String], jugador2: [String], jugador3: [String] }
    - back -> guarda cambios, envia partidaActualizada a todos y envia las  - notificaciones
    - send(evento, argumentos)
    - lisener(evento, callback(argumentos))