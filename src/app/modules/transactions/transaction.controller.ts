import type { FastifyReply, FastifyRequest } from "fastify";
import {
  createTransactionBodySchema,
  createTransactionHeadersSchema,
  transactionIdParamsSchema
} from "./transaction.schemas.js";
import { createTransactionService, TransactionNotFoundError } from "./transaction.service.js";
import type { TransactionServiceDeps } from "./transaction.service.js";

export const createTransactionController = (deps: TransactionServiceDeps) => {
  const service = createTransactionService(deps);
  const log = deps.logger.child({ module: "transactions-controller" });

  const create = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = createTransactionBodySchema.parse(request.body);
    const headers = createTransactionHeadersSchema.parse(request.headers);

    log.info({ idempotencyKey: headers["idempotency-key"] }, "creating transaction");

    const payload = await service.create(body, headers);
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
