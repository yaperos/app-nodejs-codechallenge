import { Controller, Inject, Post, Logger, Body, Patch, ParseIntPipe, Param, Get } from '@nestjs/common';
import { MessagePattern, Payload, ClientProxy} from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';
import { EventTransactionDto } from './dto/event-transaction.dto';
import { ResponseTransactionDto } from './dto/response-transaction.dto';

@Controller('transactions')
export class TransactionsController {

	constructor(
		private readonly transactionService: TransactionsService,
		@Inject('KAFKA') private readonly kafka: ClientProxy 
		){}


	@Post()
	create(@Body() newTransaction: CreateTransactionDto ){
		return this.transactionService.create(newTransaction);
	}


	@Get(':id')
	async get(@Param('id') id: string ){
		const transaction = this.transactionService.get(id);
 		return new ResponseTransactionDto(await transaction)
	}

 
	@MessagePattern('transactions.update')
	consumer(@Payload() payload: any){
		Logger.log(payload, 'TransactionsController')
		this.transactionService.updateStatus(payload.transactionDTO.status, payload.transactionDTO.transactionExternalId)
	}
	  

}
