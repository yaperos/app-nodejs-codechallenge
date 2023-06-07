import { KafkaEvent } from "libs";
import { controller } from "../controller";

export const antifraudHandler = async (event: KafkaEvent) => {
  if (event.topic === "transaction.create.done") {
    await controller.processVerifyTransaction(event);
  }

  return Promise.resolve();
};
