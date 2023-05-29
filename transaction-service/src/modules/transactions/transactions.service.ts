import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { TransactionsDto, TransactionsUpdateDto } from './dto';
import { TransactionsRepository } from 'src/adapters/database/mongo/transactions/transactions.repository';
import { Transactions } from 'src/adapters/database/mongo/transactions/transactions.schema';
import { ITransactionsService } from '../../ports/transactions/service/transactions.interface';

@Injectable()
export class TransactionsService implements ITransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async createTransaction(
    transactionsDto: TransactionsDto,
  ): Promise<Transactions | null> {
    try {
      return await this.transactionsRepository.create(transactionsDto);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal Server Error',
        error,
      });
    }
  }

  async updateTransactionStatus(
    transactionExternalId: string,
    status: string,
  ): Promise<Transactions> {
    try {
      const transactionsDto: TransactionsUpdateDto = {
        transactionExternalId,
        transactionStatus: {
          name: status,
        },
      };
      return await this.transactionsRepository.update(
        transactionExternalId,
        transactionsDto,
      );
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal Server Error',
        error,
      });
    }
  }

  async getTransactionById(
    transactionExternalId: string,
  ): Promise<Transactions> {
    try {
      return await this.transactionsRepository.getTransactionById(
        transactionExternalId,
      );
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal Server Error',
        error,
      });
    }
  }

  async getTransactions(): Promise<Transactions[]> {
    try {
      return await this.transactionsRepository.getAll();
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal Server Error',
        error,
      });
    }
  }
}
