var Vortex = require('vortexjs');
var Vx = Vortex.Vx;

var server_vortex = new Vortex.ServerVortex();

var _ = require("./underscore-min");
var mongodb = require('mongodb');
//var uri = 'mongodb://127.0.0.1/Sime';
var uri = 'mongodb://admin:haciendo@ds033599.mongolab.com:33599/sime-backend';

mongodb.MongoClient.connect(uri, function(err, db) {  
  	if(err) throw err;
	var col_usuarios = db.collection('usuarios');
	var col_instrumentos = db.collection('instrumentos');
	var col_adaptadores = db.collection('adaptadores');
	var col_tipos_de_pieza = db.collection('tiposDePieza');
	var col_piezas = db.collection('piezas');
		
	Vx.when({
		tipoDeMensaje: 'medicionCruda'
	}, function(medicion_cruda){
        col_adaptadores.find({codigo: medicion_cruda.codigoAdaptador}).toArray(function(adaptadores){
            if(adaptadores.length == 0) return;
            var adaptador = adaptadores[0];
            col_instrumentos.find({idAdaptador: adaptador._id.toString()}).toArray(function(instrumentos){
                if(instrumentos.length == 0) return;
                var instrumento = instrumentos[0];
                Vx.send({
                    tipoDeMensaje: 'medicionAislada',
                    idInstrumento: instrumento._id,
                    valorMedicion: parseFloat(medicion_cruda.valorCrudo)    
                });
            });
        });		
	});
	
	Vx.when({ 
		tipoDeMensaje: 'usuarioLogin'
	}, function(login_msg, response){		
		col_usuarios.find({clavePublica:login_msg.clavePublica}).toArray(function(err, usuarios){			
			if(usuarios.length>0){
				var usuario = usuarios[0];
				col_instrumentos.find({idUsuarioOwner: usuario._id.toString()}).toArray(function(err, instrumentos){
					response.send({
						usuarioValido: true,
						apellido: usuario.apellido,
						nombre: usuario.nombre,
						nombreUsuario: usuario.nombreUsuario,
						idUsuario: usuario._id,
						instrumentos: instrumentos						
					});
				});
			} else{
				response.send({
					usuarioValido: false
				});
			}
		});
	});
	
	Vx.when({ 
		tipoDeMensaje: 'buscarTiposDePieza'
	}, function(busq_piezas, response){
		col_tipos_de_pieza.find({ descripcion: new RegExp(busq_piezas.textoBusqueda)}).toArray(function(err, tipos_de_pieza){
			tipos_de_pieza = _.map(tipos_de_pieza, function(tipo_de_pieza){ 
				tipo_de_pieza["idTipoDePieza"] = tipo_de_pieza["_id"];
        		delete tipo_de_pieza["_id"];
				return tipo_de_pieza;
			});
			response.send({
				tiposDePieza: tipos_de_pieza
			});
		});
	});
});

