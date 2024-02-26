import dotenv from "dotenv";
import { evaluateTransaction } from "./service";
import {
  TOPIC_EVENT_CREATED,
  TOPIC_EVENT_EVALUATED,
} from "@my-org/common-tools";
import { KafkaNodeProducer } from "./kafka/kafka-node.producer";
import { KafkaNodeConsumer } from "./kafka/kafka-node.consumer";

dotenv.config();

const main = async () => {
  const producer = new KafkaNodeProducer(
    TOPIC_EVENT_EVALUATED,
    process.env.KAFKA_BROKER || "localhost:9092"
  );

  const consumer = new KafkaNodeConsumer(
    TOPIC_EVENT_CREATED,
    process.env.KAFKA_BROKER || "localhost:9092"
  );

  await consumer.consume(async (message) => {
    //Get transaction created event from event-created topic
    const receivedEvent = JSON.parse((message || "").toString());

    // Evaluate transaction created event
    receivedEvent.transactionStatusId = evaluateTransaction(
      receivedEvent.value
    );

    // Emit evaluated event to Kafka
    await producer.produce(receivedEvent);
  });
};

main();
