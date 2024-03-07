import { Injectable, Inject, Logger} from '@nestjs/common';
import { MessagePattern, Payload, ClientProxy } from '@nestjs/microservices';
import { Transaction } from './transaction.entity';
import { EventTransactionDto } from './dto/event-transaction.dto';

@Injectable()
export class ProducerService {
	
	constructor(@Inject('KAFKA') private readonly kafka: ClientProxy ){}

	send(transaction: Transaction){
		Logger.log(transaction, 'ProducerService')
		const transactionDTO = new EventTransactionDto(transaction.transactionExternalId,
														transaction.transactionType.name,
														transaction.value,
														transaction.transactionStatus.name
														);
		this.kafka.emit('transaction.created',{
			transactionDTO
		});
	}


}
