import { Inject, Injectable } from '@nestjs/common';
import type { ClientKafka } from '@nestjs/microservices';
import { LoggerService } from '../../../infrastructure/services/logger/logger.service';
import { EVENT_TOPIC } from '../../../shared/utils/constant';
import type { VerifyTransactionDto } from '../dtos/verify-transaction.dto';

@Injectable()
export class TransactionProducer {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionClient: ClientKafka,
    private readonly loggerService: LoggerService,
  ) {}

  verifyTransaction(verifyTransaction: VerifyTransactionDto): void {
    this.loggerService.log(
      'Sending verify transaction event',
      JSON.stringify(verifyTransaction),
    );

    this.transactionClient.emit(
      EVENT_TOPIC.TRANSACTION.VERIFY_TRANSACTION,
      verifyTransaction,
    );
  }
}
