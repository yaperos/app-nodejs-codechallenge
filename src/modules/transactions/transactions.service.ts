import { Injectable } from '@nestjs/common';

import { LoggerService } from '@shared/logger/logger.service';
import { CreateTransactionDto, TransactionDto } from './transactions.dto';

@Injectable()
export class TransactionsService extends LoggerService {
  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDto> {
    return {
      transactionExternalId: createTransactionDto.transactionExternalId,
      transactionType: { id: createTransactionDto.tranferTypeId, name: '' },
      transactionStatus: { name: 'PENDING' },
      value: createTransactionDto.value,
      createdAt: '2023-11-05',
    };
  }

  async getTransactionByExternalId(
    transactionExternalId,
  ): Promise<TransactionDto> {
    return {
      transactionExternalId: transactionExternalId,
      transactionType: { id: 0, name: '' },
      transactionStatus: { name: '' },
      value: 0,
      createdAt: '2023-11-05',
    };
  }
}
