import { Body, Controller, Get, Headers, Param, Post, Put } from "@nestjs/common";
import { TransactonService } from "./transactions.service";
import { CreateTransactionDto } from "./dto/CreateTransaction.dto";
import { AppLoggerAdapter } from "../../classes/AppLoggerAdapter.class";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Transaction } from "../../database/Transaction.schema";
import { UpdateTransactionDto } from "./dto/UpdateTransaction.dto";
import { ETransactionStatus } from "../../enum/TransactionStatus.enum";
import { KafkaService } from "./kafka.service";
import { EKafkaTopics } from "../../enum/KafkaTopics.enum";

@ApiTags('transactions')
@Controller('/transactions')
export class TransactionsController {
	constructor(
		private readonly transactionsService: TransactonService,
		private readonly kafkaService: KafkaService,
	){}

	@Post('/create')
	@ApiOperation({ summary: 'Create a transaction' })
	@ApiResponse({
    status: 200,
    description: 'Return created transaction',
    type: Transaction,
  })
	public async create(
		@Body() data: CreateTransactionDto,
		@Headers('x-app-traceid') traceId: string,
	): Promise<Transaction> {
		const logger = new AppLoggerAdapter(traceId, 'yape-create-trx');

		logger.logInfo('Trying to create transaction', data);
		const createdRecord = await this.transactionsService.createTransaction(logger, data);

		logger.logInfo('Publishing into kafka trx-created topic');
		await this.kafkaService.emit( logger, EKafkaTopics.TRX_CREATED, {
			transactionId: createdRecord.transactionExternalId,
			value: createdRecord.value
		});

		return createdRecord
	}

	@ApiOperation({ summary: 'Find a transaction by its external id' })
	@ApiResponse({
    status: 200,
    description: 'Return a transaction by its id',
    type: Transaction,
  })
	@Get('/find/:transactionId')
	public async find(
		@Param('transactionId') transactionId: string,
		@Headers('x-app-traceid') traceId: string,
		): Promise<Transaction> {
		const logger = new AppLoggerAdapter(traceId, 'yape-find-trx');
		
		logger.logInfo('Trying to find transaction', {transactionId});
		return this.transactionsService.getTransactionByExternalId(logger, transactionId);
	}
}