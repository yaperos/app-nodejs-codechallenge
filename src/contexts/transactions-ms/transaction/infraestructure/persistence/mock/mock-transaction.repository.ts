import { TransactionStatus } from '../../../../../transactions-ms/shared/domain/enums/transaction-status.enum';
import { TransactionModel } from '../../../domain/transaction.model';
import { TransactionRepository } from '../../../domain/transaction.repository';

export class MockTransactionRepository implements TransactionRepository {
    save(transaction: TransactionModel): Promise<TransactionModel> {
        return Promise.resolve(transaction);
    }
    updateStatus(
        transactionId: string,
        status: TransactionStatus,
    ): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getById(id: string): Promise<TransactionModel> {
        throw new Error('Method not implemented.');
    }
}
