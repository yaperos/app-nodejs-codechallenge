import 'dotenv/config';
import assert from 'assert';
import { KafkaConsumerService } from "@common-txn/di"

async function main() {
  assert.ok(process.env.KAFKA_BROKERS, "Undefined kafka brokers");
  const kafkaBrokers = process.env.KAFKA_BROKERS.split(",");

  assert.ok(process.env.TOPIC_CREATE_TXN, "Undefined kafka topic");
  const kafkaTopic = process.env.TOPIC_CREATE_TXN;

  const consumer = new KafkaConsumerService(
    "create-txn-consumer-client",
    kafkaBrokers,
    kafkaTopic
  );

  await consumer.run();
}

main()
  .catch((err: Error) => console.error(err.stack || err.message))