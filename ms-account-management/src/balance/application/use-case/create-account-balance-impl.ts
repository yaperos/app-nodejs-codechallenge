import { Inject, Injectable } from '@nestjs/common';
import { CreateAccountBalanceRequestDto } from 'src/balance/domain/dto/create-account-balance-request.dto';
import { GenericResponseDto } from 'src/balance/domain/dto/generic-response.dto';
import { AccountBalanceRepository } from 'src/balance/domain/repository/account-balance.repository';
import { CreateAccountBalance } from 'src/balance/domain/use-case/create-account-balance';

@Injectable()
export class CreateAccountBalanceImpl implements CreateAccountBalance {
  public constructor(
    @Inject('ACCOUNT_BALANCE_REPOSITORY')
    private readonly accountBalanceRepository: AccountBalanceRepository,
  ) {}

  public async execute(
    dto: CreateAccountBalanceRequestDto,
  ): Promise<GenericResponseDto> {
    await this.accountBalanceRepository.createAccountBalance(dto.userId);

    return GenericResponseDto.builder()
      .message('Account balance created successfully')
      .build();
  }
}
