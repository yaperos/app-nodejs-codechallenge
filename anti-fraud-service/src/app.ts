import Express, { Application } from 'express';
import { Server } from 'http';
import environment from './environment';
import { EventStreamer } from './config/event.streamer.interface';
import { buildTransactionConsumers } from './modules/transaction/transaction.consumers';
import { appContainer } from './config/inversify.container';
import { Symbols } from './@types';

export class App {
  /** Express application instance */
  private app: Application;

  /** Event Streamer instance */
  private eventStreamer?: EventStreamer;

  // eslint-disable-next-line no-unused-vars
  constructor(private port?: number | string) {
    // Create express application
    this.app = Express();

    // Setup settings
    this.settings();
  }

  settings() {
    // Set port
    this.app.set('port', this.port || environment.PORT || 3005);
  }

  async setup() {
    // Get event streamer instance
    this.eventStreamer = appContainer.get<EventStreamer>(Symbols.EventStreamer);

    // Setup Transaction consumers
    await buildTransactionConsumers();
  }

  close(server: Server) {
    // Close server
    server.close(() => {
      console.info('Server closed');

      // Close event streamer connections
      this.eventStreamer?.closeConnections().then(() => console.info('Event streamer connections closed'));

      // Remove container bindings
      appContainer.unbindAll();
    });
  }

  async start() {
    // Call setup method
    await this.setup();

    // Get defined app port
    const port = this.app.get('port');

    // Start express server
    const server = this.app.listen(port);
    console.info('App running on port', port);

    // Define server end callbacks
    process.on('SIGTERM', () => this.close(server));
    process.on('SIGINT', () => this.close(server));
  }
}
