import { Test } from '@nestjs/testing';

/* Project */
import { UpdateTransactionStatusHandler } from './update-transaction-status.handler';
import { UpdateTransactionStatusCommand } from '../impl/update-transaction-status.command';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../repositories';
import { ValidatedTransactionRequestDto } from '../../dtos';
import { TRANSACTION_NOT_FOUND } from '../../../../common/constants/errors';
import { validateDTOClass } from '../../../../common/helpers';

jest.mock('../../../../common/helpers', () => ({
  validateDTOClass: jest.fn(),
}));

const mockedValidate = validateDTOClass as jest.MockedFunction<
  typeof validateDTOClass
>;

const sampleDto: ValidatedTransactionRequestDto = {
  transactionId: '550e8400-e29b-41d4-a716-446655440000',
  status: 'approved',
};

describe('UpdateTransactionStatusHandler', () => {
  let updateTransactionStatusHandler: UpdateTransactionStatusHandler;
  let transactionRepo: jest.Mocked<ITransactionRepository>;

  beforeEach(async () => {
    transactionRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      updateStatusById: jest.fn(),
    } as jest.Mocked<ITransactionRepository>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateTransactionStatusHandler,
        { provide: TRANSACTION_REPOSITORY, useValue: transactionRepo },
      ],
    }).compile();

    updateTransactionStatusHandler = moduleRef.get(
      UpdateTransactionStatusHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(updateTransactionStatusHandler).toBeDefined();
    expect(transactionRepo).toBeDefined();
  });

  it('should validate payload and update transaction status successfully', async () => {
    mockedValidate.mockResolvedValueOnce(sampleDto);
    transactionRepo.updateStatusById.mockResolvedValueOnce({} as any);

    const result = await updateTransactionStatusHandler.execute(
      new UpdateTransactionStatusCommand(sampleDto),
    );

    expect(mockedValidate).toHaveBeenCalledWith(
      ValidatedTransactionRequestDto,
      sampleDto,
      'Invalid update status payload',
    );

    expect(transactionRepo.updateStatusById).toHaveBeenCalledTimes(1);
    expect(transactionRepo.updateStatusById).toHaveBeenCalledWith(
      sampleDto.transactionId,
      sampleDto.status,
    );

    expect(result).toBeUndefined();
  });

  it('should throw when dto validation returns an error', async () => {
    const error = new Error('Invalid update status payload');
    mockedValidate.mockResolvedValueOnce(error);

    await expect(
      updateTransactionStatusHandler.execute(
        new UpdateTransactionStatusCommand(sampleDto),
      ),
    ).rejects.toThrow(error.message);

    expect(transactionRepo.updateStatusById).not.toHaveBeenCalled();
  });

  it('should throw TRANSACTION_NOT_FOUND when repository returns null', async () => {
    mockedValidate.mockResolvedValueOnce(sampleDto);
    transactionRepo.updateStatusById.mockResolvedValueOnce(null);

    await expect(
      updateTransactionStatusHandler.execute(
        new UpdateTransactionStatusCommand(sampleDto),
      ),
    ).rejects.toEqual(TRANSACTION_NOT_FOUND);
  });

  it('should propagate repository errors', async () => {
    mockedValidate.mockResolvedValueOnce(sampleDto);
    const error = new Error('DB failure');
    transactionRepo.updateStatusById.mockRejectedValueOnce(error);

    await expect(
      updateTransactionStatusHandler.execute(
        new UpdateTransactionStatusCommand(sampleDto),
      ),
    ).rejects.toThrow(error.message);
  });
});
