import { Server } from './Server';
import config from '../config';

export class Run {
  server?: Server;

  async start() {
    this.server = new Server(Number(config.PORT));
    return this.server.listen();
  }

  async stop() {
    return this.server?.stop();
  }

  get httpServer() {
    return this.server?.getHTTPServer();
  }
}
