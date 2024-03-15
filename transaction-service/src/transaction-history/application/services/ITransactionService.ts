import { TransactionDTO } from '../dto/TransactionDTO';
import { TransactionEvaluatedDTO } from '../dto/TransactionEvaluatedDTO';
import { TransactionDetailModel } from '../../domain/model/TransactionDetail.model';
import { TransactionCreatedModel } from '../../domain/model/TransactionCreated.model';

export abstract class ITransactionService {
  abstract createTransaction(transaction: TransactionDTO): Promise<TransactionCreatedModel>;

  abstract updateTransactionAfterEvaluate(
    data: TransactionEvaluatedDTO,
  ): Promise<void>;

  abstract findTransactionById(id: string): Promise<TransactionDetailModel>;
}
