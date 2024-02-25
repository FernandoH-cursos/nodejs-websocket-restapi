document.addEventListener('DOMContentLoaded', () => {
  loadCurrentTickets();
  connectToWebSockets();
});

const endpointBase = 'http://localhost:3000/api/ticket';

//* Renderizar los ultimos 4 tickets en el DOM 
function renderTickets(tickets = []) {

  for (let i = 0; i < tickets.length; i++) {
    if (i >= 4) break;

    const ticket = tickets[i];
    //* Si el ticket no existe, no renderizar 
    if (!ticket) continue;

    const $lblTicket = document.querySelector(`#lbl-ticket-0${i + 1}`);
    const $lblDesk = document.querySelector(`#lbl-desk-0${i + 1}`);

    $lblTicket.textContent = `Ticket ${ticket.number}`;
    $lblDesk.textContent = ticket.handleAtDesk;

  }
}



//* Cargar los últimos 4 tickets atendidos 
async function loadCurrentTickets() {
  const tickets = await (await fetch(`${endpointBase}/working-on`)).json();
  renderTickets(tickets);
}


//* Cliente de WebSockets para el servidor de WebSockets 
function connectToWebSockets() {
  const socket = new WebSocket('ws://localhost:3000/ws');

  //* Escucha los mensajes del servidor 
  socket.onmessage = (event) => {
    //* Obtiene la data de los ultimos 4 tickets atendidos
    const { type, payload } = JSON.parse(event.data);

    //* Si el tipo de mensaje no es el esperado, no hace nada 
    if (type !== 'on-working-changed') return;

    renderTickets(payload);
  };

  //* Se ejecuta cuando la conexión se cierra 
  socket.onclose = (event) => {

    //* Reintenta la conexión después de 1.5 segundos 
    setTimeout(() => {
      connectToWebSockets();
    }, 1500);

  };

  //* Se ejecuta cuando la conexión se abre 
  socket.onopen = (event) => {
    console.log('Connected');
  };

}
