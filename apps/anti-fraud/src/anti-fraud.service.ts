import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AntiFraudService {

  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) { }

  sendTransactionResponse(transaction: any) {
    this.client.emit('transaction-evaluated', JSON.stringify(transaction));
  }
}
