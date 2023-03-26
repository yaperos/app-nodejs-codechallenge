import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices/client';

@Injectable()
export class AppService {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionClient: ClientKafka,
  ) {}

  verifyAntiFraud(data) {
    Logger.debug('Checking anti-fraud');
    if (data.value <= 1000) {
      Logger.debug(`APPROVED transaction ${data.id}`);
      this.transactionClient.emit('transaction.approved', JSON.stringify(data));
    } else {
      Logger.debug(`REJECTED transaction ${data.id}`);
      this.transactionClient.emit('transaction.rejected', JSON.stringify(data));
    }
  }
}
