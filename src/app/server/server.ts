import http from 'http';
import dotenv from 'dotenv';
import { serverService } from '../utils/serverService.ts';
import { getRequest } from './requests/get.ts';
dotenv.config();

export class CreateServer {
  private port: number;
  constructor(port: number) {
    this.port = port;
  }

  startServer = () => {
    const server = http.createServer();
    server.listen(this.port);
    serverService.setServer(server);
    getRequest.processGet();
  };
}

export const createServer = new CreateServer(Number(process.env['PORT']));
