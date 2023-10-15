import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AccountBalanceRepository } from 'src/balance/domain/repository/account-balance.repository';
import { UpdateAccountBalance } from 'src/balance/domain/use-case/update-account-balance';

@Injectable()
export class UpdateAccountBalanceImpl implements UpdateAccountBalance {
  public constructor(
    @Inject('ACCOUNT_BALANCE_REPOSITORY')
    private readonly accountBalanceRepository: AccountBalanceRepository,
  ) {}

  public async execute(
    accountBalanceId: string,
    newAmount: number,
  ): Promise<void> {
    try {
      await this.accountBalanceRepository.updateAccountBalance(
        accountBalanceId,
        newAmount,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
