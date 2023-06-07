import { HttpEvent, KafkaEvent } from "libs/src";
import { Transaction } from "../domain/Transaction";
import { TransactionServiceI } from "../service/TransactionServiceI";
import {
  TransactionCreateSchema,
  TransactionGetSchema,
  TransactionUpdateSchema,
} from "./Transaction.schema";

export interface TransactionControllerProps {
  service: TransactionServiceI;
}

export class TransactionController {
  constructor(private readonly props: TransactionControllerProps) {}

  async findTransactionById(event: HttpEvent) {
    const request = await TransactionGetSchema.validate(event.params, {
      stripUnknown: true,
    });

    const response = await this.props.service.findTransactionById(
      new Transaction({ transactionExternalId: request.id })
    );
    return response.getApiData();
  }

  async createTransaction(event: HttpEvent) {
    if (!event.body) {
      throw new Error("Body is required");
    }
    const request = await TransactionCreateSchema.validate(event.body, {
      stripUnknown: true,
    });

    const response = await this.props.service.createTransaction(
      new Transaction(request)
    );
    return response.getApiData();
  }

  async processVerifyTransaction(event: KafkaEvent) {
    const request = await TransactionUpdateSchema.validate(
      event.value.transaction,
      { stripUnknown: true }
    );

    const response = await this.props.service.processVerifyTransaction(
      new Transaction(request)
    );
    return response;
  }
}
