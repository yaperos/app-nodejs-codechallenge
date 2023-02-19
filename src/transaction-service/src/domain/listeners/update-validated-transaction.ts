import { logger } from "../bootstrap/logger";
import { Status } from "../entities/status";
import { TransactionId } from "../entities/value-objects/transaction-id";
import { TransactionService } from "../services/ports";
import { Listener } from "./ports";

export class UpdateValidatedTransaction implements Listener {
  constructor(private transactionService: TransactionService) {}

  handle(event: { transactionId: TransactionId; status: Status }) {
    logger.log(
      `Update validated transaction started for transaction id = ${event.transactionId.value}`
    );
    try {
      this.transactionService.updateStatus(event.transactionId, event.status);
    } catch (error) {
      logger.error(error);
    }
  }
}
