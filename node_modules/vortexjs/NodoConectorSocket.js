/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/

var NodoConectorSocket = function(opt){
    this.socket = opt.socket;
    this.verbose = opt.verbose||false;
    this.id = opt.id||"anonimo";
    this.alDesconectar = opt.alDesconectar||function(){};
    this.start();
};

NodoConectorSocket.prototype.start = function(){
    var _this = this;
    this.socket.on('mensaje_vortex', function (mensaje) {
        if(_this.verbose) console.log("conector recibe mensaje por socket:", mensaje);
        _this.receptor.recibirMensaje(mensaje);
    });
    this.socket.on('disconnect', function () {
        _this.desconectarDe(_this.receptor);
    });
    if(this.verbose) console.log('socket ' + this.id + ' conectado');
};

NodoConectorSocket.prototype.conectarCon = function(un_nodo){
    this.receptor = un_nodo;
};

NodoConectorSocket.prototype.desconectarDe = function(un_nodo){
    this.receptor = {
        recibirMensaje:function(){},
        desconectarDe: function(){}
    };
    this.desconectarDe = function(){};
    
    un_nodo.desconectarDe(this);
    if(this.verbose) console.log('socket ' + this.id + ' desconectado');
    this.alDesconectar();
};

NodoConectorSocket.prototype.recibirMensaje = function(mensaje){  
    if(this.verbose) console.log("conector envia mensaje por socket:", mensaje);
    this.socket.emit('mensaje_vortex', mensaje);
};

if(typeof(require) != "undefined"){
    exports.clase = NodoConectorSocket;
}