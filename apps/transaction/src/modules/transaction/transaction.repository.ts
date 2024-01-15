import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../../database/entities/transaction.entity';
import { TransactionRegisterDto } from '@app/common';
import {
  TransactionSearchRequestDto,
  TransactionSearchResponseDto,
} from './dto/transaction.dto';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async saveTransaction(
    transactionRegisterDto: TransactionRegisterDto,
  ): Promise<Transaction> {
    const createTransaction = this.transactionRepository.create(
      transactionRegisterDto,
    );
    return await this.transactionRepository.save(createTransaction);
  }

  async updateTransaction(transaction: Transaction): Promise<Transaction> {
    return await this.transactionRepository.save(transaction);
  }

  async findTransactionById(id: string): Promise<Transaction> {
    return await this.transactionRepository.findOneBy({
      id: id,
    });
  }

  async searchTransactions(
    transactionSearchRequestDto: TransactionSearchRequestDto,
  ): Promise<TransactionSearchResponseDto[]> {
    const queryBuilder: SelectQueryBuilder<Transaction> =
      this.transactionRepository.createQueryBuilder('transaction');

    if (transactionSearchRequestDto.transactionExternalId) {
      queryBuilder.andWhere(
        'transaction.transactionExternalId = :transactionExternalId',
        {
          transactionExternalId:
            transactionSearchRequestDto.transactionExternalId,
        },
      );
    }

    if (transactionSearchRequestDto.transactionType?.name) {
      queryBuilder.andWhere('transactionType.name = :typeName', {
        typeName: transactionSearchRequestDto.transactionType.name,
      });
    }

    if (transactionSearchRequestDto.transactionStatus?.name) {
      queryBuilder.andWhere('transactionStatus.name = :statusName', {
        statusName: transactionSearchRequestDto.transactionStatus.name,
      });
    }

    if (transactionSearchRequestDto.value > 0) {
      queryBuilder.andWhere('transaction.value = :value', {
        value: transactionSearchRequestDto.value,
      });
    }

    if (
      transactionSearchRequestDto.createdAt &&
      transactionSearchRequestDto.createdAt instanceof Date
    ) {
      queryBuilder.andWhere(`transaction.createdAt >= :createdAt`, {
        createdAt: transactionSearchRequestDto.createdAt,
      });
    }

    queryBuilder
      .innerJoinAndSelect('transaction.transactionStatus', 'transactionStatus')
      .innerJoinAndSelect('transaction.transactionType', 'transactionType');

    const transactions: TransactionSearchResponseDto[] = await queryBuilder
      .getMany()
      .then((results) =>
        results.map((transaction) => ({
          transactionExternalId: transaction.transactionExternalId,
          transactionType: transaction.transactionType.name,
          transactionStatus: transaction.transactionStatus.name,
          value: transaction.value,
          createdAt: transaction.createdAt,
        })),
      );

    return transactions;
  }
}
