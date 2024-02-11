import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionStatus } from '../entities/transaction-status.entity';

@Injectable()
export class TransactionStatusService {
  constructor(
    @InjectRepository(TransactionStatus)
    private repository: Repository<TransactionStatus>,
  ) {}

  async findOne(name: string): Promise<TransactionStatus> {
    return await this.repository.findOne({
      where: { name },
    });
  }
}
