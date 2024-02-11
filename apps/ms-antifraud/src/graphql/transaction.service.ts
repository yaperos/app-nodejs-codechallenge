import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { TransactionDto } from './transaction.dto';
import { CreateTransactionInput } from './transaction.input';

enum Statuses {
  'pending' = 1,
  'rejected' = 2,
  'approved' = 3,
}

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async updateTransaction(transactionData: TransactionDto, transactionStatus: string): Promise<void> {
    await this.transactionRepository.update(
      { transactionExternalId: transactionData.transactionExternalId },
      { transferStatusId: Statuses[transactionStatus] },
    );
  }

  async storeTransaction(transactionData: CreateTransactionInput): Promise<TransactionDto> {
    const payload = {
      accountExternalIdDebit: transactionData.accountExternalIdDebit,
      accountExternalIdCredit: transactionData.accountExternalIdCredit,
      transferTypeId: transactionData.transferTypeId,
      value: transactionData.value,
      transferStatusId: Statuses.pending,
    };

    const result = await this.transactionRepository.insert(payload);
    
    const transaction = await this.transactionRepository.findOne({
      where: { transactionExternalId: result.identifiers[0].transactionExternalId },
      relations: ['transactionType', 'transactionStatus'],
    });
    
    return transaction;
  }
}