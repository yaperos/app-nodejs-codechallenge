import { config } from "dotenv";
import { Kafka, Partitioners } from "kafkajs";
import { logger } from "./src/domain/bootstrap/logger";
import { ValidateTransaction } from "./src/infraestructure/routes/validate-transaction";

config();

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [
    `${process.env.KAFKA_BROKER_HOST}:${process.env.KAFKA_BROKER_PORT}`,
  ],
});

const consumer = kafka.consumer({ groupId: "yape-1" });
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

const server = async () => {
  logger.log("Anti-fraud service started");
  await consumer.connect();
  await consumer.subscribe({
    topic: "transaction-created",
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      await ValidateTransaction(message, producer);
    },
  });
};

server();
