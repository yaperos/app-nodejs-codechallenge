import { TransactionStatus } from 'src/models/enums';
import { ValidatedTransaction } from 'src/types/transaction-validated';
import { ValidateTransaction } from 'src/types/validate-transaction';

export class ValidateTransactionService {
  async validateTransaction(
    transaction: ValidateTransaction,
  ): Promise<ValidatedTransaction> {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    if (transaction.value > 1000) {
      return {
        id: transaction.id,
        status: TransactionStatus.REJECTED,
      };
    }

    return {
      id: transaction.id,
      status: TransactionStatus.APPROVED,
    };
  }
}
