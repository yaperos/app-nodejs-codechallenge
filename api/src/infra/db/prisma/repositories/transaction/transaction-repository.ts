import { IAddTransactionRepository } from '@data/protocols/db';
import { prisma } from '../../config/client';
import { TransactionEntity } from '@domain/entities/transaction';
import { Uuid } from '../../helpers/UuidGenerate';
import { TransactionStatusEnum } from '@shared/enum/transaction-status-enum';
import { IUpdateTransactionStatusRepository } from '@data/protocols/db/transaction/update-transaction-status-repository';

export class TransactionRepository
	implements IAddTransactionRepository, IUpdateTransactionStatusRepository
{
	async updateStatus(
		status: TransactionStatusEnum,
		transactionExternalId: string
	): Promise<void> {
		await prisma.transaction.update({
			where: {
				transactionExternalId
			},
			data: {
				status
			}
		});
	}

	async create(model: TransactionEntity): Promise<TransactionEntity> {
		const transaction = await prisma.transaction.create({
			data: {
				...model,
				transactionExternalId: Uuid.generate()
			}
		});

		return {
			...transaction,
			id: Number(transaction.id),
			status: transaction.status as TransactionStatusEnum,
			value: Number(transaction.value)
		};
	}
}
