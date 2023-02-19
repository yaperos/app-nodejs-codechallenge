import { logger } from "../bootstrap/logger";
import { publisherSubscriberService } from "../bootstrap/services";
import { Transaction } from "../entities/transaction";
import { ProcessCreatedTransaction } from "../listeners/process-created-transaction";
import { DomainEvent } from "./ports";

export class TransactionCreated extends DomainEvent {
  public readonly transaction: Transaction;

  constructor(transaction: Transaction) {
    super();
    this.transaction = transaction;
    logger.log(`Transaction created with id = ${transaction.id.value}`);
  }

  protected registerListeners(): void {
    this.subscribe(new ProcessCreatedTransaction(publisherSubscriberService));
  }
}
