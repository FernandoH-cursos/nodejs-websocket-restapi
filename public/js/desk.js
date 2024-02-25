document.addEventListener('DOMContentLoaded', () => {
  loadInitialCount();
  showDesk();
  connectToWebSockets();
});


const endpointBase = 'http://localhost:3000/api/ticket';
const searchParams = new URLSearchParams(location.search);
const deskNumber = searchParams.get('escritorio');

const $lblPending = document.querySelector('#lbl-pending');
const $deskHeader = document.querySelector('h1');
const $noMoreAlert = document.querySelector('.alert');
const $lblCurrentTicket = document.querySelector('small');

const $btnDraw = document.querySelector('#btn-draw');
const $btnDone = document.querySelector('#btn-done');

let workingTicket = null;



//* Muestra el escritorio del ticket en el encabezado 
function showDesk() {

  if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escritorio es requerido');
  }

  $deskHeader.textContent = deskNumber;
}

//* Actualiza el contador de tickets pendientes(los que no han sido atendidos) 
function checkTicketCount(currentCount = 0) {
  if (currentCount === 0) {
    $noMoreAlert.classList.remove('d-none');
    $lblPending.innerHTML = null;
  } else {
    $noMoreAlert.classList.add('d-none');
    $lblPending.innerHTML = currentCount;
  }

}

//* Carga el contador de tickets pendientes(los que no han sido atendidos) 
async function loadInitialCount() {
  //* Obtiene todos los tickets pendientes o por atender 
  const pendingTickets = await (await fetch(`${endpointBase}/pending`)).json();

  checkTicketCount(pendingTickets.length);
}

//* Muestra el ticket en el escritorio que se está atendiendo 
async function getTicket() {
  await finishTicket();
  
  const { status, ticket, message } = await (await fetch(`${endpointBase}/draw/${deskNumber}`)).json();

  //* Si el ticket no se pudo obtener, muestra el mensaje de error 
  if (status === 'error') {
    $lblCurrentTicket.textContent = message;
    return;
  }

  //* Si el ticket se obtuvo, lo muestra en el escritorio 
  workingTicket = ticket;
  $lblCurrentTicket.textContent = ticket.number;
}


//* Finaliza el ticket que se está atendiendo 
async function finishTicket() {
  if (!workingTicket) return;

  const {
    status,
  } = await (await fetch(`${endpointBase}/done/${workingTicket.id}`, { method: 'PUT' })).json();

  if (status === 'ok') {
    workingTicket = null;
    $lblCurrentTicket.textContent = 'Nadie';

  }
}

//* Cliente de WebSockets para el servidor de WebSockets 
function connectToWebSockets() {
  const socket = new WebSocket('ws://localhost:3000/ws');

  //* Escucha los mensajes del servidor 
  socket.onmessage = (event) => {
    //* Obtiene el tipo y el payload del mensaje del servidor websocket

    const { type, payload } = JSON.parse(event.data);

    //* Si el tipo de mensaje no es el esperado, no hace nada 
    if (type !== 'on-ticked-count-changed') return;

    //* Actualiza el contador de tickets pendientes 
    checkTicketCount(payload);
  };

  //* Se ejecuta cuando la conexión se cierra 
  socket.onclose = (event) => {
    console.log('Connection closed');

    //* Reintenta la conexión después de 1.5 segundos 
    setTimeout(() => {
      console.log('retrying to connect');
      connectToWebSockets();
    }, 1500);

  };

  //* Se ejecuta cuando la conexión se abre 
  socket.onopen = (event) => {
    console.log('Connected');
  };

}


$btnDraw.addEventListener('click', getTicket);
$btnDone.addEventListener('click', finishTicket);