import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entity/transaction.entity';
import { Statuses } from './statuses.enum';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async updateTransaction(createTransactionDto: CreateTransactionDto) {
    const transactionUpdated = await this.transactionRepository.update(
      {
        transactionExternalId: createTransactionDto.transactionExternalId,
      },
      {
        status:
          createTransactionDto.value > 1000
            ? Statuses.REJECTED
            : Statuses.APPROVED,
      },
    );

    return transactionUpdated;
  }
}
