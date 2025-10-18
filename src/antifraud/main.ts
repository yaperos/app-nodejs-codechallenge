import { antifraudContainer } from "./container";
import { disconnectKafkaConsumer } from "./messaging/kafka.consumer";
import { disconnectKafkaProducer } from "./messaging/kafka.producer";
import { startAntifraudConsumer } from "./modules/antifraud/antifraud.consumer";

const start = async () => {
  const consumer = await startAntifraudConsumer({
    kafka: antifraudContainer.kafka,
    env: antifraudContainer.env,
    logger: antifraudContainer.logger.child({ module: "antifraud-consumer" })
  });

  const shutdown = async () => {
    antifraudContainer.logger.info("shutting down antifraud service");
    await disconnectKafkaConsumer(consumer);
    await disconnectKafkaProducer(antifraudContainer.kafka);
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  antifraudContainer.logger.info("antifraud consumer is running");
};

start().catch((error) => {
  antifraudContainer.logger.error({ err: error }, "Failed to bootstrap antifraud service");
  process.exit(1);
});
