import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { log } from 'console';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class ProducerService {
  constructor(
    @Inject('KAFKA') private readonly kafkaClient: ClientKafka,
    private readonly transactionsService: TransactionsService,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('transactions');
  }

  async send(topic: string, message: string) {
    return this.kafkaClient.send(topic, message).subscribe((response) => {
      log(`Received message: ${JSON.stringify(response)}`);
      if (response.approved) {
        this.transactionsService.approve(response.id);
      } else {
        this.transactionsService.reject(response.id);
      }
    });
  }
}
