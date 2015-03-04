/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/

if(typeof(require) != "undefined"){
    var FiltroTrue = require("./FiltrosYTransformaciones").FiltroTrue;
    var FiltroFalse = require("./FiltrosYTransformaciones").FiltroFalse;
    var FiltroOR = require("./FiltrosYTransformaciones").FiltroOR;
    var FiltroAND = require("./FiltrosYTransformaciones").FiltroAND;
    var DesSerializadorDeFiltros = require("./FiltrosYTransformaciones").DesSerializadorDeFiltros;
    var ClonadorDeObjetos = require("./ClonadorDeObjetos").clase;
}

var PataConectora = function(idLocalPata, generadorDeIdMensaje, aliasNodo){
    this._generadorDeIdMensaje = generadorDeIdMensaje;
	this._idLocal = idLocalPata;
	this._idRemoto;
	this._idPedidoEnviado;
    this._filtroRecibido = new FiltroTrue();
    this._filtroEnviado = new FiltroFalse();
    this._filtroAEnviar;
    this._laPataEsBidireccional = false;    
	//arranca con un receptor que no hace nada
    this._receptor = {
        recibirMensaje: function (un_mensaje) { }
    };       
    this.publicarFiltro = this.publicarFiltro_cuandoLaPataNoEsBidi;   
    this._alias_nodo = aliasNodo;
    this.onFiltroRecibidoModificado = function(){};  
	this.ids_mensajes_enviados_unidireccionalmente = [];
};

