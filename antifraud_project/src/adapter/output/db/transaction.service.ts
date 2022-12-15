import { Injectable } from '@nestjs/common';
import { TransactionEntity } from '../../../domain/models/transaction.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async findById(transactionId: number): Promise<TransactionEntity> {
    console.log('TransactionService:: findById: ' + transactionId);
    return this.transactionRepository.findOne({
      where: { id: transactionId },
    });
  }
}
