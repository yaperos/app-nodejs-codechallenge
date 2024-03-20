import { Inject, Injectable } from '@nestjs/common';
import type { ClientKafka } from '@nestjs/microservices';
import { EVENT_TOPIC } from 'src/shared/utils/constant';
import { LoggerService } from '../../services/logger/logger.service';
import type { VerifiedTransactionDto } from '../dtos/verified-transaction.dto';

@Injectable()
export class TransactionProducer {
  constructor(
    @Inject('ATIFRAUDE_SERVICE')
    private readonly transactionClient: ClientKafka,
    private readonly loggerService: LoggerService,
  ) {}

  verifiedTransaction(verifiedTransaction: VerifiedTransactionDto): void {
    this.loggerService.log(
      TransactionProducer.name,
      `Sending verified transaction: ${JSON.stringify(verifiedTransaction)}`,
    );

    this.transactionClient.emit(
      EVENT_TOPIC.TRANSACTION.UPDATE_STATUS_TRANSACTION,
      verifiedTransaction,
    );
  }
}
