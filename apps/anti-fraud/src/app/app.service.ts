import { Injectable } from '@nestjs/common';
import { TransactionCreatedEvent, TransactionCreatedEventResponse } from '@nodejs-codechallenge/shared/dto';
import { TransactionAmountValidator } from './transaction-amount-validator';

@Injectable()
export class AppService {

  constructor(
    private readonly transactionAmountValidator: TransactionAmountValidator
  ){}

  validateTransaction(transactionCreatedEvent: TransactionCreatedEvent) : TransactionCreatedEventResponse {
    return {
      transactionExternalId: transactionCreatedEvent.transactionExternalId,
      status: this.transactionAmountValidator.isValid(transactionCreatedEvent.amount)
    };
  }
}
