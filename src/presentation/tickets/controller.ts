import { Request, Response } from "express";
import { TicketService } from "../../services/ticket.service";

export class TicketController {
  // DI - wssService
  constructor(
    private readonly ticketService: TicketService = new TicketService()
  ) {}

  //? Muestra todos los tickets
  public getTickets = async (req: Request, res: Response) => {
    res.json(this.ticketService.tickets);
  };

  //? Muestra el último número de ticket
  public getLastTicketNumber = async (req: Request, res: Response) => {
    res.json(this.ticketService.lastTicketNumber);
  };

  //? Muestra todos los tickets que no han sido atendidos(pendientes)
  public pendingTickets = async (req: Request, res: Response) => {
    res.json(this.ticketService.pendingTickets);
  };
  //? Crea un nuevo ticket
  public createTicket = async (req: Request, res: Response) => {
    res.status(201).json(this.ticketService.createTicket());
  };

  //? Asigna un ticket a un escritorio
  public drawTicket = async (req: Request, res: Response) => {
    const { desk } = req.params;

    res.json(this.ticketService.drawTicket(desk));
  };

  //? Finaliza un ticket
  public ticketFinished = async (req: Request, res: Response) => {
    const { ticketId } = req.params;

    res.json(this.ticketService.onFinishedTicket(ticketId));
  };

  //? Muestra los tickets que se están atendiendo
  public workingOn = async (req: Request, res: Response) => {
    res.json(this.ticketService.lastWorkingOnTickets);
  };
}
