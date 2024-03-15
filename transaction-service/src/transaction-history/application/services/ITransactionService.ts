import { TransactionDTO } from '../dto/TransactionDTO';
import { TransactionEvaluatedDTO } from '../dto/TransactionEvaluatedDTO';
import { TransactionDetailModel } from '../../domain/model/TransactionDetail.model';

export abstract class ITransactionService {
  abstract createTransaction(transaction: TransactionDTO): Promise<void>;

  abstract updateTransactionAfterEvaluate(
    data: TransactionEvaluatedDTO,
  ): Promise<void>;

  abstract findTransactionById(id: string): Promise<TransactionDetailModel>;
}
