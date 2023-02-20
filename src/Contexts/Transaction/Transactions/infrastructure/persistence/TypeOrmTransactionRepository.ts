import { EntitySchema } from 'typeorm';

import { Nullable } from '../../../../Shared/domain/Nullable';
import { TypeOrmRepository } from '../../../../Shared/infrastructure/persistence/typeorm/TypeOrmRepository';
import { Transaction } from '../../domain/Transaction';
import { TransactionId } from '../../domain/TransactionId';
import { TransactionRepository } from '../../domain/TransactionRepository';
import { TransactionEntity } from './typeorm/TransactionEntity';

export class TypeOrmTransactionRepository
	extends TypeOrmRepository<Transaction>
	implements TransactionRepository
{
	public async search(id: TransactionId): Promise<Nullable<Transaction>> {
		const repository = this.repository();
		const transaction = (await repository).findOne({ id });

		return transaction;
	}

	public async save(transaction: Transaction): Promise<void> {
		return this.persist(transaction);
	}

	protected entitySchema(): EntitySchema<Transaction> {
		return TransactionEntity;
	}
}
