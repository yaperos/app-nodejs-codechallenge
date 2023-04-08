import { TransactionHandler } from "./handler";
import { PostgreSQLDatabaseService } from "./infrastructure";
import { MainRouter, TransactionRouter } from "./router";
import Server from "./server/application/server";

function initializeApp() {
  const transactionRouter = new TransactionRouter({
    transactionHandler: new TransactionHandler(),
  });

  const server = new Server({
    mainRouter: new MainRouter({ transactionRouter }),
    dbService: PostgreSQLDatabaseService.getInstance(),
  });

  server.starUp();
}

initializeApp();
