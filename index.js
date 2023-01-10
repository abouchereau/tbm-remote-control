const server = require('websocket').server;
const http   = require('http');
const SOCKET_PORT = 3615;

const socket = new server({httpServer: http.createServer().listen(SOCKET_PORT, ()=>{})});

const clients = [];
let clientTBM = null;

socket.on('error', (err) => console.error("Error: " + err.message));
socket.on('request', (request) => {
    console.log("REQUEST");
    let connection = request.accept(null, request.origin);
    connection.on('message', msg => {

        console.log("MSG ", msg);
        //nouvel utilisateur
        if (msg.utf8Data.indexOf("N") === 0) {
            let name = msg.utf8Data.substr(1,16);
            console.log("CONNECTING "+name);
            clients.push({"name":name, "connection":connection, "time":Date.now()});
            connection.send("OK");
        }
        if (msg.utf8Data.indexOf("TBM") === 0) {
            clientTBM = connection;
        }
        if (clientTBM != null && msg.indexOf("S")===0) {
            clientTBM.send(msg);
        }
    });
});

setInterval(()=>{
    let timeKill = Date.now() - 1000*60*10;//10 minutes
    if (clients.length>0) {
        for (let i = clients.length - 1; i >= 0; i--) {
            if (clients[i] != null && clients[i].time < timeKill) {
                clients[i].connection.send("TIMEOUT");
                clients[i].connection.terminate();
                clients.splice(i);
            }
        }
    }
},1000);