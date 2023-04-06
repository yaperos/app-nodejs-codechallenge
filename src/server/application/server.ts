import * as dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";

class Server {
  private serverApp: Express;

  public get server(): Express {
    return this.serverApp;
  }

  constructor() {
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

    // TODO: Remove the mock endpoint
    this.server.get("/", (_: Request, res: Response, __: NextFunction) => {
      return res.json({
        message: "Hello world",
      });
    });

    this.server.listen(serverPort, () => {
      console.log(`Server running on port ${serverPort}`);
    });
  }
}

export default Server;
