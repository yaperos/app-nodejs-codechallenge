import { BadRequestException, Injectable } from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateTransactionRequestDto } from './dto/create-transaction.req.dto';
import { ProducerService } from 'src/kafka/producer.service';

@Injectable()
export class TransactionService {
	constructor(private readonly producerService: ProducerService) {}

	public async getAll(): Promise<[Transaction[], number]> {
		return await Transaction.findAndCount();
	}

	public async getByTransactionExternalId(transactionExternalId: string): Promise<Transaction> {
		const transactionDb: Transaction | null = await Transaction.findOne({ where: { transactionExternalId } });

		if (!transactionDb) throw new BadRequestException('transaction not found');

		return transactionDb;
	}

	public async create(request: CreateTransactionRequestDto): Promise<Transaction> {
		const transaction = new Transaction();
		transaction.transactionExternalId = uuidv4();
		transaction.accountExternalIdDebit = request.accountExternalIdDebit;
		transaction.accountExternalIdCredit = request.accountExternalIdCredit;
		transaction.transferTypeId = request.transferTypeId;
		transaction.transactionTypeId = 1;
		transaction.transactionStatusId = 1;
		transaction.value = request.value;
		transaction.createdAt = new Date();
		transaction.updateAt = new Date();

		const savedData = await transaction.save();

		await this.producerService.produce({
			topic: 'new-transaction',
			messages: [
				{
					value: JSON.stringify({
						database_id: savedData.id,
						value: savedData.value,
					}),
				},
			],
		});

		return savedData;
	}
}
