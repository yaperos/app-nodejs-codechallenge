import { Injectable } from '@nestjs/common';
import { Topics } from 'src/common/types/topicsNames';
import { TransactionStatus } from 'src/common/types/transactionStatus';

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
        Topics.APPROVED,
        JSON.stringify({
          transactionId: transaction.id,
          value: transaction.value,
          status: TransactionStatus.APPROVED,
        }),
      );
    } else {
      await sendKafkaMessage(
        Topics.REJECTED,
        JSON.stringify({
          transactionId: transaction.id,
          value: transaction.value,
          status: TransactionStatus.REJECTED,
        }),
      );
    }
  }
}
