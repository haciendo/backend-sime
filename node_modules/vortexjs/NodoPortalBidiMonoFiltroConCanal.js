/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/

if(typeof(require) != "undefined"){
    var PataConectora = require("./PataConectora").clase;
    var FiltroOR = require("./FiltrosYTransformaciones").FiltroOR;
    var FiltroAND = require("./FiltrosYTransformaciones").FiltroAND;
    var FiltroFalse = require("./FiltrosYTransformaciones").FiltroFalse;
}

var NodoPortalBidiMonoFiltroConCanal = function(aliasPortal, canal){
    this._pedido = { filtro: new FiltroFalse(), callback: function(){}};
    this._pata = { 
			recibirMensaje : function(un_mensaje){},
            publicarFiltro : function(un_filtro){},
            filtroRecibido : function(){ return new FiltroFalse();}
		};
    this._canal = canal;
    this._alias_portal = "portal " + aliasPortal;
};
NodoPortalBidiMonoFiltroConCanal.prototype = {
    publicarFiltros : function(){
        this._pata.publicarFiltro(this._canal.estamparFiltro(this._pedido.filtro.simplificar()));
    },
    enviarMensaje : function(un_mensaje){
		this._pata.recibirMensaje(this._canal.estamparMensaje(un_mensaje));
	},
    pedirMensajes : function( filtro, callback){
		this._pedido = { "filtro": filtro, "callback": callback};
        this.publicarFiltros();
	},
    recibirMensaje : function(un_mensaje) {
        console.log('mensaje recibido en ' + this._alias_portal, un_mensaje);
        if(un_mensaje.tipoDeMensaje.slice(0, "Vortex.".length) == "Vortex."){
            this._pata.recibirMensaje(un_mensaje);
            return;
        }				
        if(this._pedido.filtro.evaluarMensaje(un_mensaje)){
            this._pedido.callback(un_mensaje);
        }        
	},
    conectarCon : function(un_receptor){
		this._pata = new PataConectora(0, new GeneradorDeIdMensaje());
        this.publicarFiltros();
        this._pata.conectarCon(un_receptor);
	},
    conectadoBidireccionalmente : function(){
        return this._pata.conectadaBidireccionalmente();
    },
    filtroDeSalida : function(){
        return this._pata.filtroRecibido();
    }
};

if(typeof(require) != "undefined"){ exports.clase = NodoPortalBidiMonoFiltroConCanal;}