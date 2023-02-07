import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { serialize, deserialize } from 'class-transformer';
import {
  TransactionEntity,
  TransactionType,
} from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  @InjectRepository(TransactionEntity)
  private readonly repository: Repository<TransactionEntity>;

  create(data: CreateTransactionDto) {
    const transaction: TransactionEntity = new TransactionEntity();
    transaction.accountExternalIdCredit = data.accountExternalIdCredit;
    transaction.accountExternalIdDebit = data.accountExternalIdDebit;
    transaction.value = data.value;
    transaction.transactionType =
      Object.values(TransactionType)[data.transactionTypeId];
    this.repository.save(transaction);
  }

  async findOne(transactionExternalId: string) {
    return this.repository
      .findOneByOrFail({
        transactionExternalId,
      })
      .then((transaction) => JSON.stringify(transaction.toJSON()));
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }
}
