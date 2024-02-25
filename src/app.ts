import { createServer } from 'http';
import { envs } from './config/envs';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { WssService } from './services/wss.service';


(async()=> {
  main();
})();


function main() {
  //* Servidor de express 
  const server = new Server({
    port: envs.PORT,
  });
  //* Servidor de http que recibe el servidor de express 
  const httpServer = createServer(server.app);
  //* Inicializamos el servicio de WebSockets
  WssService.initWss({ server: httpServer });
  //* Agregamos las rutas al servidor de express despues de haber inicializado el servicio de WebSockets
  server.setRoutes(AppRoutes.routes);

  //* Corriendo el servidor http 
  httpServer.listen(envs.PORT, () => {
    console.log(`Server running on port ${envs.PORT}`);
  });
}