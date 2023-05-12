import { TransactionStatus } from './transaction.dto';

export class AntiFraudDecision {
  transactionExternalId: string;
  transactionStatus: TransactionStatus;
}
