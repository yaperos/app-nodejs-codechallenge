import {
	AddTransactionModel,
	AddTransactionUseCaseResult,
	IAddTransactionUseCase
} from '@domain/usecases/add-transaction-use-case';
import { IAddTransactionRepository } from '@data/protocols/db/transaction/add-transaction-repository';
import { IExistsTransferByIdRepository } from '@data/protocols/db/transfer/exists-transfer-by-id-repository';
import { TransferNotFoundError } from '@domain/error';
import { TransactionEntity } from '@domain/entities/transaction';
import { IQueueSenderService } from '@data/protocols/services/queue-service';
import { TransactionStatusEnum } from '@shared/enum/transaction-status-enum';
import { left, right } from '@domain/logic/Either';
import { kafkaQueueConfig } from '@shared/config/queue/kafka-config';

export class AddTransactionUseCase implements IAddTransactionUseCase {
	constructor(
		private readonly transferExistsRepository: IExistsTransferByIdRepository,
		private readonly addTransactionRepository: IAddTransactionRepository,
		private readonly validateTransactionQueueService: IQueueSenderService<
			Omit<TransactionEntity, 'id'>,
			void
		>
	) {}

	async execute(input: AddTransactionModel): Promise<AddTransactionUseCaseResult> {
		const { transferTypeId } = input;

		const transferExists = await this.transferExistsRepository.existsById(transferTypeId);

		if (!transferExists) {
			return left(new TransferNotFoundError());
		}

		const transaction = await this.addTransactionRepository.create({
			...input,
			status: TransactionStatusEnum.PENDING
		});

		await this.validateTransactionQueueService.send(
			{
				transactionExternalId: transaction.transactionExternalId,
				value: transaction.value,
				accountExternalIdCredit: transaction.accountExternalIdCredit,
				accountExternalIdDebit: transaction.accountExternalIdCredit,
				status: transaction.status,
				transferTypeId: transaction.transferTypeId
			},
			kafkaQueueConfig.transaction.validateTransactionTopic
		);

		return right(transaction);
	}
}
