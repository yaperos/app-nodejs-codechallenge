import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AccountDto } from 'src/accounts/domain/dto/account.dto';
import { AccountRepository } from 'src/accounts/domain/repository/account-repository';
import { FindAccount } from 'src/accounts/domain/use-case/find-account';
import { AccountMapper } from '../mapper/account.mapper';

@Injectable()
export class FindAccountImpl implements FindAccount {
  public constructor(
    @Inject('ACCOUNT_REPOSITORY')
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute(userId: string): Promise<AccountDto> {
    try {
      const account = await this.accountRepository.findAccount(userId);
      if (!account) throw new NotFoundException('Account not found');

      return AccountMapper.toDto(account);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
