import * as dotenv from "dotenv";
import express, { Express } from "express";
import { IMainRouter } from "../../router/router.interface";

type dependencies = {
  mainRouter: IMainRouter;
};

class Server {
  readonly serverApp: Express;
  private _mainRouter: IMainRouter;

  public get server(): Express {
    return this.serverApp;
  }

  constructor({ mainRouter }: dependencies) {
    this._mainRouter = mainRouter;

    this.serverApp = express();
  }

  private setupEnvVariables() {
    dotenv.config();
  }

  private configureMiddlewares() {
    this.server.use(express.json());
  }

  starUp() {
    this.setupEnvVariables();
    this.configureMiddlewares();

    const serverPort = process.env.SERVER_PORT ?? 8080;

    this._mainRouter.setupRouters(this.serverApp);

    this.serverApp.listen(serverPort, () => {
      console.log(`Server running on port ${serverPort}`);
    });
  }
}

export default Server;
