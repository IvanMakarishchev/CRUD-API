import * as http from 'http';
// import { getRequest } from './requests/get.ts';
import { PORT } from '../constants/environment.ts';
import { serverService } from '../utils/serverService.ts';
import { getRequest } from './requests/get.ts';

export class CreateServer {
  private port: number;
  constructor(port: number) {
    this.port = port;
  }

  startServer = () => {
    const server = http.createServer();
    server.listen(this.port)
    serverService.setServer(server);
    getRequest.processGet();
  };
}

export const createServer = new CreateServer(PORT);