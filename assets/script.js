const SOCKET_PORT = 3615;
let socket = null;

function toPseudo(str) {
    return str.toUpperCase().substr(0,16);
}
function addUser() {
    let name = document.getElementById("pseudo").value;
    socket = new WebSocket("ws://"+window.location.hostname+":" + SOCKET_PORT);
    socket.onerror = e=>alert("Erreur lors de la connexion au serveur socket.");
    socket.onmessage = (msg) => {
        if (msg.data=="OK") {
            document.getElementById("auth").style.display = "none";
        }
        if (msg.data=="TIMEOUT") {
            socket.close();
            window.location.reload();
        }
    };
    socket.onopen = e=> {
        socket.send("N"+name);
        sessionStorage.set("pseudo", name);
    }
}

function sample(num) {
    if (socket != null) {
        socket.send("S"+num);
    }
}

function redimButtons() {
    let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    vh = vh-90;//- le bandeau
    let boxSide = 200;
    if (vw > vh) {//paysage => 3 boutons par lignes
        boxSide = Math.min(vw/3, vh/2);
    }
    else {//portrait = 2 boutons par lignes
        boxSide = Math.min(vw/2, vh/3);
    }
    let buttonWidth = boxSide*0.6;
    let zoom = buttonWidth/240;
    document.querySelectorAll(".box > div").forEach((a)=>{
        a.style.width = Math.floor(boxSide)+"px";
        a.style.height = Math.floor(boxSide)+"px";
    });
    document.querySelectorAll(".push--skeuo").forEach((a)=>{
        a.style.transform = "scale("+(Math.round(zoom*100)/100)+")";
        a.style.left = ((Math.floor(boxSide) - (240*zoom))/2)+"px";
        a.style.top = ((Math.floor(boxSide) - (240*zoom))/2)+"px";
    });
    document.querySelectorAll(".box > div > div").forEach((a)=>{
        a.style.top = (10+(boxSide/2)+((240*zoom)/2))+"px";
    });

}



window.addEventListener('DOMContentLoaded', (e) => {
    redimButtons();
    if (sessionStorage.get('pseudo') != null) {
        document.getElementById("pseudo").value = sessionStorage.get('pseudo');
    }
});
window.addEventListener('resize', (e)=>{
    redimButtons();
})