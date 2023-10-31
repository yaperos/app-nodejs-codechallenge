import { assert, beforeEach, describe, expect, it, vi } from 'vitest';

import { ValidateTransactionUseCaseInput } from '../../src/core/domain';
import { ValidateTransactionUseCase } from '../../src/core/usecases';

describe('Validate Transaction UseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const eventEmitterMock = {
    sendApprovedTransactionEvent: vi.fn(),
    sendRejectedTransactionEvent: vi.fn(),
  };

  const validateTransactionUseCase = new ValidateTransactionUseCase({
    eventEmitter: eventEmitterMock,
    transactionValueLimit: 1000,
  });

  it('Should throw an error if transaction id is not defined', async () => {
    const input = {
      transaction: {
        value: 500,
      },
    };

    await expect(
      validateTransactionUseCase.execute(
        input as ValidateTransactionUseCaseInput,
      ),
    ).rejects.toThrow('TRANSACTION_ID_NOT_DEFINED');
  });

  it('Should send an approved transaction event if transaction value is below or equal to the limit', async () => {
    const input = {
      transaction: {
        id: '123',
        value: 500,
      },
    };

    const result = await validateTransactionUseCase.execute(input);

    expect(eventEmitterMock.sendApprovedTransactionEvent).toBeCalledWith(
      input.transaction,
    );
    expect(eventEmitterMock.sendRejectedTransactionEvent).not.toBeCalled();
    expect(result.success).toBeTruthy();
  });

  it('Should send a rejected transaction event if transaction value is above the limit', async () => {
    const transaction = {
      id: '123',
      value: 1500,
    };

    const result = await validateTransactionUseCase.execute({ transaction });

    expect(eventEmitterMock.sendApprovedTransactionEvent).not.toBeCalled();
    expect(eventEmitterMock.sendRejectedTransactionEvent).toBeCalledWith(
      transaction,
      'VALUE_LIMIT_EXCEEDED',
    );

    expect(result.success).toBeTruthy();
  });
});
