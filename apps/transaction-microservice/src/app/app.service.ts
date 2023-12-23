import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '@app-nodejs-codechallenge/shared/dto';
import { TransactionRepository } from './transaction.repository';
import { Transaction } from '@app-nodejs-codechallenge/shared/entities';


@Injectable()
export class AppService {

  constructor(private readonly trasactionRepository: TransactionRepository) {}

  createTransaction(data: CreateTransactionDto): Promise<Transaction> {
    return this.trasactionRepository.save(data);
  }

 updateTransaction(data: Transaction): Promise<Transaction> {
    return this.trasactionRepository.update(data);
  }

}
