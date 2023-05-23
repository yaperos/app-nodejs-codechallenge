import {
  BadRequestError,
  EventManager,
} from "@app-nodejs-codechallenge/shared-lib";
import { Antifraud } from "../domain/antifraud";
import { Transaction } from "../domain/transaction";
import type { TransactionsRepositoryI } from "../repository/transactions-repository.interface";
import type { TransactionsServiceI } from "./transactions-service.interface";

export type TransactionsServiceProps = {
  repository: TransactionsRepositoryI;
  eventManager: EventManager;
};

export class TransactionsService implements TransactionsServiceI {
  constructor(private props: TransactionsServiceProps) {}

  createTransaction(request: Transaction): Promise<Transaction> {
    return this.props.eventManager.create(async () => {
      request.transactionStatus ??= { name: "pending" };
      await this.props.repository.createTransaction(request);
      return request;
    });
  }

  readTransaction(
    request: Pick<Transaction, "transactionExternalId">
  ): Promise<Transaction> {
    return this.props.eventManager.read(() =>
      this.props.repository.readTransaction(request)
    );
  }

  processTransactionUpdateEvent(request: Antifraud): Promise<Transaction> {
    return this.props.eventManager.update(async () => {
      const transactionDb = await this.props.repository.readTransaction({
        transactionExternalId: request.transaction.transactionExternalId,
      });

      if (transactionDb.transactionStatus.name !== "pending") {
        throw new BadRequestError({
          message: "Transaction is already processed",
        });
      }

      transactionDb.verifyFraud(request);

      await this.props.repository.updateTransactionStatus(transactionDb);
      return transactionDb;
    });
  }
}
