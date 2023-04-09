import * as dotenv from "dotenv";
import { TransactionHandler } from "./handler";
import { PostgreSQLDatabaseService } from "./infrastructure";
import { MainRouter, TransactionRouter } from "./router";
import Server from "./server/application/server";

dotenv.config();

function initializeApp() {
  const dbService = PostgreSQLDatabaseService.getInstance();

  const transactionRouter = new TransactionRouter({
    transactionHandler: new TransactionHandler({
      dbService,
    }),
  });

  const server = new Server({
    dbService,
    mainRouter: new MainRouter({ transactionRouter }),
  });

  server.starUp();
}

initializeApp();
