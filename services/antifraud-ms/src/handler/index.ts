import type { KafkaEvent } from "@app-nodejs-codechallenge/http-lib";
import { controller } from "../controller/index";

export const handler = async (event: KafkaEvent) => {
  if (event.topic === "transactions.create.done") {
    return controller.processTransactionCreateEvent(event);
  }

  throw new Error("Route not found");
};
