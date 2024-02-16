import * as dotenv from "dotenv";
import { ClientsModuleOptions, Transport } from "@nestjs/microservices";
import { Partitioners } from "kafkajs";
import * as process from "process";
dotenv.config();

const kafkaProducerConfig: ClientsModuleOptions = [
  {
    name: process.env.KAFKA_PRODUCER_NAME,
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_ID,
        brokers: [process.env.KAFKA_HOST],
      },
      producer: {
        createPartitioner: Partitioners.DefaultPartitioner,
      },
    },
  },
];

export default kafkaProducerConfig;
