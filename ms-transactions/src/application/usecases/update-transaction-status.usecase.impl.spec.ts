import { UpdateTransactionStatusUseCaseImpl } from './update-transaction-status.usecase.impl';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionStatus } from '../../domain/enums/transaction.enums';

describe('UpdateTransactionStatusUseCaseImpl', () => {
  let useCase: UpdateTransactionStatusUseCaseImpl;
  let transactionRepository: jest.Mocked<TransactionRepository>;
  let updateStatusSpy: jest.SpyInstance;

  beforeEach(() => {
    transactionRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    } as jest.Mocked<TransactionRepository>;
    updateStatusSpy = jest.spyOn(transactionRepository, 'updateStatus');
    useCase = new UpdateTransactionStatusUseCaseImpl(transactionRepository);
  });

  it('should call updateStatus with correct params', async () => {
    expect.hasAssertions();
    await useCase.execute('tx1', TransactionStatus.APPROVED);
    expect(updateStatusSpy).toHaveBeenCalledWith(
      'tx1',
      TransactionStatus.APPROVED,
    );
  });
});
