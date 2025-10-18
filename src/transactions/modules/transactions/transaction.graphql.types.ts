import type { PrismaClient, TransactionStatusName, Prisma } from "@prisma/client";
import type { Kafka } from "kafkajs";
import type { Logger } from "pino";
import type { KafkaTopics } from "../../messaging/kafka.topics";

export type TransactionGraphQLServiceDeps = {
  prisma: PrismaClient;
  kafka: Kafka;
  topics: KafkaTopics;
  logger: Logger;
};

export type CreateTransactionInput = {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
};

export type TransactionResponse = {
  transactionExternalId: string;
  transactionType: { name: string };
  transactionStatus: { name: string };
  value: number;
  createdAt: string;
};

export type TransactionRecord = {
  externalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  value: Prisma.Decimal;
  createdAt: Date;
  status: { id: string; name: TransactionStatusName };
  type: { id: number; name: string };
};
