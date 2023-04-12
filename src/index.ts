import * as dotenv from "dotenv";
import { GraphQLServer } from "./graphql";
import {
  TransactionAntiFraudResponseHandler,
  TransactionHandler,
} from "./handler";
import { IDatabaseService, PostgreSQLDatabaseService } from "./infrastructure";
import { CacheService, ICacheService } from "./infrastructure/cache";
import { KafkaEventService } from "./infrastructure/event";
import Server from "./server/application/server";

dotenv.config();

export const dbService: IDatabaseService =
  PostgreSQLDatabaseService.getInstance();
export const cacheService: ICacheService = CacheService.getInstance();

async function initializeApp() {
  const eventService = new KafkaEventService();
  const transactionHandler = new TransactionHandler({
    eventService,
  });

  const graphqlServer = GraphQLServer.instance({ transactionHandler });
  await eventService.setupEvents({
    transactionAntiFraudResponseHandler:
      new TransactionAntiFraudResponseHandler(),
  });

  const server = new Server({
    dbService,
    graphqlServer,
  });

  server.starUp();
}

initializeApp();
