import { Transaction } from '../../domain/transaction.model';
import { TransactionRepository } from '../../domain/transaction.repository';

export class MockTransactionRepository implements TransactionRepository {
    save(transaction: Transaction): Promise<Transaction> {
        return Promise.resolve(transaction);
    }
}
