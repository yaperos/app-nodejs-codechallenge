import { Command } from '../../../shared/domain/command';
import { CommandHandler } from '../../../shared/domain/commandHandler';
import { CreateTransactionCommand } from '../domain/createTransactionCommand';
import { TransactionAccountExternalIdCredit } from '../domain/transactionAccountExternalIdCredit';
import { TransactionAccountExternalIdDebit } from '../domain/transactionAccountExternalIdDebit';
import { TransactionCreatedAt } from '../domain/transactionCreatedAt';
import { TransactionId } from '../domain/transactionId';
import { TransactionStatus, TransactionStatuses } from '../domain/transactionStatus';
import { TransactionTransferType } from '../domain/transactionTransferType';
import { TransactionType, TransactionTypes } from '../domain/transactionType';
import { TransactionValue } from '../domain/transactionValue';
import { TransactionCreator } from './transactionCreator';

export class CreateTransactionCommandHandler implements CommandHandler<CreateTransactionCommand> {
	constructor(private readonly transactionCreator: TransactionCreator) {}

	subscribedTo(): Command {
		return CreateTransactionCommand;
	}

	async handle(command: CreateTransactionCommand): Promise<void> {
		const id = TransactionId.random();
		const accountExternalIdCredit = new TransactionAccountExternalIdCredit(
			command.accountExternalIdCredit
		);
		const accountExternalIdDebit = new TransactionAccountExternalIdDebit(
			command.accountExternalIdDebit
		);
		const status = new TransactionStatus(TransactionStatuses.PENDING);
		const transferType = TransactionTransferType.fromValue(String(command.tranferTypeId));
		const type = new TransactionType(TransactionTypes.TRANSFERS);
		const value = new TransactionValue(command.value);
		const createdAt = new TransactionCreatedAt(new Date());
		await this.transactionCreator.run({
			id,
			accountExternalIdCredit,
			accountExternalIdDebit,
			status,
			transferType,
			type,
			value,
			createdAt
		});
	}
}
