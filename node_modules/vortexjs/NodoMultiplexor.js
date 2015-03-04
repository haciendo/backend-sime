/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/
var NodoMultiplexor = function(){
    var self = this;
	var receptores = [];

    this.recibirMensaje = function (un_mensaje) {
		receptores.forEach(function (receptor) {
            receptor.recibirMensaje(un_mensaje);
        });
    }
	
	this.conectarCon = function (un_receptor) {
        receptores.push(un_receptor);
    }
}

if(typeof(require) != "undefined"){ exports.clase = NodoMultiplexor;}