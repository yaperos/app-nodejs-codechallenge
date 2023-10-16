import { AccountBalanceRepository } from 'src/balance/domain/repository/account-balance.repository';
import { CreateAccountBalanceImpl } from './create-account-balance-impl';
import { Test } from '@nestjs/testing';
import { CreateAccountBalanceRequestDto } from 'src/balance/domain/dto/create-account-balance-request.dto';
import { v4 as uuidv4 } from 'uuid';
import { GenericResponseDto } from 'src/accounts/domain/dto/generic-response.dto';
import { InternalServerErrorException } from '@nestjs/common';

describe('CreateAccountBalanceImpl', () => {
  let service: CreateAccountBalanceImpl;
  let repository: AccountBalanceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateAccountBalanceImpl,
        {
          provide: 'ACCOUNT_BALANCE_REPOSITORY',
          useValue: {
            createAccountBalance: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreateAccountBalanceImpl>(CreateAccountBalanceImpl);
    repository = module.get<AccountBalanceRepository>(
      'ACCOUNT_BALANCE_REPOSITORY',
    );
  });

  describe('execute', () => {
    it('should create an account balance', async () => {
      const userId = uuidv4();

      const dto: CreateAccountBalanceRequestDto = {
        userId,
      };

      const response = GenericResponseDto.builder()
        .message('Account balance created successfully')
        .build();

      (repository.createAccountBalance as jest.Mock).mockResolvedValueOnce(
        response,
      );

      const result: GenericResponseDto = await service.execute(dto);

      expect(result.message).toBe(response.message);
    });

    it('should throw an error if account balance creation fails', async () => {
      const userId = uuidv4();

      const dto: CreateAccountBalanceRequestDto = {
        userId,
      };

      (repository.createAccountBalance as jest.Mock).mockRejectedValueOnce(
        new InternalServerErrorException(),
      );

      await expect(service.execute(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
