import { Inject, Injectable } from '@nestjs/common';
import { TransactionStatus } from '../../domain/enums/transaction-status.enum';
import { TransactionMongooseRepository, TransactionRepository, TransactionTypeOrmRepository } from '../../domain/repositories/transaction.repository';

@Injectable()
export class TransactionEventHandler {
  constructor(
    @Inject(TransactionMongooseRepository) private readonly transactionMongooseRepo: TransactionRepository,
    @Inject(TransactionTypeOrmRepository) private readonly transactionTypeOrmRepo: TransactionRepository) { }

  async updateTransactionWriteDB(content: any) {
    const status = this.setStatus(content.isValid);
    await this.transactionTypeOrmRepo.updateStatus(content.id, status);
  }

  async updateTransactionReadDB(content: any) {
    const status = this.setStatus(content.isValid);
    await this.transactionMongooseRepo.updateStatus(content.id, status);
  }

  async createTransactionReadDB(content: any) {
    return await this.transactionMongooseRepo.save(content);
  }

  private setStatus(isValid: Boolean): TransactionStatus {
    return isValid ? TransactionStatus.APPROVED : TransactionStatus.REJECTED;
  }
}