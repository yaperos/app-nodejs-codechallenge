import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UpdateTransactionUseCaseInput } from '../../src/core/domain';
import { AppTransactionParserService } from '../../src/core/services';
import { UpdateTransactionUseCase } from '../../src/core/usecases';
import { transactionMock, transactionRepositoryMock } from '../test.mocks';

describe('Update Transaction Use Case', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const transactionParserService = new AppTransactionParserService();
  const updateTransactionUseCase = new UpdateTransactionUseCase({
    parserService: transactionParserService,
    transactionRepository: transactionRepositoryMock,
  });

  it('Should throw an error if transaction id is not defined', async () => {
    const input = {
      status: 'PENDING',
    };

    await expect(
      updateTransactionUseCase.execute(
        input as unknown as UpdateTransactionUseCaseInput,
      ),
    ).rejects.toThrow('TRANSACTION_ID_NOT_DEFINED');
  });

  it('Should throw an error if transaction status is not valid', async () => {
    const input = {
      id: 'sample-id',
      status: 'INVALID_STATUS',
    };

    await expect(
      updateTransactionUseCase.execute(
        input as unknown as UpdateTransactionUseCaseInput,
      ),
    ).rejects.toThrow('TRANSACTION_STATUS_NOT_VALID');
  });

  it('Should update approved transaction and return parsed value', async () => {
    const input = {
      errorMessage: undefined,
      id: 'sample-id',
      status: 'APPROVED',
    };
    const updatedTransaction = {
      ...transactionMock,
      status: input.status,
    };
    transactionRepositoryMock.update.mockResolvedValue(updatedTransaction);

    const result = await updateTransactionUseCase.execute(input);

    expect(transactionRepositoryMock.update).toHaveBeenCalledWith(input.id, {
      annotations: input.errorMessage,
      status: input.status,
    });
    expect(result).toEqual(transactionParserService.parse(updatedTransaction));
  });

  it('Should update rejected transaction and return parsed value', async () => {
    const input = {
      errorMessage: 'Sample Error Message',
      id: 'sample-id',
      status: 'REJECTED',
    };
    const updatedTransaction = {
      ...transactionMock,
      status: input.status,
    };

    transactionRepositoryMock.update.mockResolvedValue(updatedTransaction);

    const result = await updateTransactionUseCase.execute(input);

    expect(transactionRepositoryMock.update).toHaveBeenCalledWith(input.id, {
      annotations: input.errorMessage,
      status: input.status,
    });
    expect(result).toEqual(transactionParserService.parse(updatedTransaction));
  });
});
