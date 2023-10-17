import { InjectRepository } from '@nestjs/typeorm';
import { AccountBalance } from 'src/balance/domain/entity/account-balance';
import { AccountBalanceRepository } from 'src/balance/domain/repository/account-balance.repository';
import { PostgreAccountBalance } from '../entity/postgre-account-balance';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostgreAccountBalanceRepository
  implements AccountBalanceRepository
{
  public constructor(
    @InjectRepository(PostgreAccountBalance)
    private readonly accountBalanceRepository: Repository<PostgreAccountBalance>,
  ) {}

  public async createAccountBalance(userId: string): Promise<void> {
    await this.accountBalanceRepository.save({ userId });
  }

  public async findAccountBalance(
    accountBalanceId: string,
  ): Promise<AccountBalance | null> {
    return this.accountBalanceRepository.findOneBy({ accountBalanceId });
  }

  public async findAccountBalanceByUser(
    userId: string,
  ): Promise<AccountBalance | null> {
    return this.accountBalanceRepository.findOneBy({ userId });
  }

  public async updateAccountBalance(
    accountBalanceId: string,
    newAmount: number,
  ): Promise<void> {
    await this.accountBalanceRepository.update(
      { accountBalanceId },
      { amount: newAmount },
    );
  }
}
