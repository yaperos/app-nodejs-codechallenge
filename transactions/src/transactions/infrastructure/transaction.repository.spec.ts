import { Repository } from 'typeorm';

import { Test } from '@nestjs/testing';
import { Transaction } from '@transactions/domain/transaction.entity';
import { transactionMock } from '@transactions/domain/transaction.mock';
import { TransactionRepository } from '@transactions/infrastructure/transaction.repository';

describe(TransactionRepository, () => {
  let repository: TransactionRepository;
  let transactionRepo: Repository<Transaction>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TransactionRepository,
        {
          provide: 'TransactionRepository',
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get(TransactionRepository);
    transactionRepo = module.get('TransactionRepository');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should save a transaction', async () => {
    jest.spyOn(transactionRepo, 'save').mockResolvedValue(null);

    await repository.save(transactionMock);

    expect(transactionRepo.save).toBeCalledWith(transactionMock);
  });

  it('should find a transaction by id', async () => {
    jest.spyOn(transactionRepo, 'findOne').mockResolvedValue(transactionMock);

    const transaction = await repository.findById(transactionMock.id);

    expect(transaction).toEqual(transactionMock);
  });
});
