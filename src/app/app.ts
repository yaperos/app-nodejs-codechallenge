import Fastify from "fastify";
import { createLogger } from "./config/logger.js";
import { registerTransactionRoutes } from "./modules/transactions/transaction.routes.js";

export const buildApp = () => {
  const app = Fastify({
    logger: createLogger({ module: "http" })
  });

  app.get("/health", async (request, reply) => {
    request.log.debug({ route: "health" }, "health check pinged");
    return reply.send({ status: "ok" });
  });

  registerTransactionRoutes(app);

  return app;
};
