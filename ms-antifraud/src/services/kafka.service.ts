import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionDTO } from 'src/dto/transaction.dto';
import { TransactionStatus } from 'src/helper/contants';

@Injectable()
export class KafkaService {
  private readonly logger = new Logger('AntiFraude KafkaService');

  constructor(
    @Inject('ANTIFRAUDE_KAFKA_SERVICE')
    private readonly authClient: ClientKafka,
  ) {}
  verifyTransactionFraude(transaction: TransactionDTO) {
    const { transactionExternalId, value } = transaction;
    const status =
      value > 1000 ? TransactionStatus.REJECTED : TransactionStatus.APPROVED;

    const statusDescription = TransactionStatus[status];
    this.logger.debug(JSON.stringify({ transactionExternalId, statusDescription }));

    return this.authClient.emit(
      'transaction-update',
      JSON.stringify({ transactionExternalId, status }),
    );
  }
}
