import { Transaction } from '../domain/Transaction';
import { TransactionAccountExternalIdCredit } from '../domain/TransactionAccountExternalIdCredit';
import { TransactionAccountExternalIdDebit } from '../domain/TransactionAccountExternalIdDebit';
import { TransactionId } from '../domain/TransactionId';
import { TransactionRepository } from '../domain/TransactionRepository';
import { TransactionStatus } from '../domain/TransactionStatus';
import { TransactionTransferType } from '../domain/TransactionTransferType';
import { TransactionType } from '../domain/TransactionType';
import { TransactionValue } from '../domain/TransactionValue';

export class TransactionCreator {
	constructor(private readonly transactionRepository: TransactionRepository) {}

	async run(params: {
		id: TransactionId;
		accountExternalIdCredit: TransactionAccountExternalIdCredit;
		accountExternalIdDebit: TransactionAccountExternalIdDebit;
		status: TransactionStatus;
		transferType: TransactionTransferType;
		type: TransactionType;
		value: TransactionValue;
	}): Promise<void> {
		const transaction = Transaction.create(
			params.id,
			params.accountExternalIdCredit,
			params.accountExternalIdDebit,
			params.status,
			params.transferType,
			params.type,
			params.value
		);

		return this.transactionRepository.save(transaction);
	}
}
