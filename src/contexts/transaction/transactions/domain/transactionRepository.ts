import { Nullable } from '../../../shared/domain/nullable';
import { Transaction } from './transaction';
import { TransactionId } from './transactionId';

export interface TransactionRepository {
	save(transaction: Transaction): Promise<void>;
	search(id: TransactionId): Promise<Nullable<Transaction>>;
}
