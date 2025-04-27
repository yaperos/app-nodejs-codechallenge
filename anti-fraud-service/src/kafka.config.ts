import { KafkaOptions, Transport } from "@nestjs/microservices";
import * as dotenv from "dotenv";

dotenv.config();

export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: "client",
      brokers: [...(process.env.KAFKA_BROKER?.split(",") || "localhost:9092")],
    },
    consumer: {
      groupId: "anti-fraud-consumer-group",
      retry: {
        retries: 2,
        initialRetryTime: 30,
      },
    },
  },
};
