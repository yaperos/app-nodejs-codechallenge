import { disconnectKafkaConsumer } from "../messaging/kafka.consumer.js";
import { disconnectKafkaProducer } from "../messaging/kafka.producer.js";
import { transactionsContainer } from "../container.js";
import { startTransactionStatusConsumer } from "../modules/transactions/transaction.consumer.js";

export const startMessaging = async () => {
  const kafkaLogger = transactionsContainer.logger.child({ module: "kafka" });

  const statusConsumer = await startTransactionStatusConsumer({
    kafka: transactionsContainer.kafka,
    env: transactionsContainer.env,
    prisma: transactionsContainer.prisma,
    logger: kafkaLogger.child({ consumer: "transaction-status" })
  });

  return async () => {
    await disconnectKafkaConsumer(statusConsumer);
    await disconnectKafkaProducer(transactionsContainer.kafka);
  };
};
