import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionServiceInterface } from '../../domain/interfaces/transaction.service.interface';
import { Transaction } from 'src/transaction/domain/entities/transaction.type';

describe('TransactionController', () => {
  let controller: TransactionController;
  let mockTransactionService: Partial<TransactionServiceInterface>;

  beforeEach(async () => {
    mockTransactionService = {
      check: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: 'TransactionService',
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.check and return true', async () => {
    // Arrange
    const transactionData: Transaction = {
      accountExternalIdDebit: 'ASD',
      accountExternalIdCredit: 'ASD',
      tranferTypeId: 1,
      value: 500,
    };
    jest
      .spyOn(mockTransactionService, 'check')
      .mockReturnValueOnce(Promise.resolve(true));

    // Act
    const result = await controller.created(transactionData);

    // Assert
    expect(mockTransactionService.check).toHaveBeenCalledWith(transactionData);
    expect(result).toBe(true);
  });
});
