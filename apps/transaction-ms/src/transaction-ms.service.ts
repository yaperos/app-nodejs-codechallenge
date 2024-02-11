import { Injectable } from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionMsService {
  constructor(
    @InjectRepository(Transaction)
    private repository: Repository<Transaction>,
  ) {}

  async findOne(transactionExternalId: string): Promise<Transaction> {
    return await this.repository.findOne({
      where: { transactionExternalId },
      select: {
        accountExternalIdDebit: false,
        accountExternalIdCredit: false,
        transactionType: {
          id: false,
          name: true,
        },
        transactionStatus: {
          id: false,
          name: true,
        },
      },
      relations: {
        transactionType: true,
        transactionStatus: true,
      },
    });
  }

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return await this.repository.save(createTransactionDto);
  }
}
