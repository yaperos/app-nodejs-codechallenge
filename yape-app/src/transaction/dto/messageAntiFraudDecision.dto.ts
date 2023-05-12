import { TransactionStatus } from 'src/entities';

export class AntiFraudDecision {
  transactionExternalId: string;
  transactionStatus: TransactionStatus;
}
