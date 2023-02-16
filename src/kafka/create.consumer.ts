import { Injectable, OnModuleInit } from '@nestjs/common';
import { async } from 'rxjs';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { TransactionService } from 'src/transaction/transaction.service';

@Injectable()
export class CreateConsumer implements OnModuleInit {
  constructor(private readonly _consumer: ConsumerService,
    private transactionService: TransactionService) {}

  async onModuleInit() {
    //console.log('onModuleInit$$$$$$$$$$$$');
    this._consumer.consume(
      'create-client',
      { topic: 'create-employee' },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log("eachMessage");
          console.log({
            source: 'create-consumer',
            value: message.value.toString(),
            //key : message.key.toString(),
            partition: partition.toString(),
            topic: topic.toString(),
          });

          var id: string = message.value.toString();
          var transaction = await this.transactionService.findOne(id);
          console.log(transaction);
          transaction.transactionStatusID="2";
          this.transactionService.updateTransaction(id, transaction);
        },
      },
    );
  }
}
