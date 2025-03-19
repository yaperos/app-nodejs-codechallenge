import { GetTransactionUseCase } from '../src/application/use-cases/get-transaction.usecase';
import { TransactionRepository } from '../src/domain/repositories/transaction.repository';
import { NotFoundException } from '@nestjs/common';

describe('GetTransactionUseCase', () => {
  let getTransactionUseCase: GetTransactionUseCase;
  let mockRepository: jest.Mocked<TransactionRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    };
    getTransactionUseCase = new GetTransactionUseCase(mockRepository);
  });

  it('debe retornar la transacción si existe', async () => {
    mockRepository.findById.mockResolvedValue({
      transactionExternalId: 'fake-guid',
      accountExternalIdDebit: 'debit-guid',
      accountExternalIdCredit: 'credit-guid',
      transferTypeId: 1,
      value: 120,
      transactionStatus: 'PENDING',
      createdAt: new Date(),
    });

    const result = await getTransactionUseCase.execute('fake-guid');
    expect(result.transactionExternalId).toBe('fake-guid');
  });

  it('debe arrojar NotFoundException si no existe', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(getTransactionUseCase.execute('non-existent-guid'))
      .rejects
      .toThrow(NotFoundException);
  });
});
