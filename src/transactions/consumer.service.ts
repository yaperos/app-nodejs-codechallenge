import { Injectable, Inject, Logger } from '@nestjs/common';
import { MessagePattern, Payload, ClientProxy} from '@nestjs/microservices';
import { Transaction } from './transaction.entity';
import { TransactionsService } from './transactions.service';

@Injectable()
export class ConsumerService {

	
	constructor(@Inject('KAFKA') private readonly kafka: ClientProxy,
				private readonly transactionService: TransactionsService ){}

	@MessagePattern('message.created')
	messageConsumer(@Payload() payload: any){
		Logger.log(payload, 'teteet')
		this.transactionService.updateStatus(payload.status)
	}


}
