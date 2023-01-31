import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionDto } from 'src/domain/transaction.dto';
import { Repository } from 'typeorm';
import { Transaction } from '../domain/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async add(transactionDto: TransactionDto): Promise<void> {
    const transaction = new Transaction();
    transaction.accountExternalIdDebit = transactionDto.accountExternalIdDebit;
    transaction.accountExternalIdCredit =
      transactionDto.accountExternalIdCredit;
    transaction.tranferTypeId = transactionDto.tranferTypeId;
    transaction.value = transactionDto.value;

    await this.transactionRepository.save(transaction);
  }
}
