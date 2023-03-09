import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices/client';
import { ValidateTransactionType } from './types/antifraud';

@Injectable()
export class AppService {

  constructor(
    @Inject('TRANSACTIONS_MICROSERVICE') private readonly transactionsClient: ClientKafka
  ) { }

  validate(transaction: ValidateTransactionType) {
    Logger.log(`🗄️ ANTIFRAUD-SERVICE: Validating transaction`)
    this.transactionsClient
      .emit(
        transaction.value < 1000
          ? 'transaction.approve'
          : 'transaction.deny',
        JSON.stringify({ id: transaction.transactionExternalId })
      )
  }
}
