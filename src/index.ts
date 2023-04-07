import { TransactionHandler } from "./handler";
import { MainRouter, TransactionRouter } from "./router";
import Server from "./server/application/server";

function initializeApp() {
  const transactionRouter = new TransactionRouter({
    transactionHandler: new TransactionHandler(),
  });

  const mainRouter = new MainRouter({ transactionRouter });

  const server = new Server({ mainRouter });

  server.starUp();
}

initializeApp();
