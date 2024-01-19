import { Inject } from '@nestjs/common';

import {
  TRANSACTION_CLIENT_PROVIDER_ALIAS,
  TransactionClientProvider,
  TransactionOutput,
} from '../../domain/providers/transaction-client.provider';

export class TransactionFinder {
  constructor(
    @Inject(TRANSACTION_CLIENT_PROVIDER_ALIAS)
    private readonly transactionClientProvider: TransactionClientProvider,
  ) {}

  async run(transactionId: string): Promise<TransactionOutput> {
    return this.transactionClientProvider.findOne(transactionId);
  }
}
