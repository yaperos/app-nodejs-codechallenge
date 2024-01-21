import { Inject, Injectable } from '@nestjs/common';
import { TransactionToValidate } from './dto/transaction-to-validate.dto';
import { TRANSACTION_STATUS } from 'apps/transactions/src/constants/transactions.constants';
import { TRANSACTIONS_CLIENT_ID } from 'default/common/constants';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AntifraudService {
  constructor(
    @Inject(TRANSACTIONS_CLIENT_ID)
    private readonly transactionsClient: ClientKafka,
  ) {}

  transactionValidator({ transactionExternalId, value }: TransactionToValidate) {
    let status = TRANSACTION_STATUS.REJECTED;
    if (value < 1000) {
      status = TRANSACTION_STATUS.APPROVED;
    }
    this.transactionsClient.emit(
      'transaction_validated',
      JSON.stringify({ transactionExternalId, status }),
    );
  }
}
