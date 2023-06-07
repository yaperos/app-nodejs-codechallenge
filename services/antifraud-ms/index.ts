import "dotenv/config";
import { ErrorFactory, KafkaEvent, getKafkaEvent } from "libs/src";
import { antifraudHandler } from "./src/handlers";
import { startKafkaConsumer } from "./src/kafka";

const app = async () => {
  try {
    await startKafkaConsumer(async ({ topic, message }) => {
      const event: KafkaEvent = getKafkaEvent(topic, message);
      await antifraudHandler(event);
    });
  } catch (error) {
    throw ErrorFactory.create(error);
  }
};

app();
