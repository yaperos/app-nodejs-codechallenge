import * as dotenv from "dotenv";
import {
  TransactionAntiFraudResponseHandler,
  TransactionHandler,
} from "./handler";
import { IDatabaseService, PostgreSQLDatabaseService } from "./infrastructure";
import { KafkaEventService } from "./infrastructure/event";
import { MainRouter, TransactionRouter } from "./router";
import Server from "./server/application/server";

dotenv.config();

export const dbService: IDatabaseService =
  PostgreSQLDatabaseService.getInstance();

async function initializeApp() {
  const eventService = new KafkaEventService();
  await eventService.setupEvents({
    transactionAntiFraudResponseHandler:
      new TransactionAntiFraudResponseHandler(),
  });

  const transactionRouter = new TransactionRouter({
    transactionHandler: new TransactionHandler({
      eventService,
    }),
  });

  const server = new Server({
    dbService,
    mainRouter: new MainRouter({ transactionRouter }),
  });

  server.starUp();
}

initializeApp();
