import { Injectable } from '@nestjs/common';

import { sendKafkaMessage } from 'src/kafka/kafka.producer';
import { TransactionService } from 'src/transactions/transaction.service';

@Injectable()
export class AntiFruadService {
  constructor(private readonly transactionService: TransactionService) {}

  async antiFraud(event: any): Promise<void> {
    console.log({ event });
    const { transactionId } = event;
    const transaction = await this.transactionService.findOne(transactionId);
    console.log('++++', transaction);

    if (+transaction.value < 1000) {
      await sendKafkaMessage(
        'approved',
        JSON.stringify({
          transactionId: transaction.id,
          value: transaction.value,
          status: 'approved',
        }),
      );
    } else {
      await sendKafkaMessage(
        'rejected',
        JSON.stringify({
          transactionId: transaction.id,
          value: transaction.value,
          status: 'rejected',
        }),
      );
    }
  }
}
