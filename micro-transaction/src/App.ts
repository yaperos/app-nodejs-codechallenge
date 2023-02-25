import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import helmet from 'helmet';
import * as morgan from 'morgan';
import * as errorHandler from './helpers/error.helper';
import { CONFIG } from './utils/environments';
import { initDatabases } from './database';

class App {
  public swaggerObject: object = {};
  public express: any;
  private config: any;
  private basePath: string;
  private artifact: any;

  constructor() {
    // this.basePath = this.config.metadata.environment === 'local' ? '' : `/${this.config.metadata.service}`;
    this.basePath = '';
    this.artifact = {};
    this.express = express();
    this.initDatabases();
    this.setMiddlewares();
    this.setRoutes();
    this.catchErrors();
  }

  private initDatabases(): void {
    initDatabases();
  }

  private setMiddlewares(): void {
    this.express.use(cors({ credentials: true, origin: false }));
    const morganStream = {
      write: (text: string) => {
        console.log('info', text);
      },
    };
    this.express.use(
      morgan('dev', {
        stream: morganStream,
        skip: (_, res) => {
          return res.statusCode < 400;
        },
      })
    );

    this.express.use((req, res, next) => {
      // Cross-origin cookies
      res.header('Access-Control-Allow-Credentials', true);
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
      res.header(
        'Access-Control-Allow-Headers',
        'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization, x-auth-token'
      );
      next();
    });
    this.express.use(cookieParser());
    this.express.use(express.json({ limit: '50mb' }));
    this.express.use(express.urlencoded({ limit: '50mb', extended: false }));
    this.express.use(helmet());
  }

  private setRoutes(): void {
    // HEALTH CHECK
    this.express.get('/', (_, res) => {
      res.status(200).send(`Welcome to ${CONFIG.APP.NAME}`);
    });

    // API ROUTES
    const apiV1 = require('./api/v1');
    this.express.use(`${this.basePath}/v1`, apiV1.default);
  }

  private catchErrors(): void {
    this.express.use(errorHandler.notFound);
    this.express.use(errorHandler.errorHandler);
  }
}

const app = new App();

export default app.express;
