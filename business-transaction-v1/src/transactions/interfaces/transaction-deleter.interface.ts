/**
 * Interface for transaction deletion operations
 * Segregated responsibility: Only handles transaction removal
 */
export interface ITransactionDeleter {
  remove(id: string): Promise<void>;
}
