import { ProcessTransactionUseCase } from '../src/application/use-cases/process-transaction.usecase';
import { TransactionModel } from '../src/domain/models/transaction.model';

describe('ProcessTransactionUseCase', () => {
  let useCase: ProcessTransactionUseCase;

  beforeEach(() => {
    useCase = new ProcessTransactionUseCase();
  });

  it('debe retornar APPROVED si value <= 1000', async () => {
    const transaction: TransactionModel = {
      transactionExternalId: 'abc',
      value: 1000,
      accountExternalIdDebit: 'deb-123',
      accountExternalIdCredit: 'cred-456',
      transactionStatus: 'PENDING',
      createdAt: new Date(),
    };
    const result = await useCase.execute(transaction);
    expect(result).toBe('APPROVED');
  });

  it('debe retornar REJECTED si value > 1000', async () => {
    const transaction: TransactionModel = {
      transactionExternalId: 'abc',
      value: 2000,
      accountExternalIdDebit: 'deb-123',
      accountExternalIdCredit: 'cred-456',
      transactionStatus: 'PENDING',
      createdAt: new Date(),
    };
    const result = await useCase.execute(transaction);
    expect(result).toBe('REJECTED');
  });
});
