import { CreateTransactionDto } from '@api/dto';
import { Transaction } from '@api/entity';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageStatusEnum } from 'src/enum/message-status.enum';

export enum PdfCartolasGenerationKind {
	GENERATE = 'generated',
	SAMPLE = 'sample',
}

@Injectable()
export class TransactionRepository {
	constructor(@InjectModel(Transaction.name) private readonly model: Model<Transaction>) {}

	async create(transaction: CreateTransactionDto): Promise<Transaction> {
		try {
			const createdTransaction = new this.model(transaction);
			return await createdTransaction.save();
		} catch (error) {
			Logger.log('error', TransactionRepository.name);
			console.trace(error);
			throw new BadRequestException(error);
		}
	}

	async update(transactionId: string, transaction: Transaction): Promise<Transaction | null> {
		const transactionFound = this.model.findById(transactionId);
		if (!transactionFound) {
			return null;
		}

		transactionFound.set(transaction.toObject());

		const updatedTransaction = await this.model.updateOne({ _id: transactionId }, transactionFound);

		return transactionFound;
	}

	async find(): Promise<Transaction[]> {
		return this.model.find();
	}

	async updateTransactionState(id: string, status: MessageStatusEnum): Promise<Transaction | null> {
		const transaction = await this.model.findById(id);
		if (!transaction) {
			return null;
		}

		transaction.transactionStatus = status;

		return await transaction.save();
	}

	async findOneById(transactionId: string): Promise<Transaction | null> {
		const transaction = await this.model.findById(transactionId);
		if (!transaction) {
			return null;
		}
		return transaction;
	}
}