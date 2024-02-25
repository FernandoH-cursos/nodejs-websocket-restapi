import { UuidAdapter } from "../config/uuid.adapter";
import { Ticket } from "../domain/interfaces/ticket";
import { WssService } from "./wss.service";

export class TicketService {
  //* Tickets que se han creado
  public tickets: Ticket[] = [
    {
      id: UuidAdapter.v4(),
      number: 1,
      createdAt: new Date(),
      done: false,
    },
    {
      id: UuidAdapter.v4(),
      number: 2,
      createdAt: new Date(),
      done: false,
    },
    {
      id: UuidAdapter.v4(),
      number: 3,
      createdAt: new Date(),
      done: false,
    },
    {
      id: UuidAdapter.v4(),
      number: 4,
      createdAt: new Date(),
      done: false,
    },
    {
      id: UuidAdapter.v4(),
      number: 5,
      createdAt: new Date(),
      done: false,
    },
    {
      id: UuidAdapter.v4(),
      number: 6,
      createdAt: new Date(),
      done: false,
    },
  ];

  //* Tickets que se están atendiendo
  private readonly workinOnTickets: Ticket[] = [];

  constructor(private readonly wssService = WssService.instance) {}

  //? Devuelve todos los tickets que se están atendiendo(últimos 4)
  public get lastWorkingOnTickets(): Ticket[] {
    return this.workinOnTickets.slice(0, 4);
  }

  //? Devuelve todos los tickets que no han sido atendidos
  public get pendingTickets(): Ticket[] {
    return this.tickets.filter((ticket) => !ticket.handleAtDesk);
  }

  //? Devuelve el último número de ticket
  public get lastTicketNumber(): number {
    return this.tickets.length > 0 ? this.tickets.at(-1)!.number : 0;
  }

  //? Crear un nuevo ticket para ser atendido
  public createTicket() {
    const ticket: Ticket = {
      id: UuidAdapter.v4(),
      number: this.lastTicketNumber + 1,
      createdAt: new Date(),
      done: false,
      handleAtDesk: undefined,
      handleAt: undefined,
    };

    this.tickets.push(ticket);

    //* Enviamos el mensaje a todos los clientes conectados al WebSocket Server
    this.onTicketNumberChanged();

    return ticket;
  }

  //?  Permite a un ticket ser atendido en un escritorio
  public drawTicket(desk: string) {
    //* Buscamos el ticket que no ha sido atendido
    const ticket = this.tickets.find((ticket) => !ticket.handleAtDesk);
    if (!ticket)
      return { status: "error", message: "No hay tickets pendientes" };

    ticket.handleAtDesk = desk;
    ticket.handleAt = new Date();

    //* Agregamos el ticket a los que se están atendiendo
    this.workinOnTickets.unshift({ ...ticket });

    //* Enviamos cantidad de tickets pendientes a todos los clientes conectados al WebSocket Server
    this.onTicketNumberChanged();
    //* Enviamos ultimos 4 tickets atendido a todos los clientes conectados al WebSocket Server
    this.onWorkingOnChanged();

    return { status: "ok", ticket };
  }

  //? Permite terminar un ticket que se está atendiendo en un escritorio específico
  public onFinishedTicket(id: string) {
    //* Buscamos el ticket que se está atendiendo
    const ticket = this.tickets.find((ticket) => ticket.id === id);
    if (!ticket) return { status: "error", error: "Ticket no encontrado" };

    this.tickets = this.tickets.map((ticket) => {
      if (ticket.id === id) {
        ticket.done = true;
      }

      return ticket;
    });

    return { status: "ok" };
  }

  //? Envia un mensaje de que el número de tickets ha cambiado a todos los clientes conectados al WebSocket Server
  private onTicketNumberChanged() {
    this.wssService.sendMessage(
      "on-ticked-count-changed",
      this.pendingTickets.length
    );
  }

  private onWorkingOnChanged() {
    this.wssService.sendMessage(
      "on-working-changed",
      this.lastWorkingOnTickets
    );
  }
}
