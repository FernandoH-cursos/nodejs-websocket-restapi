import { Server } from "http";
import WebSocket, { WebSocketServer } from "ws";

interface Options {
  server: Server;
  path?: string;
}

export class WssService {
  //* Singleton Pattern para el servicio de WebSockets
  private static _instance: WssService;
  private wss: WebSocketServer;

  //* Constructor privado que recibe el servidor http y el path del WebSocket
  private constructor(options: Options) {
    const { server, path = "/ws" } = options; // localhost:3000/ws

    //* Inicializamos el WebSocketServer con el servidor http y el path
    this.wss = new WebSocketServer({ server, path });
    this.start();
  }

  //* Este getter estático nos permite acceder a la instancia del servicio de WebSockets
  static get instance(): WssService {
    //* Si no existe una instancia de WssService, lanzamos un error
    if (!WssService._instance) {
      throw new Error("WssService is not initialized");
    }

    return WssService._instance;
  }

  //? Este método estático es el encargado de inicializar el servicio de WebSockets
  static initWss(options: Options) {
    //* Instanciamos el servicio de WebSockets de esta manera para que sea un Singleton
    WssService._instance = new WssService(options);
  }

  //? Método que envía un mensaje a todos los clientes conectados al WebSocket Server
  public sendMessage(type: string, payload: Object) {
    //* Enviamos el mensaje a todos los clientes conectados al WebSocket Server, se envía tanto
    //* eltipo del mensaje y el payload que es el contenido del mensaje
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type, payload }));
      }
    });
  }

  //? Método que inicializa el WebSocketServer
  public start() {
    //* Escuchamos el evento de conexión de un cliente
    this.wss.on("connection", (ws: WebSocket) => {
      console.log("Client connected");

      ws.on("close", () => console.log("Client disconnected"));
    });
  }
}
