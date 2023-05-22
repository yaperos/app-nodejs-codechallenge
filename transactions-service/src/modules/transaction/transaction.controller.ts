import { Transaction, TransactionStatus } from '@prisma/client';
import { TransactionService } from './transaction.service';

export class TransactionController {
  private service: TransactionService;

  constructor(service: TransactionService) {
    this.service = service;
  }

  handleUpdateTransactionStatus = async (message: string, status: TransactionStatus) => {
    try {
      const transactionData: Transaction = JSON.parse(message);
      await this.service.updateStatus(transactionData.transactionExternalId, status);
    } catch (error) {
      console.error('Something went wrong when updating transaction', { message, error });
    }
  };
}
