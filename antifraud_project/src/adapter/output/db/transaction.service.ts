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
    const result = this.transactionRepository.findOne({
      where: { id: transactionId },
    });
    console.log(
      'TransactionService: findById record: ' + JSON.stringify(result),
    );
    return result;
  }
  
}
