import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../../core/repository/transaction.repository';
import { TransactionEntity } from '../../core/entity/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult, Repository } from 'typeorm';

@Injectable()
export class TransactionService implements TransactionRepository {

  constructor(@InjectRepository(TransactionEntity) private readonly transactionRepository: Repository<TransactionEntity>) { }

  insert(transactionEntity: TransactionEntity): Promise<TransactionEntity> {
    return this.transactionRepository.save(transactionEntity);
  }

  update(transaction: any): Promise<UpdateResult> {
    return this.transactionRepository.update({ transactionId: transaction.transactionId }, {
      transactionStateId: transaction.stateId,
      updatedAt: new Date()
    });
  }

  get(transactionId: string): Promise<TransactionEntity> {
    return this.transactionRepository.findOneBy({ transactionId, isDeleted: false });
  }

}