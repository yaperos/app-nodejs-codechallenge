import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { TransactionRepository } from './repository/transaction.repository';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import {
  ITransactionPayload,
  ITransactionResponse,
} from './interfaces/transaction.interface';
import { StatusTransactions } from './enums/status.enum';
import { TransactionException } from './exceptions/transaction.exception';

@Injectable()
export class TransactionService {
  constructor(private repository: TransactionRepository) {}

  public async createTransanction(
    transactions: CreateTransactionDto[],
  ): Promise<ITransactionResponse[]> {
    transactions.map((transaction) => {
      if (this.isNegative(transaction.value)) {
        throw new TransactionException(
          `El monto ingresado: ${transaction.value} no es un valor valido en la transaction: ${transaction.accountExternalIdDebit}`,
        );
      }
      transaction.id = uuidv4();
      return transaction;
    });

    return await this.repository.createTransactions(transactions);
  }

  public async updateTransaction(
    transactions: ITransactionPayload[],
  ): Promise<ITransactionResponse[]> {
    const response: ITransactionResponse[] = [];
    for (const transaction of transactions) {
      if (transaction.value > 1000) {
        transaction.status = StatusTransactions.Rejected;
      } else {
        transaction.status = StatusTransactions.Approved;
      }
      const data = await this.repository.updateTransaction(transaction);
      response.push(data);
    }
    return response;
  }

  public async getAllTransaction(): Promise<ITransactionResponse[]> {
    return await this.repository.getTransactions();
  }

  public async getTransaction(id: string) {
    const response = await this.repository.findByTransactionId(id);
    if (!response) {
      throw new NotFoundException(`Transaction no encontrada con el id: ${id}`);
    }
    return await this.repository.findByTransactionId(id);
  }

  private isNegative(num: number) {
    if (Math.sign(num) === -1) {
      return true;
    }
    return false;
  }
}
