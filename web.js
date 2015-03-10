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

//Acá arranca el backend de sime, después lo sacamos para otro lado


var mongodb = require('mongodb');

// Create seed data

var seedData = [
  {
    decade: '1970s',
    artist: 'Debby Boone',
    song: 'You Light Up My Life',
    weeksAtOne: 10
  },
  {
    decade: '1980s',
    artist: 'Olivia Newton-John',
    song: 'Physical',
    weeksAtOne: 10
  },
  {
    decade: '1990s',
    artist: 'Mariah Carey',
    song: 'One Sweet Day',
    weeksAtOne: 16
  }
];

// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname

var uri = 'mongodb://user:pass@host:port/db';

mongodb.MongoClient.connect(uri, function(err, db) {
  
  if(err) throw err;
  
  /*
   * First we'll add a few songs. Nothing is required to create the 
   * songs collection; it is created automatically when we insert.
   */

  var songs = db.collection('songs');

   // Note that the insert method can take either an array or a dict.

  songs.insert(seedData, function(err, result) {
    
    if(err) throw err;

    /*
     * Then we need to give Boyz II Men credit for their contribution
     * to the hit "One Sweet Day".
     */

    songs.update(
      { song: 'One Sweet Day' }, 
      { $set: { artist: 'Mariah Carey ft. Boyz II Men' } },
      function (err, result) {
        
        if(err) throw err;

        /*
         * Finally we run a query which returns all the hits that spend 10 or
         * more weeks at number 1.
         */

        songs.find({ weeksAtOne : { $gte: 10 } }).sort({ decade: 1 }).toArray(function (err, docs) {

          if(err) throw err;

          docs.forEach(function (doc) {
            console.log(
              'In the ' + doc['decade'] + ', ' + doc['song'] + ' by ' + doc['artist'] + 
              ' topped the charts for ' + doc['weeksAtOne'] + ' straight weeks.'
            );
          });
         
          // Since this is an example, we'll clean up after ourselves.
          songs.drop(function (err) {
            if(err) throw err;
           
            // Only close the connection when your app is terminating.
            db.close(function (err) {
              if(err) throw err;
            });
          });
        });
      }
    );
  });
});



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



