import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MAX_VALUE_TRANSACTION, TRASANCTION_STATUS_APPROVED, TRASANCTION_STATUS_REJECTED } from './commons/constanst';
import { MessageTransactionDto } from './dto/message-transaction.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('ANTIFRAUD_MICROSERVICE') private readonly antiFraudEmitter: ClientKafka,
  ) {}
  verifyTransaction(message:MessageTransactionDto) {
    const status = message.value > MAX_VALUE_TRANSACTION ? TRASANCTION_STATUS_REJECTED : TRASANCTION_STATUS_APPROVED
    return this.antiFraudEmitter.emit('transaction.verified', JSON.stringify(
      {
        transactionExternalId: message.transactionExternalId,
        status,
      }
    ));
  }
}