PataConectora.prototype = {
    elMensajeEsParaEstaPata : function(un_mensaje){
        return this._idLocal == un_mensaje.idLocalAlReceptor;   
    },
    enviarMensaje : function(un_mensaje){
        var mensaje_a_enviar = ClonadorDeObjetos.clonarObjeto(un_mensaje);
		if(!(this._idRemoto===undefined)) mensaje_a_enviar.idLocalAlReceptor = this._idRemoto;
        var self = this;
		setTimeout(function(){              
			self._receptor.recibirMensaje(mensaje_a_enviar);            
		},0);		
        return mensaje_a_enviar;
	},
    enviarMensajePropio : function(un_mensaje){
		this._generadorDeIdMensaje.ponerIdAlMensaje(un_mensaje);        
		var mensaje_enviado = this.enviarMensaje(un_mensaje);
		return mensaje_enviado;
	},
    recibirPublicacionDeFiltro : function(una_publicacion){
        if(!this.elMensajeEsParaEstaPata(una_publicacion)) return;
        this._filtroRecibido = DesSerializadorDeFiltros.desSerializarFiltro(una_publicacion.filtro).simplificar();
        this.onFiltroRecibidoModificado();
    },
    enviarPedidoDeIdRemoto : function(){
		var pedido = {
			tipoDeMensaje : "Vortex.IdRemoto.Pedido",
		}
		this.enviarMensajePropio(pedido);
		this._idPedidoEnviado = pedido.id_mensaje_vortex;
		//console.log("Nodo " + pedido.id_mensaje_vortex.id_del_emisor + " Pata " + idLocal.toString() + " envia pedido:", pedido);
	},
    recibirPedidoDeIdRemoto : function(un_pedido){		
		var respuesta = {
			tipoDeMensaje : "Vortex.IdRemoto.Respuesta",
			idLocalAlEmisor : this._idLocal,
			idPedidoOriginal : un_pedido.id_mensaje_vortex
		}
		this.enviarMensajePropio(respuesta);
		//console.log("Nodo " + respuesta.id_mensaje_vortex.id_del_emisor + " Pata " + idLocal.toString() + " envia respuesta:", respuesta);
	},
    recibirRespuestaAPedidoDeIdRemoto : function(una_respuesta){
		if(this.compararIdsMensajes(una_respuesta.idPedidoOriginal, this._idPedidoEnviado)){
			this._idRemoto = una_respuesta.idLocalAlEmisor;
			var confirmacion = {
				tipoDeMensaje : "Vortex.IdRemoto.Confirmacion",
				idLocalAlEmisor : this._idLocal
			}
			this.enviarMensajePropio(confirmacion);
			//console.log("Nodo " + confirmacion.id_mensaje_vortex.id_del_emisor + " Pata " + idLocal.toString() + " envia confirmacion:", confirmacion);
		}
	},
    compararIdsMensajes : function(id1, id2){
        if(id1===undefined || id2 ===undefined) return false;
        return id1.id_del_emisor == id2.id_del_emisor && id1.numero_secuencia == id2.numero_secuencia;
    },
    recibirConfirmacionDePedidoDeIdRemoto : function(una_confirmacion){
		if(this.elMensajeEsParaEstaPata(una_confirmacion)){
            this._idRemoto = una_confirmacion.idLocalAlEmisor;
            var reConfirmacion = {
                tipoDeMensaje : "Vortex.IdRemoto.ReConfirmacion",
                idLocalAlEmisor : this._idLocal              
            }
            this.enviarMensajePropio(reConfirmacion);
            //console.log("Nodo " + reConfirmacion.id_mensaje_vortex.id_del_emisor + " Pata " + idLocal.toString() + " envia re confirmacion:", reConfirmacion);
            
            if(!this._laPataEsBidireccional) this.laPataSeHizoBiDireccional();
        }
	},
    recibirReConfirmacionDePedidoDeIdRemoto : function(una_re_confirmacion){
		if(this.elMensajeEsParaEstaPata(una_re_confirmacion)){
			if(!this._laPataEsBidireccional) this.laPataSeHizoBiDireccional();
		}
	},
    publicarFiltro_cuandoLaPataEsBidi : function(filtro){
        if(filtro.equals(this._filtroEnviado)) return;
        var publicacionDeFiltro = {
			tipoDeMensaje : "Vortex.Filtro.Publicacion",
            filtro: filtro.serializar()
		}
		var mensaje_enviado = this.enviarMensajePropio(publicacionDeFiltro);
        //console.log("Pata del Nodo " + mensaje_enviado.id_mensaje_vortex.id_del_emisor + " envia filtro:", mensaje_enviado); //log
        this._filtroEnviado = filtro;
        //console.log("Nodo " + publicacionDeFiltro.id_mensaje_vortex.id_del_emisor + " Pata " + idLocal.toString() + " envia publicacion De Filtro:", publicacionDeFiltro);
    },
    publicarFiltro_cuandoLaPataNoEsBidi : function(filtro){
        this._filtroAEnviar = filtro;
    },
    laPataSeHizoBiDireccional : function(){
        //onsole.log("Un Nodo en su Pata " + idLocal.toString() + " dice: soy bidi!");
        this._filtroRecibido = new FiltroFalse();
        this.onFiltroRecibidoModificado();
        this.publicarFiltro = this.publicarFiltro_cuandoLaPataEsBidi;
        if(!(this._filtroAEnviar === undefined)) this.publicarFiltro(this._filtroAEnviar);
        this._laPataEsBidireccional = true;
		this.ids_mensajes_enviados_unidireccionalmente = [];
    },
    filtrarYEnviarMensaje : function(un_mensaje){
		if(this.elMensajePasoPorEstaPata(un_mensaje)) return;
        if(!this._filtroRecibido.evaluarMensaje(un_mensaje)) return;
        var mensaje_enviado;
        if(un_mensaje.id_mensaje_vortex === undefined) mensaje_enviado = this.enviarMensajePropio(un_mensaje);        
		else mensaje_enviado = this.enviarMensaje(un_mensaje);	
		if(!this.conectadaBidireccionalmente()){
			this.ids_mensajes_enviados_unidireccionalmente.push(mensaje_enviado.id_mensaje_vortex);
		}
	},   
	elMensajePasoPorEstaPata: function(un_mensaje){
		if(this.conectadaBidireccionalmente()){
			if(un_mensaje.idLocalAlReceptor == this._idLocal) return true;
		}
		for(var i=0; i< this.ids_mensajes_enviados_unidireccionalmente.length; i++){
			if(this.compararIdsMensajes(un_mensaje.id_mensaje_vortex, this.ids_mensajes_enviados_unidireccionalmente[i])){
				return true;
			}
		}
		return false;
	},
    filtroRecibido : function(){
        return this._filtroRecibido;
    },        
    recibirMensaje : function (un_mensaje) {
		switch(un_mensaje.tipoDeMensaje)
		{
			case "Vortex.IdRemoto.Pedido":
				this.recibirPedidoDeIdRemoto(un_mensaje);
				break;
			case "Vortex.IdRemoto.Respuesta":
				this.recibirRespuestaAPedidoDeIdRemoto(un_mensaje);
				break;
			case "Vortex.IdRemoto.Confirmacion":
				this.recibirConfirmacionDePedidoDeIdRemoto(un_mensaje);
				break;
            case "Vortex.IdRemoto.ReConfirmacion":
				this.recibirReConfirmacionDePedidoDeIdRemoto(un_mensaje);
				break;
            case "Vortex.Filtro.Publicacion":
				this.recibirPublicacionDeFiltro(un_mensaje);
				break;
			default:
			this.filtrarYEnviarMensaje(un_mensaje);
		}
    },                    
	conectarCon : function (un_receptor) {
		this._receptor = un_receptor;
		this.enviarPedidoDeIdRemoto();
    },   
    desconectar: function () {
		this._receptor = {
            recibirMensaje: function (un_mensaje) { }
        }; 
    },
    conectadaBidireccionalmente : function(){
        return this._laPataEsBidireccional;
    }
};

if(typeof(require) != "undefined"){
    exports.clase = PataConectora;
}