import type {
  HttpProxyEvent,
  KafkaEvent,
} from "@app-nodejs-codechallenge/http-lib";
import { controller } from "../controller/index";

export const handler = async (event: HttpProxyEvent | KafkaEvent) => {
  if ("route" in event) {
    if (event.method === "GET" && event.route === "/transactions/:id") {
      return controller.readTransaction(event);
    }
    if (event.method === "POST" && event.route === "/transactions") {
      return controller.createTransaction(event);
    }
  }

  if ("topic" in event) {
    if (event.topic === "antifraud.update.done") {
      return controller.processTransactionUpdateEvent(event);
    }
  }

  throw new Error("Route not found");
};
