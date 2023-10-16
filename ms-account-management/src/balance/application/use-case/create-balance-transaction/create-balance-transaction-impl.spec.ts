import { BalanceTransactionRepository } from 'src/balance/domain/repository/balance-transaction.repository';
import { CreateBalanceTransactionImpl } from './create-balance-transaction-impl';
import { Test } from '@nestjs/testing';
import { BalanceTransactionContext } from './balance-transaction.context';
import { CreateBalanceTransactionRequestDto } from 'src/balance/infrastructure/dto/create-balance-transaction-request.dto';
import { v4 as uuidv4 } from 'uuid';
import { TransactionType } from 'src/balance/domain/entity/balance-transaction';
import { FindAccountBalance } from 'src/balance/domain/use-case/find-account-balance';
import { UpdateAccountBalance } from 'src/balance/domain/use-case/update-account-balance';
import { AccountBalance } from 'src/balance/domain/entity/account-balance';
import { GenericResponseDto } from 'src/accounts/domain/dto/generic-response.dto';
import { InternalServerErrorException } from '@nestjs/common';

describe('CreateBalanceTransactionImpl', () => {
  let service: CreateBalanceTransactionImpl;
  let repository: BalanceTransactionRepository;
  let findAccountBalance: FindAccountBalance;
  let updateAccountBalance: UpdateAccountBalance;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateBalanceTransactionImpl,
        BalanceTransactionContext,
        {
          provide: 'BALANCE_TRANSACTION_REPOSITORY',
          useValue: {
            createBalanceTransaction: jest.fn(),
          },
        },
        {
          provide: 'FIND_ACCOUNT_BALANCE',
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: 'UPDATE_ACCOUNT_BALANCE',
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreateBalanceTransactionImpl>(
      CreateBalanceTransactionImpl,
    );
    repository = module.get<BalanceTransactionRepository>(
      'BALANCE_TRANSACTION_REPOSITORY',
    );
    findAccountBalance = module.get<FindAccountBalance>('FIND_ACCOUNT_BALANCE');
    updateAccountBalance = module.get<UpdateAccountBalance>(
      'UPDATE_ACCOUNT_BALANCE',
    );
  });

  describe('execute', () => {
    it('should create an balance transaction', async () => {
      const accountBalanceFound: AccountBalance = {
        accountBalanceId: uuidv4(),
        userId: uuidv4(),
        amount: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (findAccountBalance.execute as jest.Mock).mockResolvedValueOnce(
        accountBalanceFound,
      );

      const accountBalanceUpdated: AccountBalance = {
        accountBalanceId: uuidv4(),
        userId: uuidv4(),
        amount: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (updateAccountBalance.execute as jest.Mock).mockResolvedValueOnce(
        accountBalanceUpdated,
      );

      const dto: CreateBalanceTransactionRequestDto = {
        accountBalanceId: uuidv4(),
        userId: uuidv4(),
        transactionType: TransactionType.CREDIT,
        description: 'Yape transaction',
        amount: 100,
      };

      const response = GenericResponseDto.builder()
        .message('Balance transaction created successfully')
        .build();

      (repository.createBalanceTransaction as jest.Mock).mockResolvedValueOnce(
        response,
      );

      const result: GenericResponseDto = await service.execute(dto);

      expect(result.message).toBe(response.message);
    });

    it('should throw an error if balance transaction creation fails', async () => {
      const accountBalanceFound: AccountBalance = {
        accountBalanceId: uuidv4(),
        userId: uuidv4(),
        amount: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (findAccountBalance.execute as jest.Mock).mockResolvedValueOnce(
        accountBalanceFound,
      );

      const accountBalanceUpdated: AccountBalance = {
        accountBalanceId: uuidv4(),
        userId: uuidv4(),
        amount: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (updateAccountBalance.execute as jest.Mock).mockResolvedValueOnce(
        accountBalanceUpdated,
      );

      const dto: CreateBalanceTransactionRequestDto = {
        accountBalanceId: uuidv4(),
        userId: uuidv4(),
        transactionType: TransactionType.CREDIT,
        description: 'Yape transaction',
        amount: 100,
      };

      (repository.createBalanceTransaction as jest.Mock).mockRejectedValueOnce(
        new InternalServerErrorException(),
      );

      await expect(service.execute(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
