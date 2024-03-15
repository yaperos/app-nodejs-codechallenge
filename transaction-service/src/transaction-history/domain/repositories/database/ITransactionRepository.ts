import { TransactionModel } from '../../model/Transaction.model';
import { DatabaseTransactionStatus } from '../../enums/DatabaseTransactionStatus';
import { TransactionDetailModel } from '../../model/TransactionDetail.model';

export abstract class ITransactionRepository {
  abstract createTransaction(
    transaction: TransactionModel,
  ): Promise<DatabaseTransactionStatus>;

  abstract updateTransactionStatus(
    id: string,
    statusId: number,
  ): Promise<DatabaseTransactionStatus>;

  abstract findTransactionById(id: string): Promise<TransactionDetailModel>;
}
