import { TransactionDAO } from '@app/common/database/models/dao';
import { TransactionRespository } from '@app/common/database/models/repositories/transaction.repository';
import { Injectable } from '@nestjs/common';
import {
  DataTransactionCreateDTO,
  DataUpdateTransactionDTO,
} from './transactions.dto';
import { TransactionsEntity } from '@app/common/database/models';

@Injectable()
export class TransactionsService {
  constructor(
    public readonly transactionRepository: TransactionRespository,
    public readonly transactionDAO: TransactionDAO,
  ) {}

  async listTransaction(): Promise<TransactionsEntity[]> {
    const response = await this.transactionRepository.list();
    return response;
  }

  async createTransaction(
    dataTransaction: DataTransactionCreateDTO,
  ): Promise<TransactionsEntity> {
    const _transaction =
      this.transactionDAO.dataCreateTransaction(dataTransaction);
    const response = await this.transactionRepository.save(_transaction);
    return response;
  }

  async updateTransaction(
    id: number,
    update: DataUpdateTransactionDTO,
  ): Promise<any> {
    const response = await this.transactionRepository.update(id, update);
    return response;
  }
}
