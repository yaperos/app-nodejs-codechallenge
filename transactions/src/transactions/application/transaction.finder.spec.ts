import { Test } from '@nestjs/testing';
import { TransactionFinder } from '@transactions/application/transaction.finder';
import { transactionMock } from '@transactions/domain/transaction.mock';
import { TransactionRepository } from '@transactions/infrastructure/transaction.repository';

describe('TransactionFinder', () => {
  let transactionFinder: TransactionFinder;
  let transactionRepository: TransactionRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TransactionFinder,
        {
          provide: TransactionRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionFinder = module.get(TransactionFinder);
    transactionRepository = module.get(TransactionRepository);
  });

  it('should be defined', () => {
    expect(transactionFinder).toBeDefined();
  });

  describe('when transaction not exists', () => {
    it('should thrown an Transaction not found error', async () => {
      jest.spyOn(transactionRepository, 'findById').mockResolvedValue(null);

      const transaction = transactionFinder.run(transactionMock.id);

      await expect(transaction).rejects.toThrowError('Transaction not found');
      expect(transactionRepository.findById).toHaveBeenCalledWith(
        transactionMock.id,
      );
    });
  });

  describe('when transaction exists', () => {
    it('should return the transaction', async () => {
      jest
        .spyOn(transactionRepository, 'findById')
        .mockResolvedValue(transactionMock);

      const transaction = await transactionFinder.run(transactionMock.id);

      expect(transactionRepository.findById).toHaveBeenCalledWith(
        transactionMock.id,
      );
      expect(transaction).toEqual(transactionMock);
    });
  });
});
