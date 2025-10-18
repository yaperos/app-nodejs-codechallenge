import { buildApp } from "./http/app.js";
import { disconnectKafkaConsumer } from "./messaging/kafka.consumer.js";
import { disconnectKafkaProducer } from "./messaging/kafka.producer.js";
import { startTransactionStatusConsumer } from "./modules/transactions/transaction.consumer.js";
import { transactionsContainer } from "./container.js";

const start = async () => {
  const app = buildApp();

  const kafkaLogger = transactionsContainer.logger.child({ module: "kafka" });
  const statusConsumer = await startTransactionStatusConsumer({
    kafka: transactionsContainer.kafka,
    env: transactionsContainer.env,
    prisma: transactionsContainer.prisma,
    logger: kafkaLogger.child({ consumer: "transaction-status" })
  });

  const shutdown = async () => {
    transactionsContainer.logger.info("shutting down transactions service");
    await app.close();
    await disconnectKafkaConsumer(statusConsumer);
    await disconnectKafkaProducer(transactionsContainer.kafka);
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  await app.listen({
    host: "0.0.0.0",
    port: transactionsContainer.env.PORT
  });

  transactionsContainer.logger.info(
    { port: transactionsContainer.env.PORT },
    "transactions HTTP server is running"
  );
};

start().catch((error) => {
  transactionsContainer.logger.error({ err: error }, "Failed to bootstrap transactions service");
  process.exit(1);
});
