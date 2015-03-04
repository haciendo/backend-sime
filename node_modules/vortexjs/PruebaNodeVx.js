var vx = require('./vortex').Vortex;
var FiltroXEjemplo = require("./FiltrosYTransformaciones").FiltroXEjemplo;

vx.start({verbose:true});

vx.conectarPorWebSockets({
    //url:'https://router-vortex.herokuapp.com' 
    url:'http://localhost:3000'
});   

vx.pedirMensajes({
    filtro: {
		tipoDeMensaje:"chota"
	},
    callback: function(mensaje){
        console.log("llego: " + JSON.stringify(mensaje));
    }
});


