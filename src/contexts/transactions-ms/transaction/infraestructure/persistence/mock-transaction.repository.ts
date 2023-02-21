import { TransactionModel } from '../../domain/transaction.model';
import { TransactionRepository } from '../../domain/transaction.repository';

export class MockTransactionRepository implements TransactionRepository {
    save(transaction: TransactionModel): Promise<TransactionModel> {
        return Promise.resolve(transaction);
    }
}
