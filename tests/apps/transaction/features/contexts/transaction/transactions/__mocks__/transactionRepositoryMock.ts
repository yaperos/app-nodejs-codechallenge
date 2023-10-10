import { Nullable } from '../../../../../../../../src/contexts/shared/domain/nullable';
import { Transaction } from '../../../../../../../../src/contexts/transaction/transactions/domain/transaction';
import { TransactionId } from '../../../../../../../../src/contexts/transaction/transactions/domain/transactionId';
import { TransactionRepository } from '../../../../../../../../src/contexts/transaction/transactions/domain/transactionRepository';

export class TransactionRepositoryMock implements TransactionRepository {
	private readonly mockSave = jest.fn();

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
