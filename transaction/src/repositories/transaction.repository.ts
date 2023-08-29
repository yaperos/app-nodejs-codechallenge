import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/entities/transaction';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(private dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }
}
