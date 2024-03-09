import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TransactionStatus } from './transaction-status.entity';

@Injectable()
export class TransactionStatusService {
  constructor(
    @Inject('TRANSACTION_STATUS_REPOSITORY')
    private transactionStatusRepository: Repository<TransactionStatus>,
  ) {}

  async findByName(name: string): Promise<TransactionStatus> {
    return await this.transactionStatusRepository.findOne({ where: { name } });
  }
}