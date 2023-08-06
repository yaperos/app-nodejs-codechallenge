import {Body, Controller, Delete, 
	Get, Inject, InternalServerErrorException, Logger,Param, Post 
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { performance } from 'perf_hooks';
import { v4 as uuidv4 } from 'uuid';

import { KAFKA_INSTANCE_NAME } from '@api/constant/kafka.constant';
import { CreateTransactionDto } from '@api/dto';
import { MessageUpdateDTO } from '@api/dto/message-update.dto';
import { ObjectIdParserPipe, ObjectIdValidation } from '@api/pipes';
import { TransactionService } from '@api/service/transaction.service';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { round } from 'lodash';
import { EventPatternEnum } from 'src/enum/event-pattern.enum';

@ApiTags('Transaction')
@Controller('transactions')
export class TransactionController {
	constructor(@Inject(KAFKA_INSTANCE_NAME) private readonly clientKafka: ClientKafka, private readonly transactionService: TransactionService) {
	}

	@Delete('clean-up')
	async removeAll() {
		Logger.log('method: removeAll', TransactionController.name);
		const startFull = performance.now();

		const startGettAll = performance.now();
		const transactions = await this.transactionService.findAll();
		const endGettAll = performance.now();
		Logger.log(`Get all transactions: [${round(endGettAll - startGettAll, 2)}] ms`, TransactionController.name);

		Logger.log(`Found ${transactions.length} transactions`, TransactionController.name);

		const startCreatingPromises = performance.now();
		const promises = transactions.map(async (transaction) => {
			return await this.transactionService.remove(transaction._id.toHexString());
		});
		const endCreatingPromises = performance.now();
		Logger.log(`Creating promises: [${round(endCreatingPromises - startCreatingPromises, 2)}}] ms`, TransactionController.name);

		try {
			const startAllSettled = performance.now();
			const allSettledResponse = await Promise.allSettled(promises);
			const endAllSettled = performance.now();
			Logger.log(`All settled: [${round(endAllSettled - startAllSettled, 2)}}] ms`, TransactionController.name);

			const startAnalyzingResponse = performance.now();
			// filter rejected promises
			const rejected = allSettledResponse.filter((promise) => promise.status === 'rejected');
			const endAnalyzingResponse = performance.now();
			Logger.log(`Analyzing response: [${round(endAnalyzingResponse - startAnalyzingResponse, 2)}}] ms`, TransactionController.name);

			if (rejected.length > 0) {
				Logger.log(`Error removing transactions: ${JSON.stringify(rejected)}`, TransactionController.name);

				const endFull = performance.now();
				Logger.log(`Full process: [${round(endFull - startFull, 2)}}] ms`, TransactionController.name);
				return false;
			}

			const endFull = performance.now();
			Logger.log(`Full process: [${round(endFull - startFull, 2)}}] ms`, TransactionController.name);


			Logger.log(`Removed ${allSettledResponse.length} transactions`, TransactionController.name);
			return true;
		} catch (error) { 
			Logger.log(`Error removing transactions: ${JSON.stringify(error)}`, TransactionController.name);
		}
	}

	@ApiOperation({ summary: 'Elimina una transacción' })
	@ApiOkResponse({ type: Boolean })
	@Delete(':transactionId')
	async remove(@Param('transactionId', ObjectIdParserPipe) { isValid, value }: ObjectIdValidation) {
		if (!isValid) {
			throw new InternalServerErrorException('INTERNAL_ERROR');
		}
		return this.transactionService.remove(value.toHexString());
	}

	@ApiOperation({ summary: 'Guarda una transacción' })
	@ApiOkResponse({ type: CreateTransactionDto })
	@Post()
	async saveTransaction(@Body() transaction: CreateTransactionDto) {
		const startFull = performance.now();

		Logger.log(`[${TransactionController.name}] - method: saveTransaction`, TransactionController.name);

		const createdTransaction = await this.transactionService.create(transaction);

		const endFull = performance.now();

		Logger.log(`[${TransactionController.name}] - Full process: [${round(endFull - startFull, 2)}] ms`, TransactionController.name);

		return createdTransaction;
	}

	@Get()
	async findAll() {
		const startFull = performance.now();

		Logger.log(`[${TransactionController.name}] - method: findAll`, TransactionController.name);

		const startGettAll = performance.now();
		const transactions = await this.transactionService.findAll();
		const endFindAll = performance.now();
		Logger.log(`[${TransactionController.name}] - Find all transactions: [${round(endFindAll - startGettAll, 2)}] ms`, TransactionController.name);

		const endFull = performance.now();

		Logger.log(`[${TransactionController.name}] - Full process: [${round(endFull - startFull, 2)}] ms`, TransactionController.name);

		return transactions;
	}

	@Get(':transactionId')
	findOne(@Param('transactionId', ObjectIdParserPipe) { isValid, value }: ObjectIdValidation) {
		if (!isValid) {
			throw new InternalServerErrorException('INTERNAL_ERROR');
		}
		return this.transactionService.findOneById(value.toHexString());
	}

	@EventPattern(EventPatternEnum.TransactionUpdate)
	async handleEvent(@Payload() event: MessageUpdateDTO) {
		const startFull = performance.now();
		Logger.log(`[${TransactionController.name}] - method: handleEvent`, TransactionController.name);

		Logger.log(`[${TransactionController.name}] - Processing event status: [${event.status}] updated for transaction: [${event.id}]`, TransactionController.name);

		const startUpdating = performance.now();
		const updatedEvent = await this.transactionService.getTransactionUpdated(event);
		const endUpdating = performance.now();
		Logger.log(`[${TransactionController.name}] - Updating transaction: [${round(endUpdating - startUpdating, 2)}] ms`, TransactionController.name);

		const endFull = performance.now();

		Logger.log(`[${TransactionController.name}] - Full process: [${round(endFull - startFull, 2)}] ms`, TransactionController.name);

		return updatedEvent
	}
}
