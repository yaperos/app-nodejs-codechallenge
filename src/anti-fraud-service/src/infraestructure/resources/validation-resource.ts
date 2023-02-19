import { TransactionStatus } from "../../domain/entities/transaction-status";
import { TransactionAmount } from "../../domain/entities/value-objects/transaction-amount";
import { TransactionId } from "../../domain/entities/value-objects/transaction-id";

export class ValidationResource {
  constructor(
    private resource: {
      transactionId: TransactionId;
      amount: TransactionAmount;
      status: TransactionStatus;
    }
  ) {}

  public toJson(): object {
    return {
      transaction_id: this.resource.transactionId.value,
      amount: this.resource.amount.value,
      status: this.resource.status,
    };
  }
}
