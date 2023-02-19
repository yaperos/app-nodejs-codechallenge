import { logger } from "../bootstrap/logger";
import { transactionService } from "../bootstrap/services";
import { Status } from "../entities/status";
import { TransactionId } from "../entities/value-objects/transaction-id";
import { UpdateValidatedTransaction } from "../listeners/update-validated-transaction";
import { DomainEvent } from "./ports";

export class TransactionValidated extends DomainEvent {
  public readonly status: Status;
  public readonly transactionId: TransactionId;

  constructor(status: Status, transactionId: TransactionId) {
    super();
    this.status = status;
    this.transactionId = transactionId;
    logger.log(
      `Transaction validated with id = ${transactionId.value}, status = ${status}`,
    );
  }

  protected registerListeners(): void {
    this.subscribe(new UpdateValidatedTransaction(transactionService));
  }
}
