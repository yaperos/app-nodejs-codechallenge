import { Test, TestingModule } from '@nestjs/testing';
import { TransactionServiceImpl } from './transaction.service';
import { Transaction } from 'src/transaction/domain/entities/transaction.type';
import { TransactionRepositoryInterface } from 'src/transaction/domain/interfaces/transaction.repository.interface';

describe('TransactionServiceImpl', () => {
  let service: TransactionServiceImpl;
  let mockTransactionRepository: Partial<TransactionRepositoryInterface>;

  beforeEach(async () => {
    mockTransactionRepository = {
      sendRejected: jest.fn(),
      sendApproved: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionServiceImpl,
        {
          provide: 'TransactionRepository',
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionServiceImpl>(TransactionServiceImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send rejected message for invalid transaction', async () => {
    // Arrange
    const invalidTransaction: Transaction = {
      id: 1,
      value: 1001,
      accountExternalIdDebit: 'asd',
      accountExternalIdCredit: 'asd',
      tranferTypeId: 1,
    };
    jest
      .spyOn(mockTransactionRepository, 'sendRejected')
      .mockReturnValueOnce(Promise.resolve(true));

    // Act
    const result = await service.check(invalidTransaction);

    // Assert
    expect(mockTransactionRepository.sendRejected).toHaveBeenCalledWith(
      invalidTransaction.id,
      expect.any(String),
    );
    expect(result).toBe(true);
  });

  it('should send approved message for valid transaction', async () => {
    // Arrange
    const invalidTransaction: Transaction = {
      id: 1,
      value: 500, // Valid value
      accountExternalIdDebit: 'asd',
      accountExternalIdCredit: 'asd',
      tranferTypeId: 1,
    };
    jest
      .spyOn(mockTransactionRepository, 'sendApproved')
      .mockReturnValueOnce(Promise.resolve(true));

    // Act
    const result = await service.check(invalidTransaction);

    // Assert
    expect(mockTransactionRepository.sendApproved).toHaveBeenCalledWith(
      invalidTransaction.id,
      expect.any(String),
    );
    expect(result).toBe(true);
  });
});
