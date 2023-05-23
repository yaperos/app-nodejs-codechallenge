import { EventManager } from "@app-nodejs-codechallenge/shared-lib";
import { Kafka, Partitioners } from "kafkajs";
import { z } from "zod";
import { repository } from "../repository/index";
import { TransactionsService } from "./transactions-service";

const env = z
  .object({
    KAFKA_BROKERS: z.string(),
  })
  .parse(process.env);

export const service = new TransactionsService({
  repository: repository,
  eventManager: new EventManager({
    microservice: "transactions",
    kafkaProducer: new Kafka({
      clientId: "transactions-ms",
      brokers: env.KAFKA_BROKERS.split(","),
    }).producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    }),
  }),
});
