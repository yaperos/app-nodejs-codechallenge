import {
  Transaction,
  TransactionOutput,
  TransactionParserService,
} from '../domain';

export class AppTransactionParserService implements TransactionParserService {
  parse(transaction: Transaction): TransactionOutput {
    return {
      createdAt: transaction.createdAt,
      transactionExternalId: transaction.externalId,
      transactionStatus: {
        name: transaction.status,
      },
      transactionType: {
        name: transaction.transactionType.name,
      },
      value: transaction.value,
    };
  }
}
