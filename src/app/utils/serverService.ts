import * as http from 'http';

class ServerService {
  private server:
    | http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
    | undefined;

  setServer(server: http.Server) {
    this.server = server;
  }

  getServer() {
    return this.server || undefined;
  }
}

export const serverService = new ServerService();