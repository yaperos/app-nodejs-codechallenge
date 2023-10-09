import { EventBus } from '../../../shared/domain/eventBus';
import { Transaction } from '../domain/transaction';
import { TransactionAccountExternalIdCredit } from '../domain/transactionAccountExternalIdCredit';
import { TransactionAccountExternalIdDebit } from '../domain/transactionAccountExternalIdDebit';
import { TransactionCreatedAt } from '../domain/transactionCreatedAt';
import { TransactionId } from '../domain/transactionId';
import { TransactionRepository } from '../domain/transactionRepository';
import { TransactionStatus } from '../domain/transactionStatus';
import { TransactionTransferType } from '../domain/transactionTransferType';
import { TransactionType } from '../domain/transactionType';
import { TransactionValue } from '../domain/transactionValue';

export class TransactionCreator {
	constructor(
		private readonly transactionRepository: TransactionRepository,
		private readonly eventBus: EventBus
	) {}

	async run(params: {
		id: TransactionId;
		accountExternalIdCredit: TransactionAccountExternalIdCredit;
		accountExternalIdDebit: TransactionAccountExternalIdDebit;
		status: TransactionStatus;
		transferType: TransactionTransferType;
		type: TransactionType;
		value: TransactionValue;
		createdAt: TransactionCreatedAt;
	}): Promise<void> {
		const transaction = Transaction.create(
			params.id,
			params.accountExternalIdCredit,
			params.accountExternalIdDebit,
			params.status,
			params.transferType,
			params.type,
			params.value,
			params.createdAt
		);

		await this.transactionRepository.save(transaction);
		await this.eventBus.publish(transaction.pullDomainEvents());
	}
}
