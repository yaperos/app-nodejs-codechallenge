import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AntiFraudService {

  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) { }

  sendTransactionToEvaluate(transaction: any) {
    this.client.emit('evaluate-transaction', JSON.stringify(transaction));
  }

}