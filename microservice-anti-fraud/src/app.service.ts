import { Inject, Injectable } from '@nestjs/common';
import { TransactionDto } from './dto/transaction.dto';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionResponseDto } from './dto/transaction.response.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('ANTI_FRAUD_SERVICE') private readonly kafkaService: ClientKafka,
  ) {}

  validateTransaction(transaction: TransactionDto) {
    const { transactionExternalId, value } = transaction;
    const transactionResponseDto: TransactionResponseDto = {
      id: transactionExternalId,
      status: value > 1000 ? 'rejected' : 'approved',
    };
    const message = JSON.stringify(transactionResponseDto);
    this.kafkaService.emit('transaction-verified', message);
  }
}
