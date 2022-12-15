import { Injectable } from '@nestjs/common';
import { TransactionEntity } from '../../../domain/models/transaction.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Transaction } from '../../../domain/models/transaction.interface';
import { TransactionStatus } from 'src/domain/models/transaction_status.enum';
import { AntifraudAnalysisResponsePayload } from 'src/adapter/input/messaging/antifraud_analysis_response.payload';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async create(transaction: Transaction): Promise<Transaction> {
    return this.transactionRepository.save(transaction);
  }

  // Use optimistic concurrency. Advantage: no need of a database transaction.
  async update(
    analysisResponse: AntifraudAnalysisResponsePayload,
  ): Promise<UpdateResult> {
    return this.transactionRepository
      .createQueryBuilder()
      .update(TransactionEntity)
      .set({
        status: analysisResponse.newStatus,
        version: analysisResponse.version + 1,
      })
      .where({
        id: analysisResponse.transactionId,
        version: analysisResponse.version,
      })
      .execute();
  }
}
