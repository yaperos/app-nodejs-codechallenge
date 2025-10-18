import type { FastifyInstance } from "fastify";
import { container } from "../../config/di.js";
import { createTransactionController } from "./transaction.controller.js";

export const registerTransactionRoutes = (app: FastifyInstance) => {
  const controller = createTransactionController({
    prisma: container.prisma,
    logger: container.logger.child({ module: "transactions-service" })
  });

  app.post("/transactions", controller.create);
  app.get("/transactions/:transactionExternalId", controller.get);
};
