import type {
  HttpProxyEvent,
  KafkaEvent,
} from "@app-nodejs-codechallenge/http-lib";
import { Transaction } from "../domain/transaction";
import { TransactionsServiceI } from "../service/transactions-service.interface";
import {
  createTransactionSchema,
  processAntifraudUpdateSchema,
  readTransactionSchema,
} from "./transactions-controller.schema";

export type TransactionsControllerProps = {
  service: TransactionsServiceI;
};

export class TransactionsController {
  constructor(private readonly props: TransactionsControllerProps) {}

  createTransaction(event: HttpProxyEvent): Promise<Transaction> {
    const request = createTransactionSchema.parse(event);
    const transaction = new Transaction(request);
    return this.props.service.createTransaction(transaction);
  }

  readTransaction(event: HttpProxyEvent): Promise<Transaction> {
    const request = readTransactionSchema.parse(event);
    return this.props.service.readTransaction(request);
  }

  processTransactionUpdateEvent(event: KafkaEvent) {
    const request = processAntifraudUpdateSchema.parse(event);
    return this.props.service.processTransactionUpdateEvent(request);
  }
}
