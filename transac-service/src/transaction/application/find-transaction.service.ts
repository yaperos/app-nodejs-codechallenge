import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TransactionRepositoryInterface } from '../domain/repository/transaction.repository.interface';
import { FindTransactionResponseDto } from '../domain/dtos/find-transaction-response.dto';
import { TransactionType } from '../domain/enums/transaction-type';

@Injectable()
export class FindTransactionService {
  constructor(private readonly repository: TransactionRepositoryInterface) {}

  async execute(id: string): Promise<FindTransactionResponseDto> {
    try {
      const transaction = await this.repository.findOne(id);
      return {
        transactionExternalId: transaction.transactionExternalId,
        transactionType: {
          name: Object.keys(TransactionType).find(
            (key) => TransactionType[key] === transaction.transactionType,
          ),
        },
        transactionStatus: {
          name: transaction.transactionStatus,
        },
        value: transaction.value,
        createdAt: transaction.createdAt,
      };
    } catch (error) {
      Logger.error(`An Error occurred searching the id ${id}`);
      throw new NotFoundException("Transaction don't exist.");
    }
  }
}
