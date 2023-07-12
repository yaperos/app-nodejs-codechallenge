import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionDto } from './dtos/transaction.dto';
import { TRANSACTION_STATE } from './constants/constants';
import { TransactionResponseDto } from './dtos/transaction-response.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('ANTI_FRAUD_MICROSERVICE')
    private readonly kafkaService: ClientKafka,
  ) {}
  validateTransactionAntiFraud(data: TransactionDto) {
    const { transactionExternalId, value } = data;
    const transactionResponseDto: TransactionResponseDto = {
      transactionId: transactionExternalId,
      status:
        value > 1000 ? TRANSACTION_STATE.REJECTED : TRANSACTION_STATE.APPROVED,
    };
    const message = JSON.stringify(transactionResponseDto);
    this.kafkaService.emit('transaction-verified', message);
  }
}
