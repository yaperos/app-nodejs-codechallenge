import { EventManager } from "libs/src";
import { producer } from "../kafka";
import { transactionRepository } from "../repository";
import { TransactionServiceImpl } from "./TransactionServiceImpl";

export const transactionService = new TransactionServiceImpl({
  repository: transactionRepository,
  kafkaEventManager: new EventManager({
    kafkaProducer: producer,
    microservice: "transaction",
  }),
});
