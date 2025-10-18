import type { FastifyInstance } from "fastify";
import { transactionsContainer } from "../../container.js";
import { createTransactionController } from "./transaction.controller.js";

export const registerTransactionRoutes = (app: FastifyInstance) => {
  const controller = createTransactionController({
    prisma: transactionsContainer.prisma,
    logger: transactionsContainer.logger.child({ module: "transactions-service" }),
    kafka: transactionsContainer.kafka,
    topics: transactionsContainer.topics
  });

  app.post("/transactions", controller.create);
  app.get("/transactions/:transactionExternalId", controller.get);
};
