import { Inject, Injectable } from '@nestjs/common';
import { Producer } from 'kafkajs';
import { TransactionStatusEnum } from './dtos';
import { TransactionEnum } from './enums/index';

@Injectable()
export class AppService {
  constructor(
    @Inject('KAFKA_PRODUCER')
    private kafkaProducer: Producer,
  ) {}

  async validateValue(message: any) {
    const { transactionExternalId, value } = message;

    console.log('transactionExternalId: ', transactionExternalId);
    console.log('value: ', value);

    if (value > TransactionEnum.MAX_VALUE) {
      await this.kafkaProducer.send({
        topic: 'update_transaction_status',
        messages: [
          {
            key: 'transaction_rejected',
            value: JSON.stringify({
              transactionExternalId,
              status: TransactionStatusEnum.REJECTED,
            }),
          },
        ],
      });

      return;
    }

    await this.kafkaProducer.send({
      topic: 'update_transaction_status',
      messages: [
        {
          key: 'transaction_approved',
          value: JSON.stringify({
            transactionExternalId,
            status: TransactionStatusEnum.APPROVED,
          }),
        },
      ],
    });
  }
}
