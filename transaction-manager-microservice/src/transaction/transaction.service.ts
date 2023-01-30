import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ClientKafka, ClientProxy, MessagePattern, EventPattern, Payload  } from '@nestjs/microservices';

import { Transaction } from '@prisma/client';

import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { TransactionCreatedEvent } from './dto/transaction-created.event';

@Injectable()
export class TransactionService {

	constructor(
		@Inject('ANTIFRAUD_SERVICE')
		private readonly antifraudClient: ClientKafka,
		private prisma: PrismaService
	){
	}

	async createTransaction({ accountExternalIdDebit, accountExternalIdCredit, transferTypeId, value }: CreateTransactionInput): Promise<Transaction> {
		
		const transacionCreated = await this.prisma.transaction.create({
			data: {
				accountExternalIdDebit,
				accountExternalIdCredit,
				transferTypeId,
				value,
				transactionStatusId: 1,
				transactionTypeId: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			include: {
				transactionStatus: true,
				transactionType: true
			}
		});

		const transactionCreatedEvent = new TransactionCreatedEvent(
			transacionCreated.transactionExternalId,
			value
		);

		this.antifraudClient.emit('fraud_detection_request', transactionCreatedEvent);

		return transacionCreated;
	}

	async retrieveTransactionById(transactionExternalId: string): Promise<Transaction> {
		return this.prisma.transaction.findUnique({
			where: {
				transactionExternalId
			},
			include: {
				transactionStatus: true,
				transactionType: true
			}
		});
	}

	async updateTransactionById(transactionExternalId: string, status: number): Promise<Transaction> {
		return this.prisma.transaction.update({
			where: {
				transactionExternalId,
			},
			data: {
				transactionStatusId: status,
			},
		})
	}
  
}
