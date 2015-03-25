var Vortex = require('vortexjs');
var Vx = Vortex.Vx;

var server_vortex = new Vortex.ServerVortex();

var mongodb = require('mongodb');
var uri = 'mongodb://admin:haciendo@ds033599.mongolab.com:33599/sime-backend';

mongodb.MongoClient.connect(uri, function(err, db) {  
  	if(err) throw err;
	var col_usuarios = db.collection('usuarios');
	var col_piezas = db.collection('piezas');
	var col_cotas = db.collection('cotas');
	
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
	
	Vx.when({ 
		tipoDeMensaje: 'usuarioLogin'
	}, function(login_msg){
		col_usuarios.find({id:login_msg.idUsuario}).toArray(function(err, usuarios){
			if(usuarios.length>0){
				Vx.send({
					tipoDeMensaje: "Vortex.respuesta",
                    responseTo: login_msg.idRequest,
					usuarioValido: true,
					usuario: usuarios[0]
				});
			} else{
				Vx.send({
					tipoDeMensaje: "Vortex.respuesta",
                    responseTo: login_msg.idRequest,
					usuarioValido: false
				});
			}
		});
	});
	
	Vx.when({ 
		tipoDeMensaje: 'buscarPiezas'
	}, function(busq_piezas){
		col_piezas.find({}).toArray(function(err, piezas){
			Vx.send({
				tipoDeMensaje: "Vortex.respuesta",
				responseTo: busq_piezas.idRequest,
				piezas: piezas
			});
		});
	});
	
	
	Vx.when({ 
		tipoDeMensaje: 'buscarCotas'
	}, function(busq_cotas){
		col_cotas.find({idPieza:busq_cotas.idPieza}).toArray(function(err, cotas){
			Vx.send({
				tipoDeMensaje: "Vortex.respuesta",
                responseTo: busq_cotas.idRequest,
				cotas: cotas
			});
		});
	});
});

