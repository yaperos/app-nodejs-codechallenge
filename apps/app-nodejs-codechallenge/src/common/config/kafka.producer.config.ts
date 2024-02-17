import * as dotenv from "dotenv";
import { ClientsModuleOptions, Transport } from "@nestjs/microservices";
import { Partitioners } from "kafkajs";
import * as process from "process";
dotenv.config();

const kafkaProducerConfig: ClientsModuleOptions = [
  {
    name: `KAFKA_PRODUCER_MAIN`,
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: "main",
        brokers: [process.env.KAFKA_HOST],
      },
      producer: {
        createPartitioner: Partitioners.DefaultPartitioner,
      },
      consumer: {
        groupId: "main-consumer",
      },
    },
  },
];

export default kafkaProducerConfig;
