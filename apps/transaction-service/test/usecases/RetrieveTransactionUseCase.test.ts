import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RetrieveTransactionUseCaseInput } from '../../src/core/domain';
import { AppTransactionParserService } from '../../src/core/services';
import { RetrieveTransactionUseCase } from '../../src/core/usecases';
import { transactionMock, transactionRepositoryMock } from '../test.mocks';

describe('Retrieve Transaction Use Case', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const transactionParserService = new AppTransactionParserService();
  const retrieveTransactionUseCase = new RetrieveTransactionUseCase({
    parserService: transactionParserService,
    transactionRepository: transactionRepositoryMock,
  });

  it('Should throw an error if externalId is missing', async () => {
    const input = {};

    await expect(
      retrieveTransactionUseCase.execute(
        input as unknown as RetrieveTransactionUseCaseInput,
      ),
    ).rejects.toThrow('TRANSACTION_EXTERNAL_ID_MISSING');
  });

  it('Should retrieve a parsed transaction from repository by externalId', async () => {
    const externalId = 'sample-external-id';
    transactionRepositoryMock.get.mockResolvedValue(transactionMock);

    const result = await retrieveTransactionUseCase.execute({ externalId });

    expect(transactionRepositoryMock.get).toHaveBeenCalledWith(externalId);
    expect(result).toEqual(transactionParserService.parse(transactionMock));
  });
});
