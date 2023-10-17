import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionDto } from 'src/transactions/domain/dto/transaction.dto';
import { TransactionRepository } from 'src/transactions/domain/repository/transaction.repository';
import { FindTransaction } from 'src/transactions/domain/use-case/find-transaction';
import { TransactionMapper } from '../mapper/transaction.mapper';

@Injectable()
export class FindTransactionImpl implements FindTransaction {
  public constructor(
    @Inject('TRANSACTION_REPOSITORY')
    private readonly transactionRepository: TransactionRepository,
  ) {}

  public async execute(transactionId: string): Promise<TransactionDto> {
    const transaction =
      await this.transactionRepository.findTransaction(transactionId);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return TransactionMapper.toDto(transaction);
  }
}
