import express, { Express } from "express";
import { IDatabaseService } from "../../infrastructure";
import { errorHandler } from "../../middleware";
import { IMainRouter } from "../../router/router.interface";

type dependencies = {
  mainRouter: IMainRouter;
  dbService: IDatabaseService;
};

class Server {
  readonly serverApp: Express;
  private _mainRouter: IMainRouter;
  private _dbService: IDatabaseService;

  public get server(): Express {
    return this.serverApp;
  }

  constructor({ mainRouter, dbService }: dependencies) {
    this._mainRouter = mainRouter;
    this._dbService = dbService;

    this.serverApp = express();
  }

  private configureMiddlewares() {
    this.server.use(express.json());
  }

  async starUp() {
    this.configureMiddlewares();

    const serverPort = process.env.SERVER_PORT ?? 8080;

    this._mainRouter.setupRouters(this.serverApp);

    this.serverApp.use(errorHandler);

    await this._dbService.connect();

    this.serverApp.listen(serverPort, () => {
      console.info(`Server running on port ${serverPort}`);
    });
  }
}

export default Server;
