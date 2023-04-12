import cors from "cors";
import express, { Express } from "express";
import { GraphQLServer } from "../../graphql";
import { IDatabaseService } from "../../infrastructure";

type dependencies = {
  dbService: IDatabaseService;
  graphqlServer: GraphQLServer;
};

class Server {
  readonly serverApp: Express;
  private _dbService: IDatabaseService;
  private _graphqlServer: GraphQLServer;

  public get server(): Express {
    return this.serverApp;
  }

  constructor({ dbService, graphqlServer }: dependencies) {
    this._dbService = dbService;
    this._graphqlServer = graphqlServer;

    this.serverApp = express();
  }

  private configureMiddlewares() {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));

    this._graphqlServer.setup(this.server);
  }

  async starUp() {
    this.configureMiddlewares();

    const serverPort = process.env.SERVER_PORT ?? 8080;

    await this._dbService.connect();

    this.serverApp.listen(serverPort, () => {
      console.info(`Server running on port ${serverPort}`);
    });
  }
}

export default Server;
