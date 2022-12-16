import { Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { TransactionEntity } from '../../../domain/models/transaction.entity';
import { Transaction } from '../../../domain/models/transaction.interface';
import { TransactionStatus } from 'src/domain/models/transaction_status.enum';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  create(transaction: Transaction): Observable<Transaction> {
    return from(this.transactionRepository.save(transaction));
  }

  // Use optimistic concurrency. Advantage: no need of a database transaction.
  async update(
    transactionId: string,
    currentResourceVersion: number,
    newStatus: TransactionStatus,
  ): Promise<UpdateResult> {
    return this.transactionRepository
      .createQueryBuilder()
      .update(TransactionEntity)
      .set({
        status: newStatus,
        version: currentResourceVersion + 1,
      })
      .where({
        transactionExternalId: transactionId,
        version: currentResourceVersion,
      })
      .execute();
  }
}
