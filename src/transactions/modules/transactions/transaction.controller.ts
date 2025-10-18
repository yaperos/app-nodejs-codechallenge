import type { FastifyReply, FastifyRequest } from "fastify";
import type { PrismaClient } from "@prisma/client";
import type { Kafka } from "kafkajs";
import type { Logger } from "pino";
import {
  createTransactionBodySchema,
  createTransactionHeadersSchema,
  transactionIdParamsSchema
} from "./transaction.schemas.js";
import { createTransactionService, TransactionNotFoundError } from "./transaction.service.js";
import type { KafkaTopics } from "../../messaging/kafka.topics.js";
import { publishTransactionCreated } from "./transaction.publisher.js";

export type TransactionControllerDeps = {
  prisma: PrismaClient;
  logger: Logger;
  kafka: Kafka;
  topics: KafkaTopics;
};

export const createTransactionController = (deps: TransactionControllerDeps) => {
  const service = createTransactionService({ prisma: deps.prisma, logger: deps.logger });
  const log = deps.logger.child({ module: "transactions-controller" });

  const create = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = createTransactionBodySchema.parse(request.body);
    const headers = createTransactionHeadersSchema.parse(request.headers);

    log.info({ idempotencyKey: headers["idempotency-key"] }, "creating transaction");

    const payload = await service.create(body, headers);

    await publishTransactionCreated(
      {
        kafka: deps.kafka,
        topics: deps.topics,
        logger: log
      },
      body,
      payload
    );

    return reply.code(201).send(payload);
  };

  const get = async (request: FastifyRequest, reply: FastifyReply) => {
    const params = transactionIdParamsSchema.parse(request.params);

    try {
      const payload = await service.getByExternalId(params.transactionExternalId);
      return reply.send(payload);
    } catch (error) {
      if (error instanceof TransactionNotFoundError) {
        log.warn({ transactionExternalId: params.transactionExternalId }, "transaction not found");
        return reply.status(404).send({ message: "Transaction not found" });
      }

      throw error;
    }
  };

  return { create, get };
};
