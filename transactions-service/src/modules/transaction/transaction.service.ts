import { PrismaClient, TransactionStatus } from '@prisma/client';
import { ErrorBuilder } from '../../error/error.builder';
import { Transaction, TransactionInput } from '../../graphql/types/types';
import { EventStreamer } from '../../config/event.streamer.interface';
import { mapPrismaToGQLTransaction } from './transaction.mapper';

export class TransactionService {
  private readonly client: PrismaClient;

  private readonly kafka: EventStreamer;

  constructor(prismaClient: PrismaClient, kafkaClient: EventStreamer) {
    this.client = prismaClient;
    this.kafka = kafkaClient;
  }

  async get(id: string): Promise<Transaction> {
    try {
      const transaction = await this.client.transaction.findUnique(
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

      const type = await this.client.transactionType.findUnique({
        where: { id: data.transactionTypeId },
      });

      if (!type) {
        return Promise.reject(ErrorBuilder.badRequestError('Transaction type does not exists'));
      }

      const transaction = await this.client.transaction.create({ data });

      await this.kafka.sendMessage('transaction-created', JSON.stringify(transaction));

      return Promise.resolve(mapPrismaToGQLTransaction(transaction));
    } catch (error) {
      console.error(error);
      return Promise.reject(ErrorBuilder.internalError('Error while creating transaction'));
    }
  }

  async updateStatus(id: string, status: TransactionStatus): Promise<Transaction> {
    try {
      const transaction = await this.client.transaction.update({
        where: { transactionExternalId: id }, data: { transactionStatus: status },
      });

      return Promise.resolve(mapPrismaToGQLTransaction(transaction));
    } catch (error) {
      console.error(error);
      return Promise.reject(ErrorBuilder.internalError('Error while updating transaction'));
    }
  }
}
