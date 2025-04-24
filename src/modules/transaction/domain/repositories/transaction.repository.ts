import { Transaction } from '@/modules/transaction/domain/entities/transaction.entity';

/**
 * Abstract definition of the Transaction Repository.
 * 
 * This interface defines the contract for any persistence implementation
 * that interacts with transaction entities.
 */
export abstract class TransactionRepository {
  /**
   * Finds a transaction by its unique identifier.
   *
   * @param id - The unique ID of the transaction.
   * @returns A Promise resolving to the transaction if found, otherwise null.
   */
  abstract findById(id: string): Promise<Transaction | null>;

  /**
   * Persists a new transaction to the data store.
   *
   * @param transaction - The transaction entity to save.
   * @returns A Promise resolving to the persisted transaction.
   */
  abstract save(transaction: Transaction): Promise<Transaction>;
  
  /**
   * Updates the status of an existing transaction.
   *
   * @param id - The unique ID of the transaction to update.
   * @param statusId - The new status ID to apply.
   * @returns A Promise resolving to the updated transaction.
   */
  abstract updateStatus(id: string, statusId: number): Promise<Transaction>;
}
