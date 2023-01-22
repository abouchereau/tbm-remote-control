const server = require('websocket').server;
const http   = require('http');
const SOCKET_PORT = 3615;

const socket = new server({httpServer: http.createServer().listen(SOCKET_PORT, ()=>{})});

const clients = [];

socket.on('error', (err) => console.error("Error: " + err.message));
socket.on('request', (request) => {
    let connection = request.accept(null, request.origin);
    connection.on('message', msg => {

        //nouvel utilisateur
        if (msg.utf8Data.indexOf("N") === 0) {
            let name = msg.utf8Data.substr(1,16);
            const date = new Date();
            console.log(date.toUTCString(),"New Challenger :", name);
            clients.push({"name":name, "connection":connection, "time":Date.now()});
            connection.send("OK");
            sendAllUsers();
        }
        if (msg.utf8Data.indexOf("S")===0) {
            clients.map(a=>a.connection.send(msg.utf8Data));
        }
    });
});

setInterval(()=>{
    let timeKill = Date.now() - 1000*60*10;//10 minutes
    let killingInTheNameOf = "";
    if (clients.length>0) {
        for (let i = clients.length - 1; i >= 0; i--) {
            if (clients[i] != null && clients[i].time < timeKill) {
                clients[i].connection.send("TIMEOUT");
                clients[i].connection.terminate();
                clients.splice(i);
                killingInTheNameOf = clients.name;
            }
        }
    }
    if (killingInTheNameOf != "") {
        sendAllUsers();
        console.log(date.toUTCString(),"Game Over :", killingInTheNameOf);
    }
},10000);

function sendAllUsers() {
    let str = "U"+(clients.map(a=>a.name).join("|"));
    clients.map(a=>a.connection.send(str));
}