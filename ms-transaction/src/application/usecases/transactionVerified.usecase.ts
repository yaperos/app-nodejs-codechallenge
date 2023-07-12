import { Inject, Injectable } from '@nestjs/common';
import { TransactionRepository } from '../../domain/ports/transaction.repository';
import Transaction from '../../domain/transaction';
import { Optional } from 'typescript-optional';
import { TransactionVerifiedDto } from '../dtos/transactionVerified.dto';

@Injectable()
export default class TransactionVerifiedUseCase {
  constructor(
    @Inject('TransactionRepository')
    private transactionRepository: TransactionRepository,
  ) {}

  public handler(data: TransactionVerifiedDto): Promise<Optional<Transaction>> {
    const updateTransaction = new Transaction({ status: data.status });
    return this.transactionRepository.updateTransaction(
      data.transactionId,
      updateTransaction,
    );
  }
}
