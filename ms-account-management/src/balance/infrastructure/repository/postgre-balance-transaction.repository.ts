import { BalanceTransaction } from 'src/balance/domain/entity/balance-transaction';
import { BalanceTransactionRepository } from 'src/balance/domain/repository/balance-transaction.repository';
import { PostgreBalanceTransaction } from '../entity/postgre-balance-transaction';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostgreBalanceTransactionRepository
  implements BalanceTransactionRepository
{
  public constructor(
    @InjectRepository(PostgreBalanceTransaction)
    private readonly balanceTransactionRepository: Repository<PostgreBalanceTransaction>,
  ) {}

  public async createBalanceTransaction(
    balanceTransaction: Partial<BalanceTransaction>,
  ): Promise<void> {
    await this.balanceTransactionRepository.save(balanceTransaction);
  }
}
