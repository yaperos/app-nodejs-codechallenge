import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { Transactions } from '../model/entity/transactions.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from } from 'rxjs';

@Injectable()
export class TransactionRepository {
  constructor(@InjectRepository(Transactions) private readonly transactionRepository: Repository<Transactions>) {}

  save(data: Transactions[]): Observable<Transactions[]> {
    try {
      return from(this.transactionRepository.save(data));
    } catch (e) {
      throw new Error(e);
    }
  }

  find(): Observable<Transactions[]> {
    try {
      return from(this.transactionRepository.find());
    } catch (e) {
      throw new Error(e);
    }
  }

  findById(id: String): Observable<Transactions> {
    try {
      return from(this.transactionRepository.findOne({ where: { transactionId: `${id}` } }));
    } catch (e) {
      throw new Error(e);
    }
  }

  updateById(data: Transactions):Observable<UpdateResult> {
    try {
      const id = data.transactionId;
      return from(this.transactionRepository.update(id, data));
    } catch (e) {
      throw new Error(e);
    }
  }
}
