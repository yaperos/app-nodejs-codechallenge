import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { HttpService } from '@nestjs/axios';

import {
  Transaction,
  TransactionFull,
  TransactionType,
  TransactionStatus,
} from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { TransactionRepository } from '../repositories/transaction.repository';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly httpService: HttpService,
  ) {}

  async retrieveTransaction(
    transactionExternalId: string,
  ): Promise<Transaction> {
    const fullTransaction =
      await this.transactionRepository.retrieveTransactionById(
        transactionExternalId,
      );

    const transactionType = new TransactionType(fullTransaction.transferTypeId);
    const transactionStatus = new TransactionStatus(fullTransaction.status);

    const transaction = new Transaction(
      fullTransaction.transactionExternalId,
      transactionType,
      transactionStatus,
      fullTransaction.value,
      fullTransaction.createdAt,
    );

    return transaction;
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionFull> {
    let transaction = new TransactionFull(
      uuidv4(),
      createTransactionDto.accountExternalIdDebit,
      createTransactionDto.accountExternalIdCredit,
      createTransactionDto.transferTypeId,
      createTransactionDto.value,
      'pending',
      new Date(),
    );

    transaction = await this.transactionRepository.createTransaction(
      transaction,
    );

    try {
      const response = await this.httpService
        .post('http://antifraud-api:4000/', transaction)
        .toPromise();
    } catch (error) {
      throw new Error('Error al crear la transacción: ' + error);
    }

    return transaction;
  }

  async updateTransaction(
    transaction: TransactionFull,
  ): Promise<TransactionFull> {
    return await this.transactionRepository.updateTransactionStatus(
      transaction.transactionExternalId,
      transaction.status,
    );
  }
}
