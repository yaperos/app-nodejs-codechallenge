import { ExternalTransaction } from './external-transaction.entity';

export const EXTERNAL_TRANSACTION_REPOSITORY = 'ExternalTransactionRepository';

export interface ExternalTransactionRepository {
  create(doc: Partial<ExternalTransaction>): Promise<ExternalTransaction>;
  findById(id: string): Promise<ExternalTransaction>;
  updateStatusById(
    id: string,
    doc: Pick<ExternalTransaction, 'status'>,
  ): Promise<void>;
}
