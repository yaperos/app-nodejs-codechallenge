import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { msConfig } from '../../../infraestructure/config';
import { TransactionInterface } from 'src/domain/transaction/transaction.model';
import { TRANSACTION_STATUS_ID } from 'src/application/constant';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(msConfig.nameAntiFraud)
    private readonly transactionClient: ClientKafka,
  ) {}

  updateTransaction(trx: TransactionInterface): void {
    try {
      this.transactionClient.emit(
        `${msConfig.nameTransactions}-update-transaction-${trx.status === TRANSACTION_STATUS_ID.ACCEPTED ? 'accepted' : 'rejected'}`,
        JSON.stringify(trx),
      );
    } catch (error) {
      console.log(error);
    }
  }
}
