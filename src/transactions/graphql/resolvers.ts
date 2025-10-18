import type { IResolvers, MercuriusContext } from "mercurius";
import type { Kafka } from "kafkajs";
import type { Logger } from "pino";
import type { KafkaTopics } from "../messaging/kafka.topics.js";
import { publishTransactionCreated } from "../modules/transactions/transaction.publisher.js";
import { createTransactionService, TransactionNotFoundError } from "../modules/transactions/transaction.service.js";

export type TransactionsGraphqlContext = MercuriusContext & {
  service: ReturnType<typeof createTransactionService>;
  kafka: Kafka;
  topics: KafkaTopics;
  logger: Logger;
};

export const resolvers: IResolvers<unknown, TransactionsGraphqlContext> = {
  Query: {
    transaction: async (_, args: { transactionExternalId: string }, context) => {
      try {
        return await context.service.getByExternalId(args.transactionExternalId);
      } catch (error) {
        if (error instanceof TransactionNotFoundError) {
          context.logger.warn(
            { transactionExternalId: args.transactionExternalId },
            "graphql transaction not found"
          );
          return null;
        }

        throw error;
      }
    }
  },
  Mutation: {
    createTransaction: async (
      _,
      args: { input: Parameters<TransactionsGraphqlContext["service"]["create"]>[0]; idempotencyKey: string },
      context
    ) => {
      const payload = await context.service.create(args.input, {
        "idempotency-key": args.idempotencyKey
      });

      await publishTransactionCreated(
        {
          kafka: context.kafka,
          topics: context.topics,
          logger: context.logger.child({ source: "graphql" })
        },
        args.input,
        payload
      );

      return payload;
    }
  }
};
