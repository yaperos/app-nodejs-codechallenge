import { TransactionModel } from '../../model/Transaction.model';
import { DatabaseTransactionStatus } from '../../enums/DatabaseTransactionStatus';

export abstract class ITransactionRepository {
  abstract createTransaction(
    transaction: TransactionModel,
  ): Promise<DatabaseTransactionStatus>;
}
