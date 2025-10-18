import { startServer } from "./http/app";
import { disconnectKafkaConsumer } from "./messaging/kafka.consumer";
import { disconnectKafkaProducer } from "./messaging/kafka.producer";
import { startTransactionStatusConsumer } from "./modules/transactions/transaction.consumer";
import { transactionsContainer } from "./container";

const start = async () => {
  const kafkaLogger = transactionsContainer.logger.child({ module: "kafka" });
  const statusConsumer = await startTransactionStatusConsumer({
    kafka: transactionsContainer.kafka,
    env: transactionsContainer.env,
    prisma: transactionsContainer.prisma,
    logger: kafkaLogger.child({ consumer: "transaction-status" })
  });

  const { server, url } = await startServer(transactionsContainer.env.PORT);

  const shutdown = async () => {
    transactionsContainer.logger.info("shutting down transactions service");
    await server.stop();
    await disconnectKafkaConsumer(statusConsumer);
    await disconnectKafkaProducer(transactionsContainer.kafka);
    await transactionsContainer.prisma.$disconnect();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  transactionsContainer.logger.info(
    { url, port: transactionsContainer.env.PORT },
    "transactions GraphQL server is running"
  );
};

start().catch((error) => {
  transactionsContainer.logger.error({ err: error }, "Failed to bootstrap transactions service");
  process.exit(1);
});
