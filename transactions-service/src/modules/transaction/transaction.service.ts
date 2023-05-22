import { PrismaClient, TransactionStatus } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ErrorBuilder } from '../../error/error.builder';
import { Transaction, TransactionInput } from '../../graphql/types/types';
import { EventStreamer } from '../../config/event.streamer.interface';
import { mapPrismaToGQLTransaction } from './transaction.mapper';
import { Symbols } from '../../@types';

@injectable()
export class TransactionService {
  private readonly _client: PrismaClient;

  private readonly _streamer: EventStreamer;

  constructor(
    prismaClient: PrismaClient,
    @inject(Symbols.EventStreamer) eventStreamer: EventStreamer
  ) {
    this._client = prismaClient;
    this._streamer = eventStreamer;
  }

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
