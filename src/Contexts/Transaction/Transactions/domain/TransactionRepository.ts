import { Nullable } from '../../../Shared/domain/Nullable';
import { Transaction } from './Transaction';
import { TransactionId } from './TransactionId';

export interface TransactionRepository {
	save(transaction: Transaction): Promise<void>;
	search(id: TransactionId): Promise<Nullable<Transaction>>;
}
