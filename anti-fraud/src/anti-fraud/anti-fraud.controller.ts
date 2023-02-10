import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AntiFraudService } from './anti-fraud.service';

interface Transaction {
  id: string;
  value: string;
}

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @EventPattern('transaction_created')
  public transactionCreated(data: any) {
    console.log(data);
    this.antiFraudService.handleModeration();
  }

  // async onModuleInit() {
  //   await this.consumerService.consume(
  //     {
  //       topics: ['transaction-created'],
  //     },
  //     {
  //       eachMessage: async ({ topic, message }) => {
  //         const { value } = message;
  //         const transaction = JSON.parse(value.toString()) as Transaction;

  //         console.log('TRANSACTION', transaction);

  //         if (Number.parseFloat(transaction.value) > 1000) {
  //           await this.producerService.produce({
  //             topic: 'transaction-rejected',
  //             messages: [
  //               {
  //                 value: transaction.id,
  //               },
  //             ],
  //           });
  //         } else {
  //           await this.producerService.produce({
  //             topic: 'transaction-approved',
  //             messages: [
  //               {
  //                 value: transaction.id,
  //               },
  //             ],
  //           });
  //         }
  //       },
  //     },
  //   );
  // }
}
