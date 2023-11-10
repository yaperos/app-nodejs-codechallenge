import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { RetrieveTransaction, TransactionStatus, TransactionType } from '../domain/transaction.entity';
import { ITransactionsRepository } from '../domain/repository.interface';

@Injectable()
export class TransactionsRepository implements ITransactionsRepository{
  constructor(
    @InjectRepository(RetrieveTransaction)
    private transactionRepository: Repository<RetrieveTransaction>,
    @InjectRepository(TransactionStatus)
    private transactionStatusRepository: Repository<TransactionStatus>,
    @InjectRepository(TransactionType)
    private transactionTypeRepository: Repository<TransactionType>,
  ) {}

  async retrieve(id: string): Promise<RetrieveTransaction> {
    const transaction = await this.transactionRepository.findOne({
      where: {
        transactionExternalId: id,
      },
    });

    if (!transaction) {
      throw new Error(`La transacción con ID ${id} no se encontró.`);
    }

    return transaction;
  }

  async retrieveAll():Promise<RetrieveTransaction[]>{
    const transaction = await this.transactionRepository.find({});

    if (!transaction) {
      throw new Error(`No se encontró data.`);
    }

    return transaction;
  }

  async transaction(
    data: CreateTransactionInput,
  ): Promise<RetrieveTransaction> {
    try {
      const transactionStatus = await this.transactionStatusRepository.create({
        name: 'pending',
      });
      const transactionStatusInserted =
        await this.transactionStatusRepository.save(transactionStatus);

      const transactionType = await this.transactionTypeRepository.create({
        name: data.accountExternalIdDebit,
      });
      const transactionTypeInserted = await this.transactionTypeRepository.save(
        transactionType,
      );

      const retrieveTransaction = this.transactionRepository.create({
        value: data.value,
        transactionStatus: transactionStatusInserted,
        transactionType: transactionTypeInserted,
      });

      const response = await this.transactionRepository.save(
        retrieveTransaction,
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const transaction = await this.transactionRepository.delete(id);

    if (!transaction) {
      throw new Error(`La transacción con ID ${id} no se encontró.`);
    }

    return transaction;
  }
}
