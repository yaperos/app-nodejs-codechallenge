import { AccountBalanceRepository } from 'src/balance/domain/repository/account-balance.repository';
import { UpdateAccountBalanceImpl } from './update-account-balance-impl';
import { Test } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';
import { InternalServerErrorException } from '@nestjs/common';

describe('UpdateAccountBalanceImpl', () => {
  let service: UpdateAccountBalanceImpl;
  let repository: AccountBalanceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateAccountBalanceImpl,
        {
          provide: 'ACCOUNT_BALANCE_REPOSITORY',
          useValue: {
            updateAccountBalance: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UpdateAccountBalanceImpl>(UpdateAccountBalanceImpl);
    repository = module.get<AccountBalanceRepository>(
      'ACCOUNT_BALANCE_REPOSITORY',
    );
  });

  describe('execute', () => {
    it('should update an account balance', async () => {
      const accountBalanceId = uuidv4();
      const newAmount = 100;

      await expect(
        service.execute(accountBalanceId, newAmount),
      ).resolves.not.toThrow();

      expect(repository.updateAccountBalance).toHaveBeenCalledWith(
        accountBalanceId,
        newAmount,
      );
    });

    it('should throw an error if account balance update fails', async () => {
      const accountBalanceId = uuidv4();
      const newAmount = 100;

      (repository.updateAccountBalance as jest.Mock).mockRejectedValueOnce(
        new InternalServerErrorException(),
      );

      await expect(
        service.execute(accountBalanceId, newAmount),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
