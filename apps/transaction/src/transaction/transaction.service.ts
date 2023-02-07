import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  create(dto: CreateTransactionDto) {
    const transaction = new Transaction();
    transaction.accountExternalIdCredit = dto.accountExternalIdCredit;
    transaction.accountExternalIdDebit = dto.accountExternalIdDebit;
    transaction.value = dto.value;
    const instance = this.transactionRepository.save(transaction);
    this.logger.debug('transaction saved');
    return instance;
  }
}
