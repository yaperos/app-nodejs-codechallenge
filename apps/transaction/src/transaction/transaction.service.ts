import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  create(dto: CreateTransactionDto) {
    const instance = new Transaction();
    instance.accountExternalIdCredit = dto.accountExternalIdCredit;
    instance.accountExternalIdDebit = dto.accountExternalIdDebit;
    instance.value = dto.value;
    return this.transactionRepository.save(instance);
  }
}
