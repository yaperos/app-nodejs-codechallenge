import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { FraudCheckRequest } from 'src/dtos/requests/fraudcheck.request';
import { TransactionStatus } from 'src/shared/transaction-status.enum';

@Injectable()
export class AntiFraudService implements OnModuleInit {

  constructor(
    @Inject('ANTIFRAUD-EMITTER') private readonly kafkaClient: ClientKafka
  ){}

  async onModuleInit() {
    await this.kafkaClient.connect();
    this.kafkaClient.subscribeToResponseOf('transactionStatusUpdate');
  }

  async evaluateTransactionFraud(request: FraudCheckRequest) {
    const statusId = request.value > 1000 ? TransactionStatus.REJECTED : TransactionStatus.APPROVED;

    return this.kafkaClient.emit('transactionStatusUpdate', {
      transactionExternalId: request.transactionExternalId,
      statusId: statusId
    });
  
  }


}
