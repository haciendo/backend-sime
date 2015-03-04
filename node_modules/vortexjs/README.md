Vortex.JS
==================

Implementación del protocolo de comunicaciones Vortex en JavaScript para node.js y browsers.

### Otras implementaciones:
implementación en Java: https://github.com/kfgodel/vortex

## Para que sirve
La función de vortex es la de permitir la comunicación entre sistemas informáticos sin importar el lenguaje de programación, el canal de comunicación utilizado, o el protocolo físico necesario para la transmisión real de información.
Esta función se logra a través de la manipulación de los componentes para crear redes por las cuales circulan mensajes.

## Como funciona
Primero se debe definir la topología de una red, esto se logra conectando distintos nodos entre si.
Todo nodo tiene el método:
```
conectarCon(un_nodo)
```
Método utilizado para conectar unidireccionalmente un nodo con otro. 
Para que la conexión entre 2 nodos sea bidireccional se deberán conectar unidireccionalmente entre si:
```
nodo1.conectarCon(nodo2);
nodo2.conectarCon(nodo1);
```
Todos los nodos también implementan el método:
```
recibirMensaje(un_mensaje)
```
Método utilizado por los nodos para mandarse mensajes entre si.

## Los nodos principales de Vortex son:

### El portal:
Es la frontera y el punto de acceso a una red Vortex.
Permite inyectar mensajes a la red con el método 
```
enviarMensaje(un_mensaje)
```

También permite recibir mensajes de la red llamando al método
```
pedirMensajes(filtro, callback)
```
Cuando se recibe un mensaje que pasa por el filtro se ejecuta el callback pasado.
Al pedir mensajes a un portal, éste envía (publica) el filtro al nodo que tiene conectado.
También recibe publicaciones de filtros de la red a través de su nodo vecino.
Si al enviar un mensaje por un portal este no pasa por los filtros recibidos por el portal el mensaje se descarta.

### El Router:
Sirve como nexo entre portales y otros routers.
Conectando routers entre si se define la topología de una red vortex.
El router se encarga de reenviar los mensajes que recibe a los nodos que tiene conectados.
También se encarga de recibir publicaciones de filtros de sus nodos vecinos, de combinar los filtros y republicarlos al resto de los nodos.
El router está interesado en recibir todos los mensajes que quieren recibir sus nodos vecinos.

## Adaptadores varios:
Existen otros nodos que sirven para enviar mensajes por distintos medios.

### NodoClienteHTTP:
Se conecta via ajax con una url, crea una sesión y periódicamente envía los mensajes que tiene en su bandeja de salida y recibe los mensajes del servidor remoto.

### NodoSesionHTTPServer
Es el que administra la sesión y los mensajes de un cliente en el server (se comunica uno a uno con el NodoClienteHTTP)

### NodoConectorSocket
Conecta via WebSockets (usa Socket.io)

## Ejemplo de uso

```
var portal_1 = new NodoPortalBidi();
var portal_2 = new NodoPortalBidi();

var router = new NodoRouter();

portal_1.conectarCon(router);
router.conectarCon(portal_1);

portal_2.conectarCon(router);
router.conectarCon(portal_2);

var filtro = new FiltroXClaveValor('tipoDeMensaje', 'prueba');
portal_1.pedirMensajes(filtro, function(mensaje){
    alert("mensaje de prueba recibido en portal 1");
});

portal_2.enviarMensaje({tipoDeMensaje:'prueba'});

```
## Tests
[tests](http://jlurgo.github.io/VortexJS/jasmine-standalone-1.3.1/SpecRunner.html)

## Licencia

Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet

