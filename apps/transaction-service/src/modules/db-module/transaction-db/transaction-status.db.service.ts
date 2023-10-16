import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionStatus } from '../../../database/entities/transaction-status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionStatusDBService {
  constructor(
    @InjectRepository(TransactionStatus)
    private readonly transactionStatusRepository: Repository<TransactionStatus>,
  ) {}

  async findTransactionStatusById(id: number): Promise<TransactionStatus> {
    const result = await this.transactionStatusRepository.findOne({
      where: {
        id,
      },
    });
    return result;
  }
}
