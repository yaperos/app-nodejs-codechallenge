import Express, { Application } from 'express';
import { config } from 'dotenv';
import { Server } from 'http';
import { TransactionService } from './modules/transaction/transaction.service';
import { TransactionController } from './modules/transaction/transaction.controller';
import { KafkaClient } from './config/kafka';
import { EventStreamer } from './config/event.streamer.interface';

export class App {
  private app: Application;

  private eventStreamer?: EventStreamer;

  // eslint-disable-next-line no-unused-vars
  constructor(private port?: number | string) {
    this.app = Express();
    config();
    this.settings();
  }

  settings() {
    this.app.set('port', this.port || process.env.PORT || 3005);
  }

  async setup() {
    // Create new event streamer instance
    const kafka = new KafkaClient('transactions-app', process.env.KAFKA_HOST_URL ?? '');
    this.eventStreamer = kafka;

    const service = new TransactionService(kafka);
    const controller = new TransactionController(service);

    kafka.createSubscription({
      topic: 'transaction-created',
    }, (message) => {
      controller.handleTransactionValidation(message.value?.toString() ?? '');
    });
  }

  close(server: Server) {
    server.close(() => {
      console.info('Server closed');
      this.eventStreamer?.closeConnections().then(() => console.info('Event streamer connections closed'));
    });
  }

  async start() {
    this.setup();
    const port = this.app.get('port');
    const server = this.app.listen(port);
    console.info('App running on port', port);

    process.on('SIGTERM', () => this.close(server));
    process.on('SIGINT', () => this.close(server));
  }
}
