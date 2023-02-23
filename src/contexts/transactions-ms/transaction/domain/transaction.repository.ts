import { TransactionStatus } from '../../shared/domain/enums/transaction-status.enum';
import { TransactionModel } from './transaction.model';

export interface TransactionRepository {
    save(transaction: TransactionModel): Promise<TransactionModel>;
    updateStatus(
        transactionId: string,
        status: TransactionStatus,
    ): Promise<void>;
}

export const TransactionRepository = Symbol('TransactionRepository');
