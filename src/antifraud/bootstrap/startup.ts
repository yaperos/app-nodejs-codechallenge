import { disconnectKafkaConsumer } from "../messaging/kafka.consumer.js";
import { disconnectKafkaProducer } from "../messaging/kafka.producer.js";
import { antifraudContainer } from "../container.js";
import { startAntifraudConsumer } from "../modules/antifraud/antifraud.consumer.js";

export const startAntifraudMessaging = async () => {
  const consumer = await startAntifraudConsumer({
    kafka: antifraudContainer.kafka,
    env: antifraudContainer.env,
    logger: antifraudContainer.logger.child({ module: "antifraud-consumer" })
  });

  return async () => {
    await disconnectKafkaConsumer(consumer);
    await disconnectKafkaProducer(antifraudContainer.kafka);
  };
};
