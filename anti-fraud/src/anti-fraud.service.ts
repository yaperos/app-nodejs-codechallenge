import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { TransactionStatuses } from './enums/transaction-statuses.enum';

@Injectable()
export class AntiFraudService {
  constructor(@Inject('KAFKA_TRANSACTION') private client: ClientKafka) {}

  async validateTransaction(data: any) {
    const { transactionExternalId, value } = data;
    const transactionStatus = this.validateTransactionValue(value);
    await this.emitToTransaction({ transactionExternalId, transactionStatus });
  }

  private validateTransactionValue(value: number) {
    return value > 1000
      ? TransactionStatuses.REJECTTED
      : TransactionStatuses.APPROVED;
  }

  private async emitToTransaction({ transactionExternalId, status }: any) {
    this.client.emit('transaction_status_handle', {
      transactionExternalId,
      status,
    });
  }
}
