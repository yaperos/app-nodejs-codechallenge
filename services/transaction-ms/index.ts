import "dotenv/config";
import { KafkaEvent, configurationNumber, getKafkaEvent } from "libs/src";
import { fastify } from "./src/fastify";
import { transactionHandler } from "./src/handlers";
import { startKafkaConsumer } from "./src/kafka";

const app = async () => {
  try {
    await Promise.all([
      fastify.listen({
        port: configurationNumber(process.env.FASTIFY_PORT),
      }),
      startKafkaConsumer(async ({ topic, message }) => {
        const event: KafkaEvent = getKafkaEvent(topic, message);
        await transactionHandler(event);
      }),
    ]);
  } catch (error) {
    fastify.log.error(error);
  }
};

app();
