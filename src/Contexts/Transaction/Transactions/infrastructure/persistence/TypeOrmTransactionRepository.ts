import { EntitySchema } from 'typeorm';

import { TypeOrmRepository } from '../../../../Shared/infrastructure/persistence/typeorm/TypeOrmRepository';
import { Transaction } from '../../domain/Transaction';
import { TransactionRepository } from '../../domain/TransactionRepository';
import { TransactionEntity } from './typeorm/TransactionEntity';

export class TypeOrmTransactionRepository
	extends TypeOrmRepository<Transaction>
	implements TransactionRepository
{
	public async save(transaction: Transaction): Promise<void> {
		return this.persist(transaction);
	}

	protected entitySchema(): EntitySchema<Transaction> {
		return TransactionEntity;
	}
}
