import type { Optional } from 'src/shared/utils/optional';
import type { TransactionEntity } from '../entities/transaction.entity';
import type { TransferStatus } from '../interfaces/transaction.interface';

export abstract class TransactionRepository {
  abstract findByExternalId(
    externaId: string,
  ): Promise<Optional<TransactionEntity>>;
  abstract create(transaction: TransactionEntity): Promise<void>;
  abstract updateStatus(
    externalId: string,
    status: TransferStatus,
  ): Promise<void>;
}
