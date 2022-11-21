import express, { Application, Request, Response, Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import container from './config/dependency-injection';
//import NatsDomainEventsConsumer from '../../../Contexts/Shared/infrastructure/EventBus/nats/NatsDomainEventsConsumer';
import Configuration from './config';
import { RoutesManager } from './routes/RoutesManager';

export default class App {
  private readonly app: Application;

  constructor() {
    this.app = express();
    this.setConfig();
  }

  private setConfig() {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(morgan('combined'));
    this.setRoutes();

    this.app.use((request: Request, response: Response) => {
      response.status(404).json();
    });
  }

  private setRoutes() {
    const router = Router();
    this.app.use('/', router);
    RoutesManager.run(router);
  }

  private async registerSubscribers(): Promise<void> {
    //const eventBus = container.get('Shared.NatsDomainEventsConsumer') as NatsDomainEventsConsumer;
    //await eventBus.start();
  }

  async start(): Promise<void> {
    //await this.registerSubscribers();
    this.app.listen(Configuration.PORT, () => console.log(`Service listening on port ${Configuration.PORT}`));
  }
}
