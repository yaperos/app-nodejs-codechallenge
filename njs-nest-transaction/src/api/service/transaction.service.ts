import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { performance } from 'perf_hooks'

import { TypeService } from './type.service';
import { KAFKA_INSTANCE_NAME } from '@api/constant/kafka.constant';
import { CreateTransactionDto } from '@api/dto';
import { MessageUpdateDTO } from '@api/dto/message-update.dto';
import { Transaction, TransactionStatusGraphQL } from '@api/entity';
import { TransactionRepository, TypeRepository } from '@api/repository';
import { round } from 'lodash';
import { EventPatternEnum } from 'src/enum/event-pattern.enum';
import { MessageStatusEnum } from 'src/enum/message-status.enum';

@Injectable()
export class TransactionService {
	constructor(
		@InjectModel(Transaction.name)
		private readonly model: Model<Transaction>,
		private readonly transacRepo: TransactionRepository,
		private readonly typeService: TypeService,
		@Inject(KAFKA_INSTANCE_NAME) private readonly clientKafka: ClientKafka,
	) {}

	async create(data: CreateTransactionDto) {
		const startFull = performance.now();

		Logger.log(`[${TransactionService.name}] - method: create`, TransactionService.name);

		// check if type exists
		const startFindType = performance.now();
		const type = await this.typeService.findOneByNumericIdOrCreate(data.tranferTypeId);
		if (!type) {
			Logger.log(`[${TransactionService.name}] - Type not found`, TransactionService.name);
			return new BadRequestException('Type not found');
		}
		const endFindType = performance.now();
		Logger.log(`[${TransactionService.name}] - Find type: [${round(endFindType - startFindType, 2)}] ms`, TransactionService.name);

		data.tranferTypeId = type.numericId;
		
		const startCreating = performance.now();
		const transac = await this.transacRepo.create(data);
		const endCreating = performance.now();
		Logger.log(`[${TransactionService.name}] - Creating transaction: [${round(endCreating - startCreating, 2)}] ms`, TransactionService.name);

		// send message to kafka
		this.clientKafka.emit(EventPatternEnum.TransactionValidation, JSON.stringify({ id: transac._id, value: data.value }))

		const endFull = performance.now();
		Logger.log(`[${TransactionService.name}] - Full process: [${round(endFull - startFull, 2)}] ms`, TransactionService.name);

		return transac;
	}

	async getTransactionUpdated(data: MessageUpdateDTO) {
		// get transaction and modify status
		const transaction = await this.transacRepo.findOneById(data.id);
		const status = data.status === MessageStatusEnum.APPROVED ? MessageStatusEnum.APPROVED : MessageStatusEnum.REJECTED;

		// get transaction state and modify status
		return await this.transacRepo.updateTransactionState(transaction._id, status);
	}

	async update(transactionId: string, createTransactionDto: CreateTransactionDto): Promise<Transaction | null> {
		const transaction = await this.model.findById(transactionId);
		if (!transaction) {
			return null;
		}
		return await transaction.updateOne(createTransactionDto);
	}

	findOneById(id: string) {
		return this.transacRepo.findOneById(id);
	}

	findAll() {
		return this.transacRepo.find();
	}

	async findByStatusEntity(status: TransactionStatusGraphQL) {
		const type = await this.typeService.findByName(status.transactionType.name);
		if (!type) {
			Logger.log(`[${TransactionService.name}] - Type not found`, TransactionService.name);
			return new BadRequestException('Type not found');
		}
		return this.transacRepo.findOneByStatusEntity(status, type.numericId);
	}

	async remove(transactionId: string): Promise<boolean> {
		const result = await this.model.deleteOne({ _id: transactionId });
		return result.deletedCount > 0;
	}
}
