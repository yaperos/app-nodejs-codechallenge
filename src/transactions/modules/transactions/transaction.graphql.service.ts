import { TransactionStatusName, Prisma } from "@prisma/client";
import { randomUUID, createHash } from "node:crypto";
import { GraphQLError } from "graphql";
import { z } from "zod";
import { withPgTransactionLock } from "../../locks/postgres-lock";
import { publishTransactionCreated } from "./transaction.publisher";
import type {
  TransactionGraphQLServiceDeps,
  CreateTransactionInput,
  TransactionResponse,
  TransactionRecord
} from "./transaction.graphql.types";
import {
  createTransactionArgsSchema,
  transactionQueryArgsSchema
} from "./transaction.graphql.validation";

/**
 * Service that directly implements GraphQL operations.
 * Service methods ARE the GraphQL resolvers.
 */
export class TransactionGraphQLService {
  constructor(private deps: TransactionGraphQLServiceDeps) {}

  /**
   * Query: transaction(transactionExternalId: ID!): Transaction
   * Busca uma transação pelo ID externo
   */
  async transaction(
    _parent: unknown,
    args: { transactionExternalId: string }
  ): Promise<TransactionResponse | null> {
    const { prisma, logger } = this.deps;

    const { transactionExternalId } = this.parseOrThrow(
      transactionQueryArgsSchema,
      args,
      "Invalid transaction query arguments"
    );

    logger.debug({ transactionExternalId }, "querying transaction");

    const record = await prisma.transaction.findUnique({
      where: { externalId: transactionExternalId },
      include: {
        status: true,
        type: true
      }
    });

    if (!record) {
      logger.warn({ transactionExternalId }, "transaction not found");
      return null;
    }

    return this.mapToResponse(record as TransactionRecord);
  }

  /**
   * Query: transactions: [Transaction!]!
   * Lista todas as transações
   */
  async transactions(_parent: unknown, _args: unknown): Promise<TransactionResponse[]> {
    const { prisma, logger } = this.deps;

    logger.debug("querying all transactions");

    const records = await prisma.transaction.findMany({
      include: {
        status: true,
        type: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return records.map((record) => this.mapToResponse(record as TransactionRecord));
  }

  /**
   * Mutation: createTransaction(input: CreateTransactionInput!): Transaction!
   * Cria uma nova transação com idempotência automática
   */
  async createTransaction(
    _parent: unknown,
    args: { input: CreateTransactionInput }
  ): Promise<TransactionResponse> {
    const { prisma, kafka, topics, logger } = this.deps;
    const { input } = this.parseOrThrow(
      createTransactionArgsSchema,
      args,
      "Invalid createTransaction input"
    );

    // Gera idempotency key baseado nos campos da request
    const idempotencyKey = this.generateIdempotencyKey(input);

    const baseLog = logger.child({
      accountDebit: input.accountExternalIdDebit,
      accountCredit: input.accountExternalIdCredit,
      transferTypeId: input.transferTypeId,
      value: input.value,
      idempotencyKey
    });

    baseLog.info("creating transaction");

    // Verifica se já existe uma transação com essa idempotency key
    const existing = await this.findByIdempotencyKey(prisma, idempotencyKey);
    if (existing) {
      baseLog.info("transaction returned from idempotency cache");
      return this.mapToResponse(existing);
    }

    // Cria lock key para evitar race conditions
    const lockKey = this.buildLockKey(input, idempotencyKey);

    // Cria transação dentro de um lock distribuído
    const created = await withPgTransactionLock(
      prisma,
      lockKey,
      async (tx) => {
        // Double-check dentro do lock
        const cached = await this.findByIdempotencyKey(tx, idempotencyKey);
        if (cached) {
          return cached;
        }

        // Cria a transação
        return this.createTransactionRecord(tx, input, idempotencyKey);
      },
      baseLog
    );

    baseLog.info("transaction persisted");

    // Publica evento no Kafka
    await publishTransactionCreated(
      { kafka, topics, logger: baseLog },
      input,
      this.mapToResponse(created)
    );

    return this.mapToResponse(created);
  }

  /**
   * Generates idempotency key based on transaction fields
   */
  private generateIdempotencyKey(input: CreateTransactionInput): string {
    return createHash("sha256")
      .update(
        JSON.stringify({
          accountExternalIdDebit: input.accountExternalIdDebit,
          accountExternalIdCredit: input.accountExternalIdCredit,
          transferTypeId: input.transferTypeId,
          value: input.value
        })
      )
      .digest("hex");
  }

  /**
   * Builds lock key for Postgres advisory lock
   */
  private buildLockKey(input: CreateTransactionInput, idempotencyKey: string): string {
    return [
      "transaction",
      input.accountExternalIdDebit,
      input.accountExternalIdCredit,
      input.transferTypeId,
      input.value,
      idempotencyKey
    ].join(":");
  }

  /**
   * Finds transaction by idempotency key
   */
  private async findByIdempotencyKey(
    client: Prisma.TransactionClient | typeof this.deps.prisma,
    key: string
  ): Promise<TransactionRecord | undefined> {
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

    return record?.transaction as TransactionRecord | undefined;
  }

  /**
   * Creates transaction record in database
   */
  private async createTransactionRecord(
    client: Prisma.TransactionClient,
    input: CreateTransactionInput,
    idempotencyKey: string
  ): Promise<TransactionRecord> {
    const externalId = randomUUID();

    const record = await client.transaction.create({
      data: {
        externalId,
        accountExternalIdDebit: input.accountExternalIdDebit,
        accountExternalIdCredit: input.accountExternalIdCredit,
        status: {
          connect: { name: TransactionStatusName.pending }
        },
        type: {
          connect: { id: input.transferTypeId }
        },
        value: new Prisma.Decimal(input.value),
        idempotencyKey: {
          create: { key: idempotencyKey }
        }
      },
      include: {
        status: true,
        type: true
      }
    });

    return record as TransactionRecord;
  }

  /**
   * Maps database record to GraphQL response
   */
  private mapToResponse(transaction: TransactionRecord): TransactionResponse {
    return {
      transactionExternalId: transaction.externalId,
      transactionType: { name: transaction.type.name },
      transactionStatus: { name: transaction.status.name },
      value: Number(transaction.value),
      createdAt: transaction.createdAt.toISOString()
    };
  }

  private parseOrThrow<T>(schema: z.ZodSchema<T>, data: unknown, contextMessage: string): T {
    const result = schema.safeParse(data);
    if (!result.success) {
      const details = result.error.issues
        .map((issue) => `${issue.path.join(".") || "value"}: ${issue.message}`)
        .join("; ");
      throw new GraphQLError(`${contextMessage}: ${details}`);
    }

    return result.data;
  }
}
