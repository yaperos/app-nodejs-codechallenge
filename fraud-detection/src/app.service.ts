import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject('TRANSACTION_SERVICE') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async handleTransactionCreated(id: string, value: number) {
    if (value > 1000) {
      Logger.log('declined');
      this.client.emit('transaction.declined', { id });
    } else {
      Logger.log('approved');
      this.client.emit('transaction.approved', { id });
    }
  }
}
