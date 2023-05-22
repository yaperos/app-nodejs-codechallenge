import { TransactionStatus } from '@prisma/client';
import { injectable } from 'inversify';
import { TransactionService } from './transaction.service';
import { Transaction, TransactionInput } from '../../graphql/types/types';

@injectable()
export class TransactionController {
  private service: TransactionService;

  constructor(service: TransactionService) {
    this.service = service;
  }

  handleUpdateTransactionStatus = async (
    message: string,
    status: TransactionStatus,
  ): Promise<Transaction> => {
    try {
      const transactionData: Transaction = JSON.parse(message);
      const transaction = await this.service.updateStatus(
        transactionData.transactionExternalId,
        status,
      );
      return Promise.resolve(transaction);
    } catch (error) {
      console.error('Something went wrong when updating transaction', { message, error });
      return Promise.reject(error);
    }
  };

  handleCreateTransaction = async (data: TransactionInput) => {
    try {
      const transaction = this.service.create(data);
      return Promise.resolve(transaction);
    } catch (error) {
      console.error('Something went wrong when creating transaction', { error });
      return Promise.reject(error);
    }
  };

  handleGetTransaction = async (id: string) => {
    try {
      const transaction = await this.service.get(id);
      return Promise.resolve(transaction);
    } catch (error) {
      console.error('Something went wrong when getting the transaction', { id, error });
      return Promise.reject(error);
    }
  };
}
