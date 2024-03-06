import { Injectable, Inject, Logger} from '@nestjs/common';
import { MessagePattern, Payload, ClientProxy} from '@nestjs/microservices';
import { Transaction } from './transaction.entity';

@Injectable()
export class ProducerService {

	
	constructor(@Inject('KAFKA') private readonly kafka: ClientProxy ){}

	send(transaction: Transaction){
		Logger.log(transaction, 'ProducerService')
		this.kafka.emit('transaction.created',{
			transaction
		});

	}



}
