import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TransactionStatus } from './transaction-status';
import { DataBaseService } from 'src/database/database.service';

export interface TransactionData {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
}

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(private databaseService: DataBaseService) {}

  async create(transactionData: TransactionData) {
    try {
      const {
        accountExternalIdDebit,
        accountExternalIdCredit,
        transferTypeId,
        value,
      } = transactionData;

      const newTransaction = await this.databaseService.saveTransaction({
        accountExternalIdDebit,
        accountExternalIdCredit,
        transferTypeId,
        value,
        status: TransactionStatus.PENDING,
      });

      this.logger.log(`Transaction created: ${newTransaction.id}`);

      return newTransaction;
    } catch (error) {
      this.logger.error(
        `Error creating transaction: ${error.message} ${randomUUID()}`,
      );
      throw error;
    }
  }

  async updateTransactionStatus(id: string, status: TransactionStatus) {
    try {
      const isUpdated = await this.databaseService.updateTransactionStatus(
        id,
        status,
      );
      if (!isUpdated) {
        this.logger.log(`Transaction status updated: ${id} `);
      } else {
        this.logger.log(`Transaction status NOT updated: ${id} `);
      }
      return isUpdated;
    } catch (error) {
      this.logger.error(
        `Error updating transaction status: ${error.message} ${randomUUID()}`,
      );
      throw error;
    }
  }
}
