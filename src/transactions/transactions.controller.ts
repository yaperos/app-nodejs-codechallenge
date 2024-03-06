import { Controller, Inject, Post, Logger, Body} from '@nestjs/common';
import { MessagePattern, Payload, ClientProxy} from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {

	constructor(
		private readonly transactionService: TransactionsService ,
		@Inject('KAFKA') private readonly kafka: ClientProxy ){}

	@MessagePattern('transaction.created')
	messageConsumer(@Payload() payload: any){
		Logger.log(payload, 'teteet')
	}

	@Post()
	create(@Body() newTransaction: CreateTransactionDto ){
		return this.transactionService.create(newTransaction);
	}


}
