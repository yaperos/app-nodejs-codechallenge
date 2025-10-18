import type { Kafka } from "kafkajs";
import type { Logger } from "pino";
import { sendKafkaMessage } from "../../messaging/kafka.producer.js";
import type { KafkaTopics } from "../../messaging/kafka.topics.js";
import type { TransactionCreatedEvent } from "../../messaging/events.js";
import type {
  CreateTransactionBody,
  TransactionResponse
} from "./transaction.schemas.js";

export type TransactionCreatedPublisherDeps = {
  kafka: Kafka;
  topics: KafkaTopics;
  logger: Logger;
};

export const publishTransactionCreated = async (
  deps: TransactionCreatedPublisherDeps,
  body: CreateTransactionBody,
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
