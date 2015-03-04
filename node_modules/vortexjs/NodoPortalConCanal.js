/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/

var NodoPortalConCanal = function(aliasPortal, canal){
    this._listaPedidos = [];
    this._pata = { 
			recibirMensaje : function(un_mensaje){},
            publicarFiltro : function(un_filtro){},
            filtroRecibido : function(){ return new FiltroFalse();}
		};
    this._canal = canal;
    this._alias_portal = "portal " + aliasPortal;
};
NodoPortalConCanal.prototype = {
    publicarFiltros : function(){
        var filtros = [];
        this._listaPedidos.forEach(function(p){
            filtros.push(p.filtro);
        });
        var filtroMergeado = new FiltroOR(filtros).simplificar();

        this._pata.publicarFiltro(this._canal.estamparFiltro(filtroMergeado));
    },
    enviarMensaje : function(un_mensaje){
		this._pata.recibirMensaje(this._canal.estamparMensaje(un_mensaje));
	},
    pedirMensajes : function( filtro, callback){
		this._listaPedidos.push({ "filtro": filtro, "callback": callback});
        this.publicarFiltros();
	},
    recibirMensaje : function(un_mensaje) {
        console.log('mensaje recibido en ' + this._alias_portal, un_mensaje);
        if(un_mensaje.tipoDeMensaje.slice(0, "Vortex.".length) == "Vortex."){
            this._pata.recibirMensaje(un_mensaje);
            return;
        }
		this._listaPedidos.forEach(function (pedido) {					
					if(pedido.filtro.evaluarMensaje(un_mensaje)){
						pedido.callback(un_mensaje);
					}
				});	        
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