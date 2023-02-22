/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Nullable } from '../../../../../../../../src/Contexts/Shared/domain/Nullable';
import { Transaction } from '../../../../../../../../src/Contexts/Transaction/Transactions/domain/Transaction';
import { TransactionId } from '../../../../../../../../src/Contexts/Transaction/Transactions/domain/TransactionId';
import { TransactionRepository } from '../../../../../../../../src/Contexts/Transaction/Transactions/domain/TransactionRepository';

export class TransactionRepositoryMock implements TransactionRepository {
	private readonly mockSave = jest.fn();

	// eslint-disable-next-line unused-imports/no-unused-vars
	async search(id: TransactionId): Promise<Nullable<Transaction>> {
		throw new Error('Method not implemented.');
	}

	async save(transaction: Transaction): Promise<void> {
		this.mockSave(transaction);
	}

	assertSaveHasBeenCalledWith(transaction: Transaction) {
		expect(this.mockSave).toHaveBeenCalledWith(transaction);
	}
}
