import { EntitySchema } from 'typeorm';

import { Nullable } from '../../../../shared/domain/nullable';
import { TypeOrmRepository } from '../../../../shared/infrastructure/persistence/typeorm/typeOrmRepository';
import { Transaction } from '../../domain/transaction';
import { TransactionId } from '../../domain/transactionId';
import { TransactionRepository } from '../../domain/transactionRepository';
import { TransactionEntity } from './typeorm/transactionEntity';

export class TypeOrmTransactionRepository
	extends TypeOrmRepository<Transaction>
	implements TransactionRepository
{
	public async search(id: TransactionId): Promise<Nullable<Transaction>> {
		const repository = await this.repository();
		const transaction = await repository.findOne({ id });

		return transaction;
	}

	public async save(transaction: Transaction): Promise<void> {
		return this.persist(transaction);
	}

	protected entitySchema(): EntitySchema<Transaction> {
		return TransactionEntity;
	}
}
