import { AddTransactionUseCase } from '@data/usecases/transaction/add-transaction/add-transaction-use-case';
import { IAddTransactionUseCase } from '@domain/usecases/add-transaction-use-case';
import { TransactionRepository } from '@infra/db/prisma/repositories/transaction/transaction-repository';
import { TransferRepository } from '@infra/db/prisma/repositories/transfer/transfer-repository';
import { kafka } from '@infra/factories/kafka-factory';
import { TransactionKafkaQueueService } from '@infra/queue/transaction/transaction-kafka-queue-service';

export const makeAddTransactionUseCase = (): IAddTransactionUseCase => {
	const transactionRepository = new TransactionRepository();
	return new AddTransactionUseCase(
		new TransferRepository(),
		transactionRepository,
		new TransactionKafkaQueueService(transactionRepository, kafka)
	);
};
