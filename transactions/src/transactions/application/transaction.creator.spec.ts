import { Test } from '@nestjs/testing';
import { TransactionCreator } from '@transactions/application/transaction.creator';
import {
  Transaction,
  TransactionStatus,
} from '@transactions/domain/transaction.entity';
import { transactionRequestMock } from '@transactions/infrastructure/dtos/transaction-request.mock';
import { TransactionRepository } from '@transactions/infrastructure/transaction.repository';

describe(TransactionCreator, () => {
  let transactionCreator: TransactionCreator;
  let transactionRepository: TransactionRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TransactionCreator,
        {
          provide: TransactionRepository,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionCreator = module.get(TransactionCreator);
    transactionRepository = module.get(TransactionRepository);
  });

  it('should be defined', () => {
    expect(transactionCreator).toBeDefined();
  });

  describe('should create a transaction as pending', () => {
    it('should create a transaction as pending', async () => {
      const expectedTransaction: Transaction = {
        ...transactionRequestMock,
        id: expect.any(String),
        externalId: expect.any(String),
        status: TransactionStatus.Pending,
        createdAt: expect.any(Date),
      };
      jest.spyOn(transactionRepository, 'save').mockResolvedValue();

      const createdTransaction = await transactionCreator.run(
        transactionRequestMock,
      );

      expect(transactionRepository.save).toHaveBeenCalledWith(
        expectedTransaction,
      );
      expect(createdTransaction).toEqual(expectedTransaction);
    });
  });
});
