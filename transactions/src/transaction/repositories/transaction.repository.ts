import { Injectable } from '@nestjs/common';
import { BaseDB } from '../../shared/repository/BaseDB';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository extends BaseDB {
  async updatedStatusOfTransaction(transactionId: string, statusId: number) {
    const manager = this.getDataSource().manager;
    await manager.update(
      Transaction,
      { id_transaction: transactionId },
      { transfer_status_id: statusId },
    );
  }

  async getTransactionById(transactionId: string) {
    const manager = this.getDataSource().manager;
    return await manager.findOne(Transaction, {
      where: { id_transaction: transactionId },
    });
  }
}
