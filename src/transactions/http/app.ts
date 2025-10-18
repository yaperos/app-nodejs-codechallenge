import Fastify from "fastify";
import type { IResolvers, MercuriusContext } from "mercurius";
import mercurius from "mercurius";
import type { Logger } from "pino";
import { transactionsContainer } from "../container.js";
import { registerTransactionRoutes } from "../modules/transactions/transaction.routes.js";
import { typeDefs } from "../graphql/schema.js";
import { resolvers, type TransactionsGraphqlContext } from "../graphql/resolvers.js";
import { createTransactionService } from "../modules/transactions/transaction.service.js";

export const buildApp = () => {
  const appLogger = transactionsContainer.logger.child({ module: "http" });
  const app = Fastify({
    logger: appLogger as unknown as boolean | Record<string, unknown>
  });

  const mercuriusResolvers = resolvers as unknown as IResolvers<unknown, MercuriusContext>;

  app.get("/health", async (request, reply) => {
    request.log.debug({ route: "health" }, "health check pinged");
    return reply.send({ status: "ok" });
  });

  registerTransactionRoutes(app);

  app.register(mercurius, {
    schema: typeDefs,
    resolvers: mercuriusResolvers,
    graphiql: transactionsContainer.env.NODE_ENV !== "production",
    context: (request): TransactionsGraphqlContext => {
      const logger = request.log.child({ module: "graphql" }) as unknown as Logger;
      return {
        service: createTransactionService({
          prisma: transactionsContainer.prisma,
          logger
        }),
        kafka: transactionsContainer.kafka,
        topics: transactionsContainer.topics,
        logger
      } as unknown as TransactionsGraphqlContext;
    }
  });

  return app;
};
