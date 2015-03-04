/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/
var GeneradorDeIdMensaje = function () {
    this.start();
};

GeneradorDeIdMensaje.prototype.start = function () {
    this.numeroSecuencia = 0;
    this.idEmisor = Math.floor((Math.random() * 10000) + 1).toString();
};

GeneradorDeIdMensaje.prototype.ponerIdAlMensaje = function (un_mensaje) {
    this.numeroSecuencia++;
    var idMensaje = {
        "id_del_emisor": this.idEmisor,
        "numero_secuencia": this.numeroSecuencia
    };
    un_mensaje.id_mensaje_vortex = idMensaje;
};

if(typeof(require) != "undefined"){ exports.clase = GeneradorDeIdMensaje;}