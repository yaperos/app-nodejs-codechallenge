import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Optional } from 'typescript-optional';
import { TransactionRepository } from '../../../domain/ports/transaction.repository';
import Transaction from '../../../domain/transaction';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from './entity/transaction.entity';
import TransactionMapper from '../../../infrastructure/mapper/transaction.mapper';
import { TRANSACTION_STATE } from '../../../application/constants/constants';

@Injectable()
export default class TransactionRepositoryTypeORM
  implements TransactionRepository
{
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly _transactionRepository: Repository<TransactionEntity>,
  ) {}
  async getAllTransactions(): Promise<Transaction[]> {
    const transactions = await this._transactionRepository.find();
    return TransactionMapper.toDomains(transactions);
  }
  async getTransaction(transactionId: string): Promise<Optional<Transaction>> {
    const transaction = await this._transactionRepository.findOneBy({
      transactionId,
    });
    if (!transaction) throw new NotFoundException('Esta transaccion no existe');
    return TransactionMapper.toDomain(transaction);
  }
  async createTransaction(
    transaction: Transaction,
  ): Promise<Optional<Transaction>> {
    const newTransactionEntity = new TransactionEntity();
    newTransactionEntity.accountExternalIdCredit =
      transaction.getAccountExternalIdCredit();

    newTransactionEntity.accountExternalIdDebit =
      transaction.getAccountExternalIdDebit();

    newTransactionEntity.tranferTypeId = transaction.getTranferTypeId();
    newTransactionEntity.value = transaction.getValue();
    newTransactionEntity.status = TRANSACTION_STATE.PENDING;
    const newTransaction = await this._transactionRepository.save(
      newTransactionEntity,
    );
    return TransactionMapper.toDomain(newTransaction);
  }
  async deleteTransaction(
    transactionId: string,
  ): Promise<Optional<Transaction>> {
    const transactionDeleted = await this._transactionRepository.delete({
      transactionId,
    });
    return transactionDeleted.raw;
  }
  async updateTransaction(
    transactionId: string,
    transaction: Transaction,
  ): Promise<Optional<Transaction>> {
    const transactionExist = await this._transactionRepository.findOneBy({
      transactionId,
    });
    if (!transactionExist)
      throw new NotFoundException('Esta transaccion no existe');
    const updatedTransaction = Object.assign(transactionExist, transaction);
    const transactionUpdate = await this._transactionRepository.update(
      {
        transactionId,
      },
      updatedTransaction,
    );
    return transactionUpdate.raw;
  }
}
