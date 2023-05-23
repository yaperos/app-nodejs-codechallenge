import { PrismaClient, TransactionStatus } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ErrorBuilder } from '../../error/error.builder';
import { Transaction, TransactionInput } from '../../graphql/types/types';
import { EventStreamer } from '../../config/event.streamer.interface';
import { mapPrismaToGQLTransaction } from './transaction.mapper';
import { Symbols } from '../../@types';

/**
 * Service used to execute Transaction operations
 */
@injectable()
class TransactionService {
  /** Prisma client instance */
  private readonly _client: PrismaClient;

  /** Event Streamer client instance */
  private readonly _streamer: EventStreamer;

  /**
   * @param {PrismaClient} prismaClient Prisma client
   * @param {EventStreamer} eventStreamer Event Streamer client
   */
  constructor(
    prismaClient: PrismaClient,
    @inject(Symbols.EventStreamer) eventStreamer: EventStreamer
  ) {
    this._client = prismaClient;
    this._streamer = eventStreamer;
  }

  /**
   * Fetch a Transaction with its ID
   * @param {string} id The id of the Transaction to fetch
   * @returns {Promise<Transaction>} A Promise with the Transaction that matches the provided id
   */
  async get(id: string): Promise<Transaction> {
    try {
      const transaction = await this._client.transaction.findUnique(
        { where: { transactionExternalId: id }, include: { transactionType: true } }
      );

      if (!transaction) {
        return Promise.reject(ErrorBuilder.notFoundError('Transaction not found'));
      }

      return Promise.resolve(mapPrismaToGQLTransaction(transaction));
    } catch (error) {
      console.error(error);
      return Promise.reject(ErrorBuilder.internalError('Error while getting transaction'));
    }
  }

  /**
   * Create a new Transaction
   * @param {TransactionInput} data The data to create the Transaction.
   * @returns {Promise<Transaction>} A Promise with the created Transaction
   */
  async create(data: TransactionInput): Promise<Transaction> {
    try {
      if (data.value <= 0) {
        return Promise.reject(ErrorBuilder.badRequestError('Transaction value cannot be 0 or less'));
      }

      const type = await this._client.transactionType.findUnique({
        where: { id: data.transactionTypeId },
      });

      if (!type) {
        return Promise.reject(ErrorBuilder.badRequestError('Transaction type does not exists'));
      }

      const transaction = await this._client.transaction.create({ data });

      await this._streamer.sendMessage('transaction-created', JSON.stringify(transaction));

      return Promise.resolve(mapPrismaToGQLTransaction(transaction));
    } catch (error) {
      console.error(error);
      return Promise.reject(ErrorBuilder.internalError('Error while creating transaction'));
    }
  }

  /**
   * Update the status of an existing Transaction
   * @param {string} id The id of the Transaction to update
   * @param {TransactionStatus} status The new status of the Transaction
   * @returns {Promise<Transaction>} A Promise with the updated Transaction
   */
  async updateStatus(id: string, status: TransactionStatus): Promise<Transaction> {
    try {
      const transaction = await this._client.transaction.update({
        where: { transactionExternalId: id }, data: { transactionStatus: status },
      });

      return Promise.resolve(mapPrismaToGQLTransaction(transaction));
    } catch (error) {
      console.error(error);
      return Promise.reject(ErrorBuilder.internalError('Error while updating transaction'));
    }
  }
}

export { TransactionService };
