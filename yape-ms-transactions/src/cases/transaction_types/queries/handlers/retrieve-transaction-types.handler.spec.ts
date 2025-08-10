import { Test } from '@nestjs/testing';

/* Project */
import { RetrieveTransactionTypesHandler } from './retrieve-transaction-types.handler';
import {
  ITransactionTypeRepository,
  TRANSACTION_TYPE_REPOSITORY,
} from '../../repositories';
import { TransactionType } from '../../models';

describe('RetrieveTransactionTypesHandler', () => {
  let retrieveTransactionTypesHandler: RetrieveTransactionTypesHandler;
  let transactionTypeRepo: jest.Mocked<ITransactionTypeRepository>;

  beforeEach(async () => {
    const repoMock: jest.Mocked<ITransactionTypeRepository> = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        RetrieveTransactionTypesHandler,
        { provide: TRANSACTION_TYPE_REPOSITORY, useValue: repoMock },
      ],
    }).compile();

    retrieveTransactionTypesHandler = moduleRef.get(
      RetrieveTransactionTypesHandler,
    );
    transactionTypeRepo = moduleRef.get(TRANSACTION_TYPE_REPOSITORY);
  });

  it('should be defined', () => {
    expect(retrieveTransactionTypesHandler).toBeDefined();
    expect(transactionTypeRepo).toBeDefined();
  });

  it('should retrieve all transaction types', async () => {
    const items: TransactionType[] = [
      { id: 1, name: 'DEPOSIT' },
      { id: 2, name: 'WITHDRAWAL' },
    ];
    transactionTypeRepo.findAll.mockResolvedValueOnce(items);

    const result = await retrieveTransactionTypesHandler.execute();

    expect(transactionTypeRepo.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(items);
  });

  it('should return empty array if no transaction types are found', async () => {
    transactionTypeRepo.findAll.mockResolvedValueOnce([]);

    const result = await retrieveTransactionTypesHandler.execute();

    expect(transactionTypeRepo.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  it('should propagate repository errors', async () => {
    const error = new Error('DB failure');
    transactionTypeRepo.findAll.mockRejectedValueOnce(error);

    await expect(retrieveTransactionTypesHandler.execute()).rejects.toThrow(
      error.message,
    );
  });
});
