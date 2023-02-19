import { TransactionStatus } from "../entities/transaction-status";
import { TransactionAmount } from "../entities/value-objects/transaction-amount";

export interface TransactionValidatorService {
  validate(amount: TransactionAmount): TransactionStatus;
}
