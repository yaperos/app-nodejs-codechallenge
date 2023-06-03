import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionPayloadDto } from './transaction.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('ANTIFRAUD_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  verifyTransaction(transactionPayload: CreateTransactionPayloadDto) {
    const { transactionExternalId, value: transactionValue } =
      transactionPayload;
    const status = transactionValue > 1000 ? 'rejected' : 'approved';

    this.kafkaClient.emit('updateTransactionStatus', {
      value: { transactionExternalId, data: { status } },
    });
  }
}
