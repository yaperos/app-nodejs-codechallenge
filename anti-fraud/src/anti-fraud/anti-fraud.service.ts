import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AntiFraudService {
  constructor(
    @Inject('KAFKA')
    private readonly kafka: ClientKafka,
  ) {}

  public handleModeration() {
    this.kafka.emit('transaction_moderated', {
      value: 'moderated',
    });
  }
}
