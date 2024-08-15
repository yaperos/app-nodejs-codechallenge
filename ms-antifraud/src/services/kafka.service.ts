import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionDTO } from 'src/dto/transaction.dto';
import { TransactionStatus } from 'src/helper/contants';

@Injectable()
export class KafkaService {
  private readonly logger = new Logger('Fraude[KafkaService]');

  constructor(
    @Inject('ANTIFRAUDE_KAFKA_SERVICE')
    private readonly authClient: ClientKafka,
  ) {}
  verifyTransactionFraude(transaction: TransactionDTO) {
    const { transactionExternalId, value } = transaction;
    const status =
      value > 1000 ? TransactionStatus.REJECTED : TransactionStatus.APPROVED;

    this.logger.log(status);

    // return this.authClient.emit(
    //   'update-transaction',
    //   JSON.stringify({ transactionExternalId, status }),
    // );
  }
}
