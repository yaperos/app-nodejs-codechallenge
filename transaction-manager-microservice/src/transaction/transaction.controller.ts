import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';

@Controller()
export class TransactionController{
	constructor(
		private readonly transactionService: TransactionService,
		@Inject('ANTIFRAUD_SERVICE') private readonly antiFraudClient: ClientKafka,
	) {}

	@EventPattern('fraud_detection_response')
	handleAntifraudStatus(data: any) {
		console.log('FROM TRANSACTION CONTROLLER',data);
		this.transactionService.updateTransactionById(data.id, data.status);
	}

}