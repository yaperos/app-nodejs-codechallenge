import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Transaction } from '../table/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionRepository.save(createTransactionDto);
  }

  async update(
    transactionExternalId: string,
    updateTransactionDto: CreateTransactionDto,
  ) {
    updateTransactionDto.transactionExternalId = transactionExternalId;
    await this.transactionRepository.update(
      transactionExternalId,
      updateTransactionDto,
    );
  }
  findOne(transactionExternalId: string): Promise<Transaction> {
    return this.transactionRepository.findOneBy({
      transactionExternalId: transactionExternalId,
    });
  }
}
