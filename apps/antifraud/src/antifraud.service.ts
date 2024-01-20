import { Inject, Injectable } from '@nestjs/common';
import { TransactionToValidate } from './dto/transaction-to-validate.dto';
import { TRANSACTION_STATUS } from 'apps/transactions/src/constants/transactions.constants';
import { TRANSACTIONS_CLIENT_ID } from 'default/common/constants';
import { ClientKafka } from '@nestjs/microservices';
//import { TransactionReceivedEvent } from './events/transaction-received.event';

@Injectable()
export class AntifraudService {
  constructor(
    @Inject(TRANSACTIONS_CLIENT_ID)
    private readonly transactionsClient: ClientKafka,
  ) {}

  transactionValidator({ transactionId, value }: TransactionToValidate) {
    console.log('data listening in transactionValidator', transactionId, value);
    let status = TRANSACTION_STATUS.REJECTED;
    if (value < 1000) {
      status = TRANSACTION_STATUS.APPROVED;
    }
    this.transactionsClient.emit(
      'transaction_validated',
      JSON.stringify({ transactionId, status }),
    );
  }
}
