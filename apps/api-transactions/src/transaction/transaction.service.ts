import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Repository } from 'typeorm';
import { TransactionType } from './entities/transactionType.entity';
import { TransactionStatus } from './entities/transactionStatus.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionType)
    private transactionTypeRepository: Repository<TransactionType>,
    @InjectRepository(TransactionStatus)
    private transactionStatusRepository: Repository<TransactionStatus>,
  ) {}

  findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  findTransactionByUid(transactionExternalId: string): Promise<Transaction> {
    return this.transactionRepository.findOne({
      where: {
        transactionExternalId,
      },
    });
  }

  createTransactions(transaction: CreateTransactionDto): Promise<Transaction> {
    const newTransaction = this.transactionRepository.create(transaction);
    return this.transactionRepository.save(newTransaction);
  }

  // NOTE: types
  getTransactionTypes(): Promise<TransactionType[]> {
    return this.transactionTypeRepository.find();
  }

  getTransactionTypeById(id: number): Promise<TransactionType> {
    return this.transactionTypeRepository.findOne({ where: { id } });
  }

  // NOTE: status
  getTransactionStatuses(): Promise<TransactionStatus[]> {
    return this.transactionStatusRepository.find();
  }

  getTransactionStatusById(id: number): Promise<TransactionStatus> {
    return this.transactionStatusRepository.findOne({ where: { id } });
  }
}
