import { ITransactionCreator } from './transaction-creator.interface';
import { ITransactionReader } from './transaction-reader.interface';
import { ITransactionUpdater } from './transaction-updater.interface';
import { ITransactionDeleter } from './transaction-deleter.interface';

/**
 * Complete transaction service interface
 * Composed of segregated interfaces following ISP
 */
export interface ITransactionService 
  extends ITransactionCreator, 
          ITransactionReader, 
          ITransactionUpdater, 
          ITransactionDeleter {
}

// Export all individual interfaces for specific use cases
export { ITransactionCreator } from './transaction-creator.interface';
export { ITransactionReader } from './transaction-reader.interface';
export { ITransactionUpdater } from './transaction-updater.interface';
export { ITransactionDeleter } from './transaction-deleter.interface';
