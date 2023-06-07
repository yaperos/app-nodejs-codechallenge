import { HttpEvent, KafkaEvent } from "libs";
import { controller } from "../controller";

export const transactionHandler = async (event: HttpEvent | KafkaEvent) => {
  if ("routerPath" in event) {
    if (event.routerPath === "/transaction" && event.method === "POST") {
      const response = await controller.createTransaction(event);
      return response;
    }

    if (event.routerPath === "/transaction/:id" && event.method === "GET") {
      const response = await controller.findTransactionById(event);
      return response;
    }
  }

  if ("topic" in event) {
    if (event.topic === "antifraud.transaction.update.done") {
      const response = await controller.processVerifyTransaction(event);
      return response;
    }
  }

  return Promise.resolve();
};
