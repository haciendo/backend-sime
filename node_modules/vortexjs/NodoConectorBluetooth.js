var NodoConectorBluetooth = function(opt){
    $.extend(true, this, opt);
    var _this = this;
    setTimeout(function(){
        _this.conectarPorBluetooth();
    }, 1000);   
};

NodoConectorBluetooth.prototype.recibirMensaje = function(mensaje){
    var caracteres = [];
    caracteres = caracteres.concat(JSON.stringify(mensaje).split(''));
    caracteres.push('\n');
    bluetoothSerial.write(caracteres.join(""));
};

NodoConectorBluetooth.prototype.conectarCon = function(otro_nodo){
    this.nodoVecino = otro_nodo;
};

NodoConectorBluetooth.prototype.conectarPorBluetooth = function(){
    var _this = this;
    bluetoothSerial.connect(_this.mac, 
        function(){
            console.log('conectado a ' + _this.mac);
            bluetoothSerial.subscribe('\n', function (data) {
                console.log('recibido:' + data);
                _this.nodoVecino.recibirMensaje(JSON.parse(data));
            }, function(){
                console.log('error al suscribirse');
            });
            _this.alConectar();
        }, function(){
            console.log('error al conectar a ' + _this.mac + " reintentando en 1 segundo...");
            _this.onErrorAlConectar();
            setTimeout(function(){
                _this.conectarPorBluetooth();
            }, 1000);            
    });
};

if(typeof(require) != "undefined"){
    exports.clase = NodoConectorBluetooth;
}       