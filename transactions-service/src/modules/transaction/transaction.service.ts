import { PrismaClient } from '@prisma/client';
import { ErrorBuilder } from '../../error/error.builder';
import { Transaction, TransactionInput } from '../../graphql/types/types';

export class TransactionService {
  private readonly client: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.client = prismaClient;
  }

  async get(id: string): Promise<Transaction> {
    try {
      const transaction = await this.client.transaction.findUnique(
        { where: { transactionExternalId: id }, include: { transactionType: true } }
      );

      if (!transaction) {
        return Promise.reject(ErrorBuilder.notFoundError('Transaction not found'));
      }

      return Promise.resolve(transaction);
    } catch (error) {
      console.error(error);
      return Promise.reject(ErrorBuilder.internalError('Error while getting transaction'));
    }
  }

  async create(data: TransactionInput): Promise<Transaction> {
    try {
      const type = await this.client.transactionType.findUnique({
        where: { id: data.transactionTypeId },
      });

      if (!type) {
        return Promise.reject(ErrorBuilder.badRequestError('Transaction type does not exists'));
      }

      const transaction = await this.client.transaction.create({ data });

      return Promise.resolve(transaction);
    } catch (error) {
      console.error(error);
      return Promise.reject(ErrorBuilder.internalError('Error while creating transaction'));
    }
  }
}
