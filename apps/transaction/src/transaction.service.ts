import { Transaction } from '@app/database/entities/transaction';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  @Inject()
  private readonly configService: ConfigService;

  @InjectRepository(Transaction)
  private readonly transactionRepository: Repository<Transaction>;

  async createTransaction(data: CreateTransactionDto) {
    const transaction = new Transaction();
    transaction.accountExternalIdDebit = data.accountExternalIdDebit;
    transaction.accountExternalIdCredit = data.accountExternalIdCredit;
    transaction.value = data.value;
    return this.transactionRepository.save(transaction);
  }
}
