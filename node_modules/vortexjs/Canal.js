/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/


var Canal = function(alias, filtro, transformacion){
    this._alias = alias;
    this._filtro = filtro;
    this._trafo = transformacion;
    this.start();
}

Canal.prototype = {
    start:function(){

    },
    estamparFiltro: function(un_filtro){
        return new FiltroAND([this._filtro, un_filtro]);     
    },
    estamparMensaje: function(un_mensaje){
        return this._trafo.transformarMensaje(un_mensaje);
    },
    getSubCanal: function(alias, filtro, transformacion){
        return new Canal(alias, 
                         new FiltroAND([this._filtro, filtro]).simplificar(), 
                         new TrafoCompuesta([this._trafo, transformacion]));
    },
    serializar: function(){
        return {alias: this._alias,
                filtro: this._filtro.serializar(), 
                trafo: this._trafo.serializar()
                };
    },
    desSerializar: function(canal_serializado){
        this._alias = canal_serializado.alias;
        this._filtro = DesSerializadorDeFiltros.desSerializarFiltro(canal_serializado.filtro);
        this._trafo = DesSerializadorDeTrafos.desSerializarTrafo(canal_serializado.trafo);
    },
    equals: function(obj){
        if(!(obj instanceof Canal)) return false;
        return this._filtro.evaluarMensaje(obj._trafo.transformarMensaje({})) &&
               obj._filtro.evaluarMensaje(this._trafo.transformarMensaje({})) ;
    }
}

var CanalNulo = function(){

};

CanalNulo.prototype = {
    estamparFiltro:function(un_filtro){
        return new FiltroAND([un_filtro])
    },
    estamparMensaje:function(un_mensaje){
        return un_mensaje;
    }
};

var ComparadorDeCanales = {

}

