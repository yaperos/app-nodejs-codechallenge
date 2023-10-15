import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AccountBalanceDto } from 'src/balance/domain/dto/account-balance.dto';
import { AccountBalanceRepository } from 'src/balance/domain/repository/account-balance.repository';
import { FindAccountBalance } from 'src/balance/domain/use-case/find-account-balance';
import { AccountBalanceMapper } from '../mapper/account-balane.mapper';

@Injectable()
export class FindAccountBalanceImpl implements FindAccountBalance {
  public constructor(
    @Inject('ACCOUNT_BALANCE_REPOSITORY')
    private readonly accountBalanceRepository: AccountBalanceRepository,
  ) {}

  public async execute(userId: string): Promise<AccountBalanceDto> {
    const accountBalance =
      await this.accountBalanceRepository.findAccountBalance(userId);

    if (!accountBalance)
      throw new NotFoundException('Account balance not found');

    return AccountBalanceMapper.toDto(accountBalance);
  }
}
