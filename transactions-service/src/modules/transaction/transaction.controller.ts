import { TransactionStatus } from '@prisma/client';
import { injectable } from 'inversify';
import { TransactionService } from './transaction.service';
import { Transaction, TransactionInput } from '../../graphql/types/types';

/**
 * Controller used to handle transaction related requests
 */
@injectable()
class TransactionController {
  /** Transaction service instance */
  private readonly _service: TransactionService;

  /**
   * @param {TransactionService} service Transaction service
   */
  constructor(service: TransactionService) {
    this._service = service;
  }

  /**
   * Handle an incoming update request from an event streamer
   * @param {string} message Message received from event streamer
   * @param {TransactionStatus} status The new status of the transaction
   * @returns {Promise<Transaction>} A Promise with the updated transaction
   */
  handleUpdateTransactionStatus = async (
    message: string,
    status: TransactionStatus,
  ): Promise<Transaction> => {
    try {
      // Parse message to get Transaction data
      const transactionData: Transaction = JSON.parse(message);

      // Update the Transaction status
      const transaction = await this._service.updateStatus(
        transactionData.transactionExternalId,
        status,
      );

      // Resolve updated Transaction
      return Promise.resolve(transaction);
    } catch (error) {
      console.error('Something went wrong when updating transaction', { message, error });
      return Promise.reject(error);
    }
  };

  /**
   * Handle a request to create a new Transaction
   * @param {TransactionInput} data The data to create the transaction.
   * @returns {Promise<Transaction>} A Promise with the created transaction
   */
  handleCreateTransaction = async (data: TransactionInput): Promise<Transaction> => {
    try {
      // Create a new Transaction
      const transaction = this._service.create(data);

      // Resolve created Transaction
      return Promise.resolve(transaction);
    } catch (error) {
      console.error('Something went wrong when creating transaction', { error });
      return Promise.reject(error);
    }
  };

  /**
   * Handle a request to get a Transaction by ID
   * @param {string} id The id of the transaction to fetch
   * @returns {Promise<Transaction>} A Promise with the transaction that matches the provided id
   */
  handleGetTransaction = async (id: string): Promise<Transaction> => {
    try {
      // Get a Transaction matching the provided id
      const transaction = await this._service.get(id);

      // Resolve found Transaction
      return Promise.resolve(transaction);
    } catch (error) {
      console.error('Something went wrong when getting the transaction', { id, error });
      return Promise.reject(error);
    }
  };
}

export { TransactionController };
