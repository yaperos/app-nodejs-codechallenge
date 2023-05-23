import { EventManager } from "@app-nodejs-codechallenge/shared-lib";
import { Kafka, Partitioners } from "kafkajs";
import { z } from "zod";
import { AntifraudService } from "./antifraud-service";

const env = z
  .object({
    KAFKA_BROKERS: z.string(),
  })
  .parse(process.env);

export const service = new AntifraudService({
  eventManager: new EventManager({
    microservice: "antifraud",
    kafkaProducer: new Kafka({
      clientId: "antifraud-ms",
      brokers: env.KAFKA_BROKERS.split(","),
    }).producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    }),
  }),
});
