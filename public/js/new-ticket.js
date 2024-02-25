document.addEventListener('DOMContentLoaded', () => {
  createTicket();
  showLastTicket();
});
const endpointBase = 'http://localhost:3000/api/ticket';

async function createTicket() {
  const $btnCreateTicket = document.querySelector('.btn');

  $btnCreateTicket.addEventListener('click', async () => {
    //* Crea un nuevo ticket 
    const res = await fetch(endpointBase, {method: 'POST'});
    await res.json();
    
    showLastTicket();
  });
}

async function getLastTicket() {
  //* Obtiene el último ticket 
  const res = await fetch(`${endpointBase}/last`);
  const data = await res.json();

  return data;
}

async function showLastTicket(){
  const $ticketNumber = document.querySelector('#lbl-new-ticket');
  const lastTicket = await getLastTicket();

  $ticketNumber.textContent = lastTicket;
}