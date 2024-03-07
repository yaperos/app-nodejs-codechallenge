import { Controller, Inject, Post, Logger, Body, Patch } from '@nestjs/common';
import { MessagePattern, Payload, ClientProxy} from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';
import { EventTransactionDto } from './dto/event-transaction.dto';

@Controller('transactions')
export class TransactionsController {

	constructor(
		private readonly transactionService: TransactionsService ,
		@Inject('KAFKA') private readonly kafka: ClientProxy ){}

	
	@MessagePattern('transactions.update')
	consumer(@Payload() payload: any){
		Logger.log(payload, 'ConsumerService')
		this.transactionService.updateStatus(payload.transactionDTO.status, payload.transactionDTO.transactionExternalId)
	}

	@Post()
	create(@Body() newTransaction: CreateTransactionDto ){
		return this.transactionService.create(newTransaction);
	}

 
	@Patch()
	send(){
		const transactionDTO = new EventTransactionDto("2222234311235",
														"GUID",
														2,
														"REJECTED"
														);
		this.kafka.emit('transactions.update',{
			transactionDTO
		});
	}
 

}
