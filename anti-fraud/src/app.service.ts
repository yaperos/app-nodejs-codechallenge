import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './kafka/consumer.service';
import { TransactionService } from './transaction/transaction.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly transactionService: TransactionService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      {
        topic: 'createTransaction',
        fromBeginning: true,
      },
      {
        eachMessage: async ({ message }) => {
          console.log(message.value.toString());

          const transaction = JSON.parse(message.value.toString());

          this.transactionService.updateTransaction(transaction);
        },
      },
    );
  }
}
