/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/

var test = {}

var mensaje_del_tipo_1 = {tipoDeMensaje:'1'};
var filtro_de_mensajes_del_tipo_1 = new FiltroXClaveValor('tipoDeMensaje', '1');    
var mensaje_del_tipo_2 = {tipoDeMensaje:'2'};
var filtro_de_mensajes_del_tipo_2 = new FiltroXClaveValor('tipoDeMensaje', '2');  

describe("3 portales conectados bidireccionalmente a un router", function() {     
    beforeEach(function() {
        runs(function() { 
            test.router_1 = new NodoRouter("1");   
            test.portal_1 = new NodoPortalBidi("1"); 
            test.portal_2 = new NodoPortalBidi("2"); 
            test.portal_3 = new NodoPortalBidi("3"); 
            test.router_1.conectarBidireccionalmenteCon(test.portal_1);
            test.router_1.conectarBidireccionalmenteCon(test.portal_2);
            test.router_1.conectarBidireccionalmenteCon(test.portal_3);
        });
        
        waits(0);        
        waitsFor(function() {
                return  test.router_1.conectadoBidireccionalmenteEnTodasSusPatas() &&
                        test.portal_1.conectadoBidireccionalmente() &&
                        test.portal_2.conectadoBidireccionalmente() &&
                        test.portal_3.conectadoBidireccionalmente();
        }, "No se conectaron bidireccionalmente", 500);       
    }); 
    it("Todos los nodos deberian estar conectados bidireccionalmente", function() {
        runs(function() { 
            expect(test.router_1.conectadoBidireccionalmenteEnTodasSusPatas()).toBeTruthy(); 
            expect(test.portal_1.conectadoBidireccionalmente()).toBeTruthy(); 
            expect(test.portal_2.conectadoBidireccionalmente()).toBeTruthy(); 
            expect(test.portal_3.conectadoBidireccionalmente()).toBeTruthy(); 
        });
    });   
    it("Los filtros de salida y de entrada de todos los portales deberian establecerse en filtros de tipo FALSE ya que ninguno pidio mensajes", function() {
        waits(100);   
        runs(function() { 
            expect(test.portal_1.filtroDeSalida().equals(new FiltroFalse())).toBeTruthy(); 
            expect(test.portal_2.filtroDeSalida().equals(new FiltroFalse())).toBeTruthy(); 
            expect(test.portal_3.filtroDeSalida().equals(new FiltroFalse())).toBeTruthy(); 
        });    
    });    
});
        
        
/*
test.describe_1_1 = function(){
    beforeEach(function() {
        runs(function() { 
            
        });
    });
    
    describe("Al router le conecto bidireccionalmente una cadena de 3 routers y al ultimo un tercer portal", function(){
        test.describe_1_1_1();
    });
};

test.describe_1_1_1 = function(){
    beforeEach(function() {
        runs(function() { 
            test.router_2 = new NodoRouter("2");   
            test.router_3 = new NodoRouter("3");   
            test.router_4 = new NodoRouter("4");   
            test.portal_3 = new NodoPortalBidi("3"); 
            test.router_2.conectarBidireccionalmenteCon(test.router_1);
            test.router_3.conectarBidireccionalmenteCon(test.router_2);
            test.router_4.conectarBidireccionalmenteCon(test.router_3);
            test.router_4.conectarBidireccionalmenteCon(test.portal_3);
        });
    });
    
    describe("El portal 1 pide mensajes de tipo 1", function(){
        test.describe_1_1_1_1();
    });     
};

test.describe_1_1_1_1 = function(){
    beforeEach(function() {
        runs(function() { 
            test.mensaje_de_tipo_1_recibido_en_portal_1 = false;
            test.portal_1.pedirMensajes(test.filtro_de_mensajes_del_tipo_1, function(){test.mensaje_de_tipo_1_recibido_en_portal_1 = true;})
        });
    });
    
    describe("El portal 2 envia un mensaje del tipo 1", function(){
        test.describe_1_1_1_1_1();
    });    
    
    describe("El portal 3 envia un mensaje del tipo 1", function(){
        test.describe_1_1_1_1_2();
    }); 
};

test.describe_1_1_1_1_1 = function(){
    beforeEach(function() {
        waits(80);
        runs(function() { 
            test.portal_2.enviarMensaje({tipoDeMensaje : "1"});
        });
        waits(40);
    });
    
    it("El portal 1 deberia haber recibido el mensaje", function() {
        runs(function() { 
            expect(test.mensaje_de_tipo_1_recibido_en_portal_1).toBeTruthy(); 
        });
    });     
};

test.describe_1_1_1_1_2 = function(){
    beforeEach(function() {
        waits(80);
        runs(function() { 
            test.portal_3.enviarMensaje({tipoDeMensaje : "1"});
        });
        waits(40);
    });
    
    it("El portal 1 deberia haber recibido el mensaje", function() {
        runs(function() { 
            expect(test.mensaje_de_tipo_1_recibido_en_portal_1).toBeTruthy(); 
        });
    });     
};

test.describe_1_2 = function(){
    beforeEach(function() {
        runs(function() { 
            test.router_singleton1 = NodoRouter.instancia;   
            test.router_singleton2 = NodoRouter.instancia;   
            test.portal_1 = new NodoPortalBidi("1"); 
            test.portal_2 = new NodoPortalBidi("2"); 
            test.router_singleton1.conectarBidireccionalmenteCon(test.portal_1);
            test.router_singlet2on1.conectarBidireccionalmenteCon(test.portal_2);
        });
    });
    
    it("Los dos routers deberian ser la misma instancia", function() {
        runs(function() { 
            expect(test.router_singleton1===test.router_singleton2).toBeTruthy(); 
        });
    });  
};
test.describe_1();*/