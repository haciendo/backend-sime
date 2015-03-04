/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/

var test = {}
var esperarAQueLlegueMensajeEn = function(receptor, tipo_de_mensaje, mensaje_de_error){
    waits(0);        
    waitsFor(function() {                    
        return Enumerable.From(receptor.recibirMensaje.calls)
                        .Any(function(llamada){
                            return llamada.args[0].tipoDeMensaje == tipo_de_mensaje;
                        });
    }, mensaje_de_error, 500);  
}

test.describe_1 = function(){
    describe("Vortex", function() {     
        beforeEach(function() {
            runs(function() { 
                test.mensaje_del_tipo_1 = {tipoDeMensaje:'1'};
                test.filtro_de_mensajes_del_tipo_1 = new FiltroXClaveValor('tipoDeMensaje', '1');    
                test.mensaje_del_tipo_2 = {tipoDeMensaje:'2'};
                test.filtro_de_mensajes_del_tipo_2 = new FiltroXClaveValor('tipoDeMensaje', '2');  
            });
        });
        describe("Tengo un portal", function(){
            test.describe_1_1();
        }); 
    });
};

test.describe_1_1 = function(){
    beforeEach(function() {
        runs(function() { 
            test.portal_1 = new NodoPortalBidi("1");   
            spyOn(test.portal_1, 'recibirMensaje').andCallThrough();
        });
    });
    it("Su filtro de salida deberia ser false (pasa nada)", function() {
        runs(function() { 
            expect(test.portal_1.filtroDeSalida().equals(new FiltroFalse())); 
        });
    });
    
    describe("Lo conecto unidireccionalmete con un router", function(){
        test.describe_1_1_1();
    });        
};

test.describe_1_1_1 = function(){
    beforeEach(function() {
        runs(function() { 
            test.router_1 = new NodoRouter("1");   
            spyOn(test.router_1, 'recibirMensaje').andCallThrough();
            
            test.portal_1.conectarCon(test.router_1);
        });
    });
    
    it("El router deberia recibir asincronicamente un pedido de id del portal", function() {
        runs(function() {
            expect(test.router_1.recibirMensaje).not.toHaveBeenCalled();
        });
    
        waits(0);        
        waitsFor(function() {
                return  test.portal_1.recibirMensaje.calls.length == 0 &&
                        test.router_1.recibirMensaje.calls.length == 1;           
        }, "El Router no recibio el pedido", 500);
        runs(function() {
           expect(test.router_1.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
        });
     });
     
    it("El filtro de salida del portal deberia ser true (pasa todo)", function() {
        runs(function() {
            expect(test.portal_1.filtroDeSalida().equals(new FiltroTrue())); 
        });
    });
    
    describe("Conecto el router unidireccionalmente a un segundo portal", function(){
        test.describe_1_1_1_1();
    }); 
    
    describe("Conecto un segundo portal unidireccionalmente al router", function(){
        test.describe_1_1_1_2();
    }); 
    
    describe("Conecto el router al portal formando un enlace bidireccional", function(){
        test.describe_1_1_1_3();
    });   
};

test.describe_1_1_1_1 = function(){
    beforeEach(function() {
        runs(function() {
            test.portal_2 = new NodoPortalBidi("2");   
            spyOn(test.portal_2, 'recibirMensaje').andCallThrough();
            
            test.router_1.conectarCon(test.portal_2);
        });
    });
    it("El segundo portal deberia recibir asincronicamente un pedido de id y una respuesta del router al pedido de id del primer portal ", function() {
        runs(function() {
            expect(test.portal_1.recibirMensaje).not.toHaveBeenCalled();
            expect(test.portal_2.recibirMensaje).not.toHaveBeenCalled();
            expect(test.router_1.recibirMensaje).not.toHaveBeenCalled();
        });
    
        waits(0);        
        waitsFor(function() {
            return  test.portal_1.recibirMensaje.calls.length == 0 &&
                    test.router_1.recibirMensaje.calls.length == 1 &&
                    test.portal_2.recibirMensaje.calls.length == 2;                        
        }, "El segundo portal no recibio el pedido", 500);
        
        runs(function() {
            expect(test.router_1.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_2.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_2.recibirMensaje.calls[1].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Respuesta");
        });
    });
     
    describe("Conecto el router unidireccionalmente a un tercer portal formando una Y", function(){
        test.describe_1_1_1_1_1();
    });           
};

test.describe_1_1_1_1_1 = function(){
    beforeEach(function() {
        runs(function() {
            test.portal_3 = new NodoPortalBidi("3");   
            spyOn(test.portal_3, 'recibirMensaje').andCallThrough();
            
            test.router_1.conectarCon(test.portal_3);
        });
    });
    it("El tercer portal deberia recibir asincronicamente un pedido de id y una respuesta del router al pedido de id del primer portal ", function() {
        runs(function() {
            expect(test.portal_1.recibirMensaje).not.toHaveBeenCalled();
            expect(test.router_1.recibirMensaje).not.toHaveBeenCalled();                        
            expect(test.portal_2.recibirMensaje).not.toHaveBeenCalled();
            expect(test.portal_3.recibirMensaje).not.toHaveBeenCalled();
        });
    
        waits(0);        
        waitsFor(function() {
            return  test.portal_1.recibirMensaje.calls.length == 0 &&
                    test.router_1.recibirMensaje.calls.length == 1 &&
                    test.portal_2.recibirMensaje.calls.length == 2 &&                        
                    test.portal_3.recibirMensaje.calls.length == 2;                        
        }, "El tercer portal no recibio el pedido", 500);
        
        runs(function() {
            expect(test.router_1.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_2.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_2.recibirMensaje.calls[1].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Respuesta");
            expect(test.portal_3.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_3.recibirMensaje.calls[1].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Respuesta");
        });
    });
    
    describe("El segundo portal pide mensajes del tipo 1", function(){                    
        test.describe_1_1_1_1_1_1();           
    });          
};

test.describe_1_1_1_1_1_1 = function(){
    beforeEach(function() {   
        runs(function() {
            test.mensaje_de_tipo_1_recibido_en_portal_2 = false;
            test.portal_2.pedirMensajes(test.filtro_de_mensajes_del_tipo_1, 
                               function(){test.mensaje_de_tipo_1_recibido_en_portal_2 = true;});   
        });
    });
    describe("El primer portal envia un mensaje del tipo 1", function(){ 
        test.describe_1_1_1_1_1_1_1();
    });    
    describe("El primer portal envia un mensaje del tipo 2", function(){ 
        test.describe_1_1_1_1_1_1_2();
    }); 
};

test.describe_1_1_1_1_1_1_1 = function(){
    beforeEach(function() {
        runs(function() {
            test.portal_1.enviarMensaje(test.mensaje_del_tipo_1);   
        });   
    });    
    
    it("El segundo y tercer portal deberian recibir asincronicamente el mensaje pero solo el segundo ejecutar callback", function() {
        waits(0);        
        waitsFor(function() {
            return  test.portal_1.recibirMensaje.calls.length == 0 &&
                    test.router_1.recibirMensaje.calls.length == 2 &&
                    test.portal_2.recibirMensaje.calls.length == 3 &&                        
                    test.portal_3.recibirMensaje.calls.length == 3 &&
                    test.mensaje_de_tipo_1_recibido_en_portal_2 == true;                       
        }, "No recibieron el mensaje", 500);
        
        runs(function() {                                    
            expect(test.router_1.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_2.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_2.recibirMensaje.calls[1].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Respuesta");
            expect(test.portal_2.recibirMensaje.calls[2].args[0].tipoDeMensaje).toEqual("1");
            expect(test.portal_3.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_3.recibirMensaje.calls[1].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Respuesta");
            expect(test.portal_3.recibirMensaje.calls[2].args[0].tipoDeMensaje).toEqual("1");
        });
    });    
};

test.describe_1_1_1_1_1_1_2 = function(){
    beforeEach(function() {
        runs(function() {
            test.portal_1.enviarMensaje(test.mensaje_del_tipo_2);   
        });   
    });    
    
    it("El segundo y tercer portal deberian recibir asincronicamente el mensaje pero no ejecutarse el callback del primero", function() {
        waits(0);        
        waitsFor(function() {
            return  test.portal_1.recibirMensaje.calls.length == 0 &&
                    test.router_1.recibirMensaje.calls.length == 2 &&
                    test.portal_2.recibirMensaje.calls.length == 3 &&                        
                    test.portal_3.recibirMensaje.calls.length == 3;                         
        }, "No recibieron el mensaje", 500);
        waits(10);   
        runs(function() {                                    
            expect(test.router_1.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_2.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_2.recibirMensaje.calls[1].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Respuesta");
            expect(test.portal_2.recibirMensaje.calls[2].args[0].tipoDeMensaje).toEqual("2");
            expect(test.portal_3.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_3.recibirMensaje.calls[1].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Respuesta");
            expect(test.portal_3.recibirMensaje.calls[2].args[0].tipoDeMensaje).toEqual("2");
            expect(test.mensaje_de_tipo_1_recibido_en_portal_2).toBeFalsy();
            
        });
    });    
};

test.describe_1_1_1_2 = function(){
    beforeEach(function() {
        runs(function() {
            test.portal_2 = new NodoPortalBidi("2");   
            spyOn(test.portal_2, 'recibirMensaje').andCallThrough();
            
            test.portal_2.conectarCon(test.router_1);
        });
    });
    it("El router deberia recibir asincronicamente un pedido de id del segundo portal", function() {    
        runs(function() {
            expect(test.portal_1.recibirMensaje).not.toHaveBeenCalled();                        
            expect(test.router_1.recibirMensaje).not.toHaveBeenCalled();
            expect(test.portal_2.recibirMensaje).not.toHaveBeenCalled();
        });
    
        waits(0);        
        waitsFor(function() {
            return  test.portal_1.recibirMensaje.calls.length == 0 &&
                    test.router_1.recibirMensaje.calls.length == 2 &&
                    test.portal_2.recibirMensaje.calls.length == 0;                        
        }, "El segundo portal no recibio el pedido", 500);
        
        runs(function() {
            expect(test.router_1.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.router_1.recibirMensaje.calls[1].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
        });
    });      
};

test.describe_1_1_1_3 = function(){
    beforeEach(function() {     
        runs(function() {
            test.router_1.conectarCon(test.portal_1);
        });
    });
    
    it("Al establecerse la conexion bidireccional el filtro de salida del portal deberia ser false, entonces, si el portal manda un mensaje el router no deberia recibirlo", function() {
        waits(0);        
        waitsFor(function() {
            return  test.portal_1.conectadoBidireccionalmente() &&
                    test.router_1.conectadoBidireccionalmenteEnTodasSusPatas();                        
        }, "No se establecio la conexion bidi", 500);
        
        runs(function() {
            expect(test.portal_1.filtroDeSalida().equals(new FiltroFalse()));       
        });
        
        runs(function() {
            test.portal_1.enviarMensaje(test.mensaje_del_tipo_1);
        });      
        
        waits(100);        
        runs(function() {                    
            expect(Enumerable.From(test.router_1.recibirMensaje.calls)
                            .Any(function(llamada){
                                return llamada.args[0].tipoDeMensaje == test.mensaje_del_tipo_1.tipoDeMensaje;
                            })
                  ).toBeFalsy();
        });                    
    });       
     
    describe("El portal pide mensajes del tipo 1", function(){
        test.describe_1_1_1_3_1();
    }); 
    describe("Conecto un segundo router bidireccionalmente al primero y a este un segundo portal, el que pide mensajes del tipo 1 y el portal 1 envia", function(){
        test.describe_1_1_1_3_2();
    }); 
};

test.describe_1_1_1_3_1 = function(){
    beforeEach(function() {     
        runs(function() {
            test.mensaje_de_tipo_1_recibido_en_portal_1 = false;
            test.portal_1.pedirMensajes(test.filtro_de_mensajes_del_tipo_1, 
                                   function(){test.mensaje_de_tipo_1_recibido_en_portal_1 = true;});  
        });
    });
    it("El portal debería esperar a que se establezca la conexion bidireccional antes de enviar el filtro", function() {
        waits(0);        
        waitsFor(function() {
            return  test.portal_1.recibirMensaje.calls.length == 4 &&
                    test.router_1.recibirMensaje.calls.length == 5;                        
        }, "No se mandaron los mensajes", 500);
        
        runs(function() {
            expect(test.portal_1.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_1.recibirMensaje.calls[1].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Respuesta");
            expect(test.portal_1.recibirMensaje.calls[2].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Confirmacion");
            expect(test.portal_1.recibirMensaje.calls[3].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.ReConfirmacion");
            
            expect(test.router_1.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.router_1.recibirMensaje.calls[1].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Respuesta");
            expect(test.router_1.recibirMensaje.calls[2].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Confirmacion");
            expect(test.router_1.recibirMensaje.calls[3].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.ReConfirmacion");
            expect(test.router_1.recibirMensaje.calls[4].args[0].tipoDeMensaje).toEqual("Vortex.Filtro.Publicacion");
            
            expect(test.portal_1.conectadoBidireccionalmente()).toBeTruthy();
            expect(test.router_1.conectadoBidireccionalmenteEnTodasSusPatas()).toBeTruthy();                        
        });
    });  
    it("El portal no deberia recibir una publicacion de filtro", function() {
        waits(100);        
        runs(function() {
            expect(Enumerable.From(test.portal_1.recibirMensaje.calls)
                .Any(function(llamada){
                        return llamada.args[0].tipoDeMensaje == "Vortex.Filtro.Publicacion";
                    })).toBeFalsy();                     
        });
    });  
    describe("Espero a que llegue el pedido al router", function(){
        test.describe_1_1_1_3_1_1();
    }); 
};

test.describe_1_1_1_3_1_1 = function(){
    beforeEach(function() {      
        runs(function() {
            test.router_1.recibirMensaje.calls = [];
            esperarAQueLlegueMensajeEn(test.router_1, "Vortex.Filtro.Publicacion", "No llego el filtro");  
        });    
    });
    describe("Envio un mensaje de tipo 1 desde el portal", function(){
        test.describe_1_1_1_3_1_1_1();
    }); 
};

test.describe_1_1_1_3_1_1_1 = function(){
    beforeEach(function() {      
        runs(function() {
            test.portal_1.enviarMensaje(test.mensaje_del_tipo_1);   
        });    
    });
    it("El router no deberia recibir el mensaje", function() {
        waits(100);        
        runs(function() {
            expect(Enumerable.From(test.router_1.recibirMensaje.calls)
                .Any(function(llamada){
                        return llamada.args[0].tipoDeMensaje == "1";
                    })).toBeFalsy();                     
        });
    });  
    it("El portal no deberia ejecutar el callback", function() {
        waits(100);        
        runs(function() {
            expect(test.mensaje_de_tipo_1_recibido_en_portal_1).toBeFalsy();                     
        });
    }); 
    describe("Conecto un segundo portal bidireccionalmente al router", function(){
        test.describe_1_1_1_3_1_1_1_1();
    }); 
};

test.describe_1_1_1_3_1_1_1_1 = function(){
    beforeEach(function() {      
        runs(function() {
            test.portal_2 = new NodoPortalBidi("2");   
            spyOn(test.portal_2, 'recibirMensaje').andCallThrough();
            
            test.portal_2.conectarCon(test.router_1);
            test.router_1.conectarCon(test.portal_2);
            test.router_1.recibirMensaje.calls = [];
        });    
    });
    it("El router y el portal 2 no deberian estar conectados bidireccionalmente en sus patas, el portal 1 si", function() {
        runs(function() {
            expect(test.portal_2.recibirMensaje).not.toHaveBeenCalled();  
            expect(test.portal_2.conectadoBidireccionalmente()).toBeFalsy();
            expect(test.portal_1.conectadoBidireccionalmente()).toBeTruthy();
            expect(test.router_1.conectadoBidireccionalmenteEnTodasSusPatas()).toBeFalsy();         
        });
    }); 
    
    describe("Espero a que se establezca la conexion bidireccional", function() {
       test.describe_1_1_1_3_1_1_1_1_1();
    });                    
};

test.describe_1_1_1_3_1_1_1_1_1 = function(){
    beforeEach(function() {    
        waits(0);        
        waitsFor(function() {   
            return  test.portal_2.conectadoBidireccionalmente() &&
                    test.router_1.conectadoBidireccionalmenteEnTodasSusPatas();
        });
    });        
    it("El portal 2 deberia recibir una publicacion de filtros y su filtro de salida solo deberia dejar pasar mensajes del tipo 1", function() {        
        esperarAQueLlegueMensajeEn(test.portal_2, "Vortex.Filtro.Publicacion", "No llego el filtro");
        runs(function () {
            expect(test.portal_2.filtroDeSalida().equals(test.filtro_de_mensajes_del_tipo_1)).toBeTruthy();      
            //expect(test.portal_2.filtroDeSalida().evaluarMensaje({tipoDeMensaje:'1'})).toBeTruthy();          
        });
    });      
    describe("Espero a que llegue el filtro del portal 1 al portal 2", function() {
       test.describe_1_1_1_3_1_1_1_1_1_1();
    });   
};

test.describe_1_1_1_3_1_1_1_1_1_1 = function(){
    beforeEach(function() {    
        waits(0);        
        waitsFor(function() {   
            return  test.portal_2.filtroDeSalida().evaluarMensaje({tipoDeMensaje:'1'});
        });
    });        
    describe("Envio un mensaje de tipo 1 desde el portal 2", function() {
       test.describe_1_1_1_3_1_1_1_1_1_1_1();
    });  
};

test.describe_1_1_1_3_1_1_1_1_1_1_1 = function(){
    beforeEach(function() {    
        runs(function() {
            test.mensaje_de_tipo_1_recibido_en_portal_1 = false;
            test.portal_2.enviarMensaje({tipoDeMensaje:'1'});   
        }); 
    });    
    it("El portal 1 deberia ejecutar el callback", function() {
        waits(20);        
        runs(function() {
            expect(test.mensaje_de_tipo_1_recibido_en_portal_1).toBeTruthy();                     
        });
    }); 
    describe("El portal 2 pide mensajes del tipo 1", function(){
        test.describe_1_1_1_3_1_1_1_1_1_1_1_1();
    });   
};

test.describe_1_1_1_3_1_1_1_1_1_1_1_1 = function(){
    beforeEach(function() {     
        runs(function() {
            test.mensaje_de_tipo_1_recibido_en_portal_2 = false;
            test.portal_2.pedirMensajes(test.filtro_de_mensajes_del_tipo_1, 
                                   function(){test.mensaje_de_tipo_1_recibido_en_portal_2 = true;});  
        });
    });

    it("El portal 1 deberia recibir una publicacion de filtros y su filtro de salida dejar pasar los mensajes del tipo 1", function() {
        waits(50);
        runs(function() {
            expect(test.portal_1.filtroDeSalida().evaluarMensaje({tipoDeMensaje:'1'})).toBeTruthy();          
        });
    });  
    describe("Espero a que llegue el filtro del portal 2 al portal 1", function() {
       test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1();
    }); 
};

test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1 = function(){
    beforeEach(function() {    
        waits(0);        
        waitsFor(function() {   
            return  test.portal_1.filtroDeSalida().evaluarMensaje({tipoDeMensaje:'1'});
        });
        waits(20);
    });        
    describe("Envio un mensaje de tipo 1 desde el portal 1", function() {
       test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_1();
    });  
    
    describe("Vuelvo a enviar un mensaje de tipo 1 desde el portal 2", function() {
       test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_2();
    });  
};

test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_1 = function(){
    beforeEach(function() {    
        runs(function() {
            test.mensaje_de_tipo_1_recibido_en_portal_1 = false;
            test.mensaje_de_tipo_1_recibido_en_portal_2 = false;
            test.portal_1.enviarMensaje({tipoDeMensaje:'1'});   
            test.portal_1.recibirMensaje.calls = [];
        }); 
    });    
    it("El portal 2 deberia recibir el mensaje y ejecutar el callback", function() { 
        esperarAQueLlegueMensajeEn(test.portal_2, "1", "No llego el mensaje"); 
        runs(function() {                   
            expect(test.mensaje_de_tipo_1_recibido_en_portal_2).toBeTruthy();                     
        });
    }); 
    it("El portal 1 no deberia ejecutar el callback (no deberia recibir sus propios mensajes)", function() {
        waits(50);        
        runs(function() {
            expect(test.mensaje_de_tipo_1_recibido_en_portal_1).toBeFalsy();                     
        });
    });  
 describe("Conecto un tercer portal bidireccionalmente al router", function(){
        test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_1_1();
    });  
};

test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_1_1 = function(){
    beforeEach(function() {    
        waits(100);
        runs(function() {
            test.portal_3 = new NodoPortalBidi("3");   
            spyOn(test.portal_3, 'recibirMensaje').andCallThrough();
            
            test.portal_3.conectarCon(test.router_1);
            test.router_1.conectarCon(test.portal_3);
            test.portal_3.recibirMensaje.calls = [];
        });    
    });
    it("El router y el portal 3 no deberian estar conectados bidireccionalmente en sus patas, el portal 1 y el 2 si", function() {
        runs(function() {
            expect(test.portal_3.conectadoBidireccionalmente()).toBeFalsy();
            expect(test.portal_2.conectadoBidireccionalmente()).toBeTruthy();
            expect(test.portal_1.conectadoBidireccionalmente()).toBeTruthy();
            expect(test.router_1.conectadoBidireccionalmenteEnTodasSusPatas()).toBeFalsy();         
        });
    }); 
    
    describe("Espero a que se establezca la conexion bidireccional", function() {
       test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_1_1_1();
    });                    
};

test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_1_1_1 = function(){
    beforeEach(function() {    
        waits(0);        
        waitsFor(function() {   
            return  test.portal_3.conectadoBidireccionalmente() &&
                    test.router_1.conectadoBidireccionalmenteEnTodasSusPatas();
        });
    });        
    it("El portal 3 deberia recibir una publicacion de filtros y su filtro de salida dejar pasar los mensajes del tipo 1", function() {       
        esperarAQueLlegueMensajeEn(test.portal_3, "Vortex.Filtro.Publicacion", "No llego el filtro"); 
        
        runs(function() {
            expect(test.portal_3.filtroDeSalida().evaluarMensaje({tipoDeMensaje:'1'})).toBeTruthy();          
        });
    });  
    describe("Espero a que llegue el filtro de mensajes de tipo 1 al portal 3", function() {
       test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_1_1_1_1();
    });     
};

test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_1_1_1_1 = function(){
    beforeEach(function() {    
        waits(0);        
        waitsFor(function() {   
            return  test.portal_3.filtroDeSalida().evaluarMensaje({tipoDeMensaje:'1'});
        });
    });        
    describe("Envio un mensaje de tipo 1 desde el portal 3", function() {
       test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_1_1_1_1_1();
    });   
};

test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_1_1_1_1_1 = function(){
    beforeEach(function() {    
        runs(function() {
            test.mensaje_de_tipo_1_recibido_en_portal_1 = false;
            test.mensaje_de_tipo_1_recibido_en_portal_2 = false;
            test.portal_3.enviarMensaje({tipoDeMensaje:'1'});   
            test.portal_3.recibirMensaje.calls = []
        }); 
    });    
    it("El portal 1 y 2 deberian ejecutar el callback", function() {
        waits(0); 
        waitsFor(function() {   
            return  test.mensaje_de_tipo_1_recibido_en_portal_1 &&
                    test.mensaje_de_tipo_1_recibido_en_portal_2;
        });
    }); 
    it("El portal 3 no deberia recibir sus propios mensajes", function() {
        runs(function() {
            expect(Enumerable.From(test.portal_3.recibirMensaje.calls)
                .Any(function(llamada){
                        return llamada.args[0].tipoDeMensaje == "1";
                    })).toBeFalsy();                     
        });
        waits(50);        
        runs(function() {
            expect(Enumerable.From(test.portal_3.recibirMensaje.calls)
                .Any(function(llamada){
                        return llamada.args[0].tipoDeMensaje == "1";
                    })).toBeFalsy();                     
        });
    });  
};

test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_2 = function(){
    beforeEach(function() {    
        runs(function() {
            test.mensaje_de_tipo_1_recibido_en_portal_1 = false;
            test.mensaje_de_tipo_1_recibido_en_portal_2 = false;
            test.portal_2.enviarMensaje({tipoDeMensaje:'1'});   
        }); 
    });    
    it("El portal 1 deberia ejecutar el callback", function() {
        waits(20); 
        runs(function() {                   
            expect(test.mensaje_de_tipo_1_recibido_en_portal_1).toBeTruthy();                     
        });
    }); 
    it("El portal 2 no deberia ejecutar el callback (no deberia recibir sus propios mensajes)", function() {
        waits(50);        
        runs(function() {
            expect(Enumerable.From(test.portal_2.recibirMensaje.calls)
                .Any(function(llamada){
                        return llamada.args[0].tipoDeMensaje == "1";
                    })).toBeFalsy();                     
        });
    });  
};

test.describe_1_1_1_3_2 = function(){
    beforeEach(function() {      
        runs(function() {            
            test.router_2 = new NodoRouter("2");   
            test.portal_2 = new NodoPortalBidi("2");
            
            test.mensaje_de_tipo_1_recibido_en_portal_2 = false;
            test.portal_2.pedirMensajes(test.filtro_de_mensajes_del_tipo_1, 
                                   function(){test.mensaje_de_tipo_1_recibido_en_portal_2 = true;});  
            
            test.router_1.conectarBidireccionalmenteCon(test.router_2);
            test.router_2.conectarBidireccionalmenteCon(test.portal_2);
            
            spyOn(test.router_2, 'recibirMensaje').andCallThrough();
            spyOn(test.portal_2, 'recibirMensaje').andCallThrough();
        });    
        waits(100);
        runs(function() {              
            test.portal_1.enviarMensaje({tipoDeMensaje:'1'});   
        });
        waits(50);
    });
    it("El portal 2 deberia hacer recibido el mensaje", function() {
        runs(function() {
            expect(test.mensaje_de_tipo_1_recibido_en_portal_2).toBeTruthy();         
        });
    });                    
};

test.describe_1();