import { Prisma, PrismaClient, TransactionStatusName } from "@prisma/client";
import { v4 as uuid } from "uuid";
import type { Logger } from "pino";
import {
  CreateTransactionBody,
  CreateTransactionHeaders,
  TransactionResponse
} from "./transaction.schemas.js";
import { HIGH_VALUE_THRESHOLD, TransactionRecord } from "./transaction.types.js";
import { withPgTransactionLock } from "../../utils/locks/postgres-lock.js";

export class TransactionNotFoundError extends Error {}

export type TransactionServiceDeps = {
  prisma: PrismaClient;
  logger: Logger;
  lock?: typeof withPgTransactionLock;
};

const mapToResponse = (transaction: TransactionRecord): TransactionResponse => ({
  transactionExternalId: transaction.externalId,
  transactionType: { name: transaction.type.name },
  transactionStatus: { name: transaction.status.name },
  value: Number(transaction.value),
  createdAt: transaction.createdAt.toISOString()
});

const buildLockKey = (body: CreateTransactionBody, idempotencyKey: string) =>
  [
    "transaction",
    body.accountExternalIdDebit,
    body.accountExternalIdCredit,
    body.transferTypeId,
    body.value,
    idempotencyKey
  ].join(":");

const findByExternalId = async (
  client: Prisma.TransactionClient | PrismaClient,
  externalId: string
): Promise<TransactionRecord | undefined> => {
  const record = await client.transaction.findUnique({
    where: { externalId },
    include: {
      status: true,
      type: true
    }
  });

  return record ?? undefined;
};

const findByIdempotencyKey = async (
  client: Prisma.TransactionClient | PrismaClient,
  key: string
): Promise<TransactionRecord | undefined> => {
  const record = await client.idempotencyKey.findUnique({
    where: { key },
    include: {
      transaction: {
        include: {
          status: true,
          type: true
        }
      }
    }
  });

  return record?.transaction ?? undefined;
};

const createTransaction = async (
  client: Prisma.TransactionClient,
  body: CreateTransactionBody,
  idempotencyKey: string
): Promise<TransactionRecord> => {
  const externalId = uuid();

  return client.transaction.create({
    data: {
      externalId,
      accountExternalIdDebit: body.accountExternalIdDebit,
      accountExternalIdCredit: body.accountExternalIdCredit,
      status: {
        connect: { name: TransactionStatusName.pending }
      },
      type: {
        connect: { id: body.transferTypeId }
      },
      value: new Prisma.Decimal(body.value),
      idempotencyKey: {
        create: { key: idempotencyKey }
      }
    },
    include: {
      status: true,
      type: true
    }
  });
};

export const createTransactionService = ({
  prisma,
  logger,
  lock = withPgTransactionLock
}: TransactionServiceDeps) => {
  const create = async (
    body: CreateTransactionBody,
    headers: CreateTransactionHeaders
  ): Promise<TransactionResponse> => {
    const idempotencyKey = headers["idempotency-key"];
    const baseLog = logger.child({
      accountDebit: body.accountExternalIdDebit,
      accountCredit: body.accountExternalIdCredit,
      transferTypeId: body.transferTypeId,
      value: body.value,
      idempotencyKey
    });

    baseLog.info("transaction create requested");

    const existing = await findByIdempotencyKey(prisma, idempotencyKey);
    if (existing) {
      baseLog.info("transaction returned from idempotency cache");
      return mapToResponse(existing);
    }

    const lockKey = buildLockKey(body, idempotencyKey);

    const created = await lock(
      prisma,
      lockKey,
      async (tx) => {
        const cached = await findByIdempotencyKey(tx, idempotencyKey);
        if (cached) {
          return cached;
        }

        return createTransaction(tx, body, idempotencyKey);
      },
      baseLog
    );

    baseLog.info("transaction persisted");
    return mapToResponse(created);
  };

  const getByExternalId = async (externalId: string): Promise<TransactionResponse> => {
    const record = await findByExternalId(prisma, externalId);

    if (!record) {
      throw new TransactionNotFoundError("Transaction not found");
    }

    return mapToResponse(record);
  };

  const isHighValue = (value: number) => value > HIGH_VALUE_THRESHOLD;

  return {
    create,
    getByExternalId,
    isHighValue
  };
};
