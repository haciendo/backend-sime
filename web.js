var http = require("http");
var url = require("url");
var Vortex = require('vortexjs');
var express = require('express');

var NodoConectorHttpServer = Vortex.NodoConectorHttpServer;
var NodoRouter = Vortex.NodoRouter;
var NodoConectorSocket = Vortex.NodoConectorSocket;
var Vx = Vortex.Vx;

var pad = function (n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var sesiones_http = [];
var sesiones_web_socket = [];
var ultimo_id_sesion_http = 0;
var ultimo_id_sesion_ws = 0;

Vx.start({verbose:true});
var router = Vx.router; // new NodoRouter("principal");

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server, {
	'transports': ["websocket", "polling"],
//	"polling duration": 10						  
});

app.use(allowCrossDomain);

app.post('/create', function(request, response){
    var conector_http = new NodoConectorHttpServer({
        id: pad(ultimo_id_sesion_http, 4),
        verbose:true,
        app: app,
        alDesconectar: function(){
            sesiones_http.splice(sesiones_http.indexOf(conector_http), 1);
        }
    });
    ultimo_id_sesion_http+=1;
    sesiones_http.push(conector_http);
    router.conectarBidireccionalmenteCon(conector_http);     
    response.send(conector_http.idSesion);
});

io.sockets.on('connection', function (socket) {
    var conector_socket = new NodoConectorSocket({
        id: ultimo_id_sesion_ws.toString(),
        socket: socket, 
        verbose: true, 
        alDesconectar:function(){
            sesiones_web_socket.splice(sesiones_web_socket.indexOf(conector_socket), 1);
        }
    });
    ultimo_id_sesion_ws+=1;
    sesiones_web_socket.push(conector_socket);
    router.conectarBidireccionalmenteCon(conector_socket);
});

//io.configure(function () { 
//    io.set("transports", ['websocket', 'flashsocket', 'xhr-polling']); 
//    io.set("polling duration", 10); 
//    io.disable('log');
//});

app.get('/infoSesiones', function(request, response){
    var info_sesiones = {
        http: sesiones_http.length,
        webSocket: sesiones_web_socket.length,
        router: router._patas.length
    };
    response.send(JSON.stringify(info_sesiones));
});

var puerto = process.env.PORT || 3000;
server.listen(puerto);


console.log('Arrancó la cosa en ' + puerto);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Acá arranca el backend de some, después lo sacamos para otro lado

Vx.when({
    tipoDeMensaje: 'medicionCruda'
}, function(medicion_cruda){
    Vx.send({
        tipoDeMensaje: 'medicionAislada',
        idInstrumento: 111,
        valorMedicion: parseFloat(medicion_cruda.valorMedicion),
        unidad:'cm'        
    });
});