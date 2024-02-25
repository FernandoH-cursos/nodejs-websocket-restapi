
//* Cliente de WebSockets para el servidor de WebSockets 
function connectToWebSockets() {

  const socket = new WebSocket( 'ws://localhost:3000/ws' );

  //* Escucha los mensajes del servidor 
  socket.onmessage = ( event ) => {
    console.log(event.data);
  };

  //* Se ejecuta cuando la conexión se cierra 
  socket.onclose = ( event ) => {
    console.log('Connection closed');
    
    //* Reintenta la conexión después de 1.5 segundos 
    setTimeout( () => {
      console.log( 'retrying to connect' );
      connectToWebSockets();
    }, 1500 );

  };

  //* Se ejecuta cuando la conexión se abre 
  socket.onopen = ( event ) => {
    console.log( 'Connected' );
  };

}

connectToWebSockets();

