import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { TransactionEntity } from '../../../domain/models/transaction.entity';
@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  findById(transactionId: string): Observable<TransactionEntity> {
    console.log('TransactionService:: findById: ' + transactionId);
    return from(
      this.transactionRepository.findOne({
        where: { transactionExternalId: transactionId },
      }),
    );
  }
}
