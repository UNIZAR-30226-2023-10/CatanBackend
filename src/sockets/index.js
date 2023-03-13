const io = require("socket.io");

const Socket = 
{
    start(server){
        io(server)
    }
}
module.exports = Socket