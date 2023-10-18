import { Injectable } from '@nestjs/common';
import { BaseDB } from '../../shared/repository/BaseDB';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository extends BaseDB {
  async updatedStatusOfTransaction(transactionId: string, statusId: number) {
    const manager = this.getDataSource().manager;
    await manager.update(
      Transaction,
      { transaction_external_id: transactionId },
      { transaction_status_id: statusId },
    );
  }

  async getTransactionById(transactionId: string) {
    const manager = this.getDataSource().manager;
    return await manager.findOne(Transaction, {
      where: { transaction_external_id: transactionId },
    });
  }
}
