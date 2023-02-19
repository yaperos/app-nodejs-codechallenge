import { Command } from '../../../Shared/domain/Command';
import { CommandHandler } from '../../../Shared/domain/CommandHandler';
import { CreateTransactionCommand } from '../domain/CreateTransactionCommand';
import { TransactionAccountExternalIdCredit } from '../domain/TransactionAccountExternalIdCredit';
import { TransactionAccountExternalIdDebit } from '../domain/TransactionAccountExternalIdDebit';
import { TransactionId } from '../domain/TransactionId';
import { TransactionStatus, TransactionStatuses } from '../domain/TransactionStatus';
import { TransactionTransferType } from '../domain/TransactionTransferType';
import { TransactionType, TransactionTypes } from '../domain/TransactionType';
import { TransactionValue } from '../domain/TransactionValue';
import { TransactionCreator } from './TransactionCreator';

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
		await this.transactionCreator.run({
			id,
			accountExternalIdCredit,
			accountExternalIdDebit,
			status,
			transferType,
			type,
			value
		});
	}
}
