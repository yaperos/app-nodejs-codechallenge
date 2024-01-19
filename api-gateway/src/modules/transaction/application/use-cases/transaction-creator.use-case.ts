import { Inject } from '@nestjs/common';

import {
  CreateTransactionInput,
  TRANSACTION_CLIENT_PROVIDER_ALIAS,
  TransactionClientProvider,
  TransactionOutput,
} from '../../domain/providers/transaction-client.provider';

export class TransactionCreator {
  constructor(
    @Inject(TRANSACTION_CLIENT_PROVIDER_ALIAS)
    private readonly transactionClientProvider: TransactionClientProvider,
  ) {}

  async run(params: CreateTransactionInput): Promise<TransactionOutput> {
    return this.transactionClientProvider.create(params);
  }
}
