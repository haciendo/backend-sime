/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/


if(typeof(require) != "undefined"){
    var GeneradorDeIdMensaje = require("./GeneradorDeIdMensaje").clase;
    var PataConectora = require("./PataConectora").clase;
    var FiltroOR = require("./FiltrosYTransformaciones").FiltroOR;
    var FiltroAND = require("./FiltrosYTransformaciones").FiltroAND;
    var FiltroFalse = require("./FiltrosYTransformaciones").FiltroFalse;
}

var NodoRouter = function(aliasRouter){
    this._patas = [];
	this._proximoIdPata = 0;	
	this._generadorDeIdMensaje = new GeneradorDeIdMensaje();
    this._aliasRouter = "router " + aliasRouter;
};

NodoRouter.prototype.mergearFiltrosParaUnaPata = function(pata){
    var filtrosParaLaPata = [];
    this._patas.forEach(function (p) {
        if(p === pata ) return;
        filtrosParaLaPata.push(p.filtroRecibido());
    });
    var filtroAPublicarALaPata = new FiltroFalse();
    if(filtrosParaLaPata.length>0){
        filtroAPublicarALaPata = new FiltroOR(filtrosParaLaPata).simplificar();  
    }
    pata.publicarFiltro(filtroAPublicarALaPata);
}

NodoRouter.prototype.mergearYEnviarFiltros = function(){
    var self = this;
    this._patas.forEach(function (pata) {
        self.mergearFiltrosParaUnaPata(pata);
    });
};

NodoRouter.prototype.enviarMensajeATodasLasPatas = function(un_mensaje){
    this._patas.forEach(function (pata) {
        pata.recibirMensaje(un_mensaje);
    });
};

NodoRouter.prototype.recibirMensaje = function (un_mensaje) {
    this.enviarMensajeATodasLasPatas(un_mensaje);        
};

NodoRouter.prototype.conectarCon = function(un_receptor) {
	var nuevaPata = new PataConectora(this._proximoIdPata, this._generadorDeIdMensaje);
	this._proximoIdPata+=1;
    this._patas.push(nuevaPata);
	nuevaPata.conectarCon(un_receptor);
    var _this = this;
    nuevaPata.onFiltroRecibidoModificado = function(){
        _this.mergearYEnviarFiltros();
    };
};

NodoRouter.prototype.desconectarDe = function(un_receptor) {
    var pata;
    for(var i=0; i<this._patas.length;i++){
        if(this._patas[i]._receptor === un_receptor){
            pata = this._patas[i];
            pata.desconectar();
        }
    }
    if(pata) {
        un_receptor.desconectarDe(this);
        this._patas.splice(this._patas.indexOf(pata), 1);
        this.mergearYEnviarFiltros();
    } 
};

NodoRouter.prototype.conectarBidireccionalmenteCon = function(un_nodo) {
	this.conectarCon(un_nodo);
    un_nodo.conectarCon(this);
};

NodoRouter.prototype.conectadoBidireccionalmenteEnTodasSusPatas = function() {
    var conectado = true;
    this._patas.forEach(function(pata){            
        if(!pata.conectadaBidireccionalmente()) conectado = false;
    });
    return conectado;
};

NodoRouter.instancia = new NodoRouter("singleton");

if(typeof(require) != "undefined"){
    exports.clase = NodoRouter;
}