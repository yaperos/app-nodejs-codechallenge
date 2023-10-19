import { Inject, Injectable } from '@nestjs/common';
import { TransactionStatus } from '../../domain/enums/transaction-status.enum';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';

@Injectable()
export class TransactionEventHandler {
  constructor(
    @Inject(TransactionRepository) private readonly transactionRepository: TransactionRepository) { }

  async updateTransactionWriteDB(content: any) {
    const status = content.isValid ? TransactionStatus.APPROVED : TransactionStatus.REJECTED;
    await this.transactionRepository.updateStatus(content.id, status);
  }
}