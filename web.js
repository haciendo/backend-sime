var Vortex = require('vortexjs');
var Vx = Vortex.Vx;

var server_vortex = new Vortex.ServerVortex();

var _ = require("./underscore-min");
var mongodb = require('mongodb');
var uri = 'mongodb://admin:haciendo@ds033599.mongolab.com:33599/sime-backend';

mongodb.MongoClient.connect(uri, function(err, db) {  
  	if(err) throw err;
	var col_usuarios = db.collection('usuarios');
	var col_piezas = db.collection('tipoPiezas');
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
		col_usuarios.find({id:login_msg.clavePublica}).toArray(function(err, usuarios){
			if(usuarios.length>0){
				var usuario = usuarios[0];
				Vx.send({
					tipoDeMensaje: "Vortex.respuesta",
                    responseTo: login_msg.idRequest,
					usuarioValido: true,
					idUsuario: usuario._id,
					instrumentos: []
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
		tipoDeMensaje: 'buscarTipoPiezas'
	}, function(busq_piezas){
		col_piezas.find({}).toArray(function(err, piezas){
			piezas = _.map(piezas, function(pieza){ 
				pieza["idTipoPieza"] = pieza["_id"];
        		delete pieza["_id"];
				return pieza;
			});
			Vx.send({
				tipoDeMensaje: "Vortex.respuesta",
				responseTo: busq_piezas.idRequest,
				tipoPiezas: piezas
			});
		});
	});
	
	
	Vx.when({ 
		tipoDeMensaje: 'buscarCotas'
	}, function(busq_cotas){
		col_cotas.find({idTipoPieza:busq_cotas.idTipoPieza}).toArray(function(err, cotas){
			cotas = _.map(cotas, function(cota){ 
				cota["idCota"] = cota["_id"];
				delete cota["_id"];
				return cota;
			});
			Vx.send({
				tipoDeMensaje: "Vortex.respuesta",
                responseTo: busq_cotas.idRequest,
				cotas: cotas
			});
		});
	});
});

