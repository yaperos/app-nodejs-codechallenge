import { Test } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';

/* Project */
import { RetrieveTransactionHandler } from './retrieve-transaction.handler';
import { RetrieveTransactionQuery } from '../impl/retrieve-transaction.query';
import { RetrieveTransactionDto } from '../../dtos';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../repositories';
import { Transaction } from '../../models';
import { RetrieveTransactionTypeQuery } from '../../../transaction_types/queries';
import { TransactionType } from '../../../transaction_types/models';
import {
  TRANSACTION_NOT_FOUND,
  TRANSACTION_TYPE_NOT_FOUND,
} from '../../../../common/constants/errors';
import { validateDTOClass } from '../../../../common/helpers';

jest.mock('../../../../common/helpers', () => ({
  validateDTOClass: jest.fn(),
}));

const mockedValidate = validateDTOClass as jest.MockedFunction<
  typeof validateDTOClass
>;

const sampleDto: RetrieveTransactionDto = {
  transactionId: '550e8400-e29b-41d4-a716-446655440000',
};

const sampleTransaction: Transaction = {
  id: sampleDto.transactionId,
  accountExternalIdDebit: 'acc-debit',
  accountExternalIdCredit: 'acc-credit',
  transferTypeId: 2,
  value: '123.45',
  transactionStatusName: 'pending',
  createdAt: new Date('2023-01-01T10:00:00.000Z'),
  updatedAt: new Date('2023-01-01T10:05:00.000Z'),
  deletedAt: null,
};

const sampleType: TransactionType = { id: 2, name: 'WITHDRAWAL' };

describe('RetrieveTransactionHandler', () => {
  let retrieveTransactionHandler: RetrieveTransactionHandler;
  let transactionRepo: jest.Mocked<ITransactionRepository>;
  let queryBus: { execute: jest.Mock };

  beforeEach(async () => {
    transactionRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      updateStatusById: jest.fn(),
    };

    queryBus = { execute: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      providers: [
        RetrieveTransactionHandler,
        { provide: TRANSACTION_REPOSITORY, useValue: transactionRepo },
        { provide: QueryBus, useValue: queryBus },
      ],
    }).compile();

    retrieveTransactionHandler = moduleRef.get(RetrieveTransactionHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(retrieveTransactionHandler).toBeDefined();
    expect(transactionRepo).toBeDefined();
    expect(queryBus).toBeDefined();
  });

  it('should retrieve and map a transaction successfully', async () => {
    mockedValidate.mockResolvedValueOnce(sampleDto);
    transactionRepo.findById.mockResolvedValueOnce(sampleTransaction);
    queryBus.execute.mockResolvedValueOnce(sampleType);

    const result = await retrieveTransactionHandler.execute(
      new RetrieveTransactionQuery(sampleDto),
    );

    expect(mockedValidate).toHaveBeenCalledWith(
      RetrieveTransactionDto,
      sampleDto,
      'Invalid transaction query',
    );
    expect(transactionRepo.findById).toHaveBeenCalledWith(
      sampleDto.transactionId,
    );

    expect(queryBus.execute).toHaveBeenCalledTimes(1);

    const calledArg = queryBus.execute.mock.calls[0][0];
    expect(calledArg).toBeInstanceOf(RetrieveTransactionTypeQuery);
    expect(calledArg.id).toBe(sampleTransaction.transferTypeId);

    expect(result).toEqual({
      transactionId: sampleTransaction.id,
      transactionType: { name: sampleType.name },
      transactionStatus: { name: sampleTransaction.transactionStatusName },
      value: Number(sampleTransaction.value),
      createdAt: sampleTransaction.createdAt.toISOString(),
    });
  });

  it('should throw when dto validation returns an error', async () => {
    const error = new Error('Invalid transaction query');
    mockedValidate.mockResolvedValueOnce(error as any);

    await expect(
      retrieveTransactionHandler.execute(
        new RetrieveTransactionQuery(sampleDto),
      ),
    ).rejects.toThrow(error.message);

    expect(transactionRepo.findById).not.toHaveBeenCalled();
    expect(queryBus.execute).not.toHaveBeenCalled();
  });

  it('should throw TRANSACTION_NOT_FOUND if transaction is not found', async () => {
    mockedValidate.mockResolvedValueOnce(sampleDto);

    transactionRepo.findById.mockResolvedValueOnce(null);

    await expect(
      retrieveTransactionHandler.execute(
        new RetrieveTransactionQuery(sampleDto),
      ),
    ).rejects.toEqual(TRANSACTION_NOT_FOUND);

    expect(queryBus.execute).not.toHaveBeenCalled();
  });

  it('should throw TRANSACTION_TYPE_NOT_FOUND if transaction type is not found', async () => {
    mockedValidate.mockResolvedValueOnce(sampleDto);

    transactionRepo.findById.mockResolvedValueOnce(sampleTransaction);
    queryBus.execute.mockResolvedValueOnce(null);

    await expect(
      retrieveTransactionHandler.execute(
        new RetrieveTransactionQuery(sampleDto),
      ),
    ).rejects.toEqual(TRANSACTION_TYPE_NOT_FOUND);
  });

  it('should propagate repository errors', async () => {
    mockedValidate.mockResolvedValueOnce(sampleDto);

    const error = new Error('DB failure');
    transactionRepo.findById.mockRejectedValueOnce(error);

    await expect(
      retrieveTransactionHandler.execute(
        new RetrieveTransactionQuery(sampleDto),
      ),
    ).rejects.toThrow(error.message);
  });

  it('should propagate queryBus errors', async () => {
    mockedValidate.mockResolvedValueOnce(sampleDto);
    transactionRepo.findById.mockResolvedValueOnce(sampleTransaction);

    const error = new Error('Service down');
    queryBus.execute.mockRejectedValueOnce(error);

    await expect(
      retrieveTransactionHandler.execute(
        new RetrieveTransactionQuery(sampleDto),
      ),
    ).rejects.toThrow(error.message);
  });
});
