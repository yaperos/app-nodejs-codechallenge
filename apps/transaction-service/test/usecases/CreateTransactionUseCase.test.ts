import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CreateTransactionUseCaseInput } from '../../src/core/domain';
import { AppTransactionParserService } from '../../src/core/services';
import { CreateTransactionUseCase } from '../../src/core/usecases';
import {
  eventEmitterMock,
  transactionMock,
  transactionRepositoryMock,
  transactionTypeMock,
  transactionTypeRepositoryMock,
} from '../test.mocks';

describe('Create Transaction Use Case', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const transactionParserService = new AppTransactionParserService();
  const createTransactionUseCase = new CreateTransactionUseCase({
    eventEmitter: eventEmitterMock,
    parserService: transactionParserService,
    transactionRepository: transactionRepositoryMock,
    transactionTypeRepository: transactionTypeRepositoryMock,
  });

  it('Should throw an error if accountExternalIdCredit is not defined', async () => {
    const input = {
      accountExternalIdDebit: 'some-id',
      tranferTypeId: 'transfer-type-id',
      value: 1000,
    };

    await expect(
      createTransactionUseCase.execute(
        input as unknown as CreateTransactionUseCaseInput,
      ),
    ).rejects.toThrow('ACCOUNT_EXTERNAL_ID_CREDIT_NOT_DEFINED');
  });

  it('Should throw an error if accountExternalIdDebit is not defined', async () => {
    const input = {
      accountExternalIdCredit: 'some-id',
      tranferTypeId: 'transfer-type-id',
      value: 1000,
    };

    await expect(
      createTransactionUseCase.execute(
        input as unknown as CreateTransactionUseCaseInput,
      ),
    ).rejects.toThrow('ACCOUNT_EXTERNAL_ID_DEBIT_NOT_DEFINED');
  });

  it('Should throw an error if tranferTypeId is not defined', async () => {
    const input = {
      accountExternalIdCredit: 'some-id',
      accountExternalIdDebit: 'some-id',
      value: 1000,
    };

    await expect(
      createTransactionUseCase.execute(
        input as unknown as CreateTransactionUseCaseInput,
      ),
    ).rejects.toThrow('TRANSFER_TYPE_ID_NOT_DEFINED');
  });

  it('Should throw an error if transaction type not found', async () => {
    transactionTypeRepositoryMock.getById.mockResolvedValue(null);
    const input = {
      accountExternalIdCredit: 'some-id',
      accountExternalIdDebit: 'some-id',
      tranferTypeId: 'invalid-id',
      value: 1000,
    };

    await expect(
      createTransactionUseCase.execute(
        input as unknown as CreateTransactionUseCaseInput,
      ),
    ).rejects.toThrow('TRANSACTION_TYPE_NOT_VALID');
  });

  it('Should create a transaction and emit an transaction created event', async () => {
    transactionTypeRepositoryMock.getById.mockResolvedValue(
      transactionTypeMock,
    );
    transactionRepositoryMock.insert.mockResolvedValue(transactionMock);
    const input = {
      accountExternalIdCredit: 'some-id',
      accountExternalIdDebit: 'some-id',
      tranferTypeId: 'valid-id',
      value: 1000,
    };

    const result = await createTransactionUseCase.execute(
      input as unknown as CreateTransactionUseCaseInput,
    );

    expect(transactionRepositoryMock.insert).toHaveBeenCalledWith({
      accountExternalIdCredit: input.accountExternalIdCredit,
      accountExternalIdDebit: input.accountExternalIdDebit,
      transactionType: transactionTypeMock,
      value: input.value,
    });
    expect(eventEmitterMock.sendCreatedTransactionEvent).toHaveBeenCalledWith({
      id: transactionMock.id,
      value: input.value,
    });
    expect(result).toEqual(transactionParserService.parse(transactionMock));
  });
});
