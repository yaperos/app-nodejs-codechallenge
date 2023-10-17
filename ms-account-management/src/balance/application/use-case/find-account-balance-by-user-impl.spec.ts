import { AccountBalanceRepository } from 'src/balance/domain/repository/account-balance.repository';
import { FindAccountBalanceByUserImpl } from './find-account-balance-by-user-impl';
import { Test } from '@nestjs/testing';
import { AccountBalanceDto } from 'src/balance/domain/dto/account-balance.dto';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundException } from '@nestjs/common';

describe('FindAccountBalanceByUserImpl', () => {
  let service: FindAccountBalanceByUserImpl;
  let repository: AccountBalanceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindAccountBalanceByUserImpl,
        {
          provide: 'ACCOUNT_BALANCE_REPOSITORY',
          useValue: {
            findAccountBalanceByUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FindAccountBalanceByUserImpl>(
      FindAccountBalanceByUserImpl,
    );
    repository = module.get<AccountBalanceRepository>(
      'ACCOUNT_BALANCE_REPOSITORY',
    );
  });

  describe('execute', () => {
    it('should find an account balance', async () => {
      const userId = uuidv4();

      const accountBalance = AccountBalanceDto.builder()
        .accountBalanceId(uuidv4())
        .amount(100)
        .build();

      (repository.findAccountBalanceByUser as jest.Mock).mockResolvedValueOnce(
        accountBalance,
      );

      const result: AccountBalanceDto = await service.execute(userId);

      expect(result.accountBalanceId).toBe(accountBalance.accountBalanceId);
      expect(result.amount).toBe(accountBalance.amount);
    });

    it('should throw an error if account balance does not exist', async () => {
      const userId = uuidv4();

      (repository.findAccountBalanceByUser as jest.Mock).mockResolvedValueOnce(
        null,
      );

      await expect(service.execute(userId)).rejects.toThrow(NotFoundException);
    });
  });
});
