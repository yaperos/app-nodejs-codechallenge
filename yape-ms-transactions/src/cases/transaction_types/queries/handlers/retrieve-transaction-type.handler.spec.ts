import { Test } from '@nestjs/testing';

/* Project */
import { RetrieveTransactionTypeHandler } from './retrieve-transaction-type.handler';
import { RetrieveTransactionTypeQuery } from '../impl/retrieve-transaction-type.query';
import {
  ITransactionTypeRepository,
  TRANSACTION_TYPE_REPOSITORY,
} from '../../repositories';
import { TransactionType } from '../../models';

describe('RetrieveTransactionTypeHandler', () => {
  let retrieveTransactionTypeHandler: RetrieveTransactionTypeHandler;
  let transactionTypeRepo: jest.Mocked<ITransactionTypeRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RetrieveTransactionTypeHandler,
        {
          provide: TRANSACTION_TYPE_REPOSITORY,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    retrieveTransactionTypeHandler = moduleRef.get(
      RetrieveTransactionTypeHandler,
    );
    transactionTypeRepo = moduleRef.get(TRANSACTION_TYPE_REPOSITORY);
  });

  it('should be defined', () => {
    expect(retrieveTransactionTypeHandler).toBeDefined();
    expect(transactionTypeRepo).toBeDefined();
  });

  it('should retrieve a transaction type by id', async () => {
    const sample: TransactionType = { id: 2, name: 'WITHDRAWAL' };
    transactionTypeRepo.findById.mockResolvedValueOnce(sample);

    const result = await retrieveTransactionTypeHandler.execute(
      new RetrieveTransactionTypeQuery(2),
    );

    expect(transactionTypeRepo.findById).toHaveBeenCalledTimes(1);
    expect(transactionTypeRepo.findById).toHaveBeenCalledWith(2);
    expect(result).toEqual(sample);
  });

  it('should return null when transaction type is not found', async () => {
    transactionTypeRepo.findById.mockResolvedValueOnce(null);

    const result = await retrieveTransactionTypeHandler.execute(
      new RetrieveTransactionTypeQuery(99),
    );

    expect(transactionTypeRepo.findById).toHaveBeenCalledWith(99);
    expect(result).toBeNull();
  });

  it('should propagate repository errors', async () => {
    const error = new Error('DB failure');
    transactionTypeRepo.findById.mockRejectedValueOnce(error);

    await expect(
      retrieveTransactionTypeHandler.execute(
        new RetrieveTransactionTypeQuery(1),
      ),
    ).rejects.toThrow(error.message);
  });
});
