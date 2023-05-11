import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AntiFraudSystemService {
  constructor(@Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka) {}
  validateTransaction(message: any): any {
    console.log('validando mensaje', message);
    // TODO: apply validation logic
    if (true) {
      this.kafkaClient.emit('transaction.approved', { message: 'correcto' });
    } else {
      this.kafkaClient.emit('transaction.rejected', { message: 'falso' });
    }
  }
}
