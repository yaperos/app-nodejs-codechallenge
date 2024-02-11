import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../common/entities/transaction.entity';
import { TransactionDto } from '../../common/dto/transaction.dto';
import { CreateTransactionInput } from '../../common/dto/transaction.input';
import { TransactionStatuses } from '../../common/enums/transaction-statuses.enum';
import { NewTransactionPayload } from 'src/common/types/transaction.interface';

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
      { transferStatusId: TransactionStatuses[transactionStatus] },
    );
  }

  async storeTransaction(transactionData: CreateTransactionInput): Promise<TransactionDto> {
    const payload: NewTransactionPayload = {
      accountExternalIdDebit: transactionData.accountExternalIdDebit,
      accountExternalIdCredit: transactionData.accountExternalIdCredit,
      transferTypeId: transactionData.transferTypeId,
      value: transactionData.value,
      transferStatusId: TransactionStatuses.pending,
    };

    const result = await this.transactionRepository.insert(payload);
    
    const transaction = await this.transactionRepository.findOne({
      where: { transactionExternalId: result.identifiers[0].transactionExternalId },
      relations: ['transactionType', 'transactionStatus'],
    });
    
    return transaction;
  }
}