import { EventManager, configurationNumber } from "libs/src";
import { producer } from "../kafka";
import { AntifraudServiceImpl } from "./AntifraudServiceImpl";

export const antifraudService = new AntifraudServiceImpl({
  kafkaEventManager: new EventManager({
    kafkaProducer: producer,
    microservice: "antifraud",
  }),
  featureFlags: {
    maxAmount: configurationNumber(process.env.TRANSACTION_MAX_AMOUNT),
  },
});
