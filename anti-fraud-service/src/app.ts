import Express, { Application } from 'express';
import { Server } from 'http';
import environment from './environment';
import { EventStreamer } from './config/event.streamer.interface';
import { buildTransactionConsumers } from './modules/transaction/transaction.consumers';
import { appContainer } from './config/inversify.container';
import { Symbols } from './@types';

export class App {
  private app: Application;

  private eventStreamer?: EventStreamer;

  // eslint-disable-next-line no-unused-vars
  constructor(private port?: number | string) {
    this.app = Express();
    this.settings();
  }

  settings() {
    this.app.set('port', this.port || environment.PORT || 3005);
  }

  async setup() {
    // Get event streamer
    this.eventStreamer = appContainer.get<EventStreamer>(Symbols.EventStreamer);

    // Setup Transaction consumers
    await buildTransactionConsumers();
  }

  close(server: Server) {
    server.close(() => {
      console.info('Server closed');
      this.eventStreamer?.closeConnections().then(() => console.info('Event streamer connections closed'));
      appContainer.unbindAll();
    });
  }

  async start() {
    await this.setup();
    const port = this.app.get('port');
    const server = this.app.listen(port);
    console.info('App running on port', port);

    process.on('SIGTERM', () => this.close(server));
    process.on('SIGINT', () => this.close(server));
  }
}
