var Vortex = require('vortexjs');
var Vx = Vortex.Vx;

var server_vortex = new Vortex.ServerVortex();

var _ = require("./underscore-min");
var mongodb = require('mongodb');
//var uri = 'mongodb://127.0.0.1/Sime';
var uri = 'mongodb://admin:haciendo@ds033599.mongolab.com:33599/sime-backend';

var ObjectId = mongodb.ObjectID;


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
        col_adaptadores.find({codigo: medicion_cruda.codigoAdaptador}).toArray(function(err, adaptadores){
            if(adaptadores.length == 0) return;
            var adaptador = adaptadores[0];
            col_instrumentos.find({idAdaptador: adaptador._id.toString()}).toArray(function(err, instrumentos){
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
	
	Vx.when({ 
		tipoDeMensaje: 'newPieza'
	}, function(msg, response){
		col_piezas.save({
			idTipoDePieza: msg.idTipoDePieza,
			mediciones: _.map(msg.mediciones, function(medicion){
				medicion.idUsuarioMedidor = msg.idUsuario;
				return medicion;
			})
		}, function(err){
			var resultado = "ok";
			if(err) throw resultado = "error al agregar";
			response.send({
				resultado: resultado
			});	
		});
	});
	
	Vx.when({ 
		tipoDeMensaje: 'updatePieza'
	}, function(msg, response){
		col_piezas.find({_id: new ObjectId(msg.idPieza)}).toArray(function(err, piezas){
			if(piezas.length == 0) return;
			var pieza = piezas[0];
			pieza.mediciones = _.union(pieza.mediciones, _.map(msg.mediciones, function(m){
				m.idUsuarioMedidor = msg.idUsuario;
				return m;
			}));

			col_piezas.save(pieza, function(err){
				var resultado = "ok";
				if(err) throw resultado = "error al agregar";
				response.send({
					resultado: resultado
				});	
			});
		});	
	});
	
	app.post('/incluirPostulanteAPerfilEnExpediente', function(request, response){
		var dni_postulante = request.body.dniPostulante;
		var id_perfil = request.body.idPerfil;
		var id_expediente= request.body.idExpediente;
		
		var col_perfiles = db.collection('perfiles');
		col_perfiles.find({_id: new ObjectId(id_perfil)}).toArray(function(err, perfiles){
			var perfil = perfiles[0];
			_.findWhere(perfil.postulantes, {dni:dni_postulante}).incluidoEnExpediente = id_expediente;
			col_perfiles.save(perfil, function(err){
				if(err) throw err;
				response.send("ok");	
			});
		});	
	});
	
});

