import { KafkaClient, HighLevelProducer } from "kafka-node";
import { KAFKA_CLIENT_ID, KAFKA_HOST } from "../config/constants";

export const kafkaClient = new KafkaClient({
  clientId: KAFKA_CLIENT_ID,
  kafkaHost: KAFKA_HOST,
  connectRetryOptions: {
    maxTimeout: 10,
    minTimeout: 3,
    retries: 2,
  },
});

export const kafkaProducer = new HighLevelProducer(kafkaClient);
