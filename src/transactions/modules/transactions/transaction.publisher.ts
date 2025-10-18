import type { Kafka } from "kafkajs";
import type { Logger } from "pino";
import { sendKafkaMessage } from "../../messaging/kafka.producer";
import type { KafkaTopics } from "../../messaging/kafka.topics";
import type { TransactionCreatedEvent } from "../../messaging/events";
import type {
  CreateTransactionInput,
  TransactionResponse
} from "./transaction.graphql.types";

export type TransactionCreatedPublisherDeps = {
  kafka: Kafka;
  topics: KafkaTopics;
  logger: Logger;
};

export const publishTransactionCreated = async (
  deps: TransactionCreatedPublisherDeps,
  body: CreateTransactionInput,
  payload: TransactionResponse
) => {
  const event: TransactionCreatedEvent = {
    transactionExternalId: payload.transactionExternalId,
    accountExternalIdDebit: body.accountExternalIdDebit,
    accountExternalIdCredit: body.accountExternalIdCredit,
    transferTypeId: body.transferTypeId,
    value: body.value,
    createdAt: payload.createdAt
  };

  await sendKafkaMessage(
    deps.kafka,
    {
      topic: deps.topics.transactionCreated,
      messages: [
        {
          key: payload.transactionExternalId,
          value: JSON.stringify(event)
        }
      ]
    },
    deps.logger
  );
};
