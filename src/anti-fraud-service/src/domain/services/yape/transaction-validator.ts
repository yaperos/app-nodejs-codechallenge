import { TransactionStatus } from "../../entities/transaction-status";
import { TransactionAmount } from "../../entities/value-objects/transaction-amount";
import { TransactionValidatorService } from "../ports";

export class YapeTransactionValidatorService
  implements TransactionValidatorService
{
  private static MAX_AMOUNT = 1000;

  public validate(amount: TransactionAmount): TransactionStatus {
    if (amount.value > YapeTransactionValidatorService.MAX_AMOUNT) {
      return TransactionStatus.REJECTED;
    }

    return TransactionStatus.APRROVED;
  }
}
