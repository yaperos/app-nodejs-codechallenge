import { UpdateTransactionStatusUseCaseImpl } from './update-transaction-status.usecase.impl';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionStatus } from '../../domain/enums/transaction.enums';
import { Cache } from 'cache-manager';

describe('UpdateTransactionStatusUseCaseImpl', () => {
  let useCase: UpdateTransactionStatusUseCaseImpl;
  let transactionRepository: jest.Mocked<TransactionRepository>;
  let cacheManager: jest.Mocked<Pick<Cache, 'get' | 'set' | 'del'>>;
  let updateStatusSpy: jest.SpyInstance;

  beforeEach(() => {
    transactionRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    } as jest.Mocked<TransactionRepository>;

    cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    } as jest.Mocked<Pick<Cache, 'get' | 'set' | 'del'>>;

    updateStatusSpy = jest.spyOn(transactionRepository, 'updateStatus');
    useCase = new UpdateTransactionStatusUseCaseImpl(
      transactionRepository,
      cacheManager as unknown as Cache,
    );
  });

  it('should call updateStatus with correct params', async () => {
    expect.hasAssertions();
    cacheManager.get.mockResolvedValue(null); // No cached transaction
    await useCase.execute('tx1', TransactionStatus.APPROVED);
    expect(updateStatusSpy).toHaveBeenCalledWith(
      'tx1',
      TransactionStatus.APPROVED,
    );
  });

  it('should update cache when transaction exists in cache', async () => {
    expect.hasAssertions();
    const cachedTransaction = {
      id: 'tx1',
      status: TransactionStatus.PENDING,
      accountDebit: 'acc1',
      accountCredit: 'acc2',
      transferType: 1,
      value: '100.00',
      createdAt: '2023-01-01T00:00:00.000Z',
    };
    cacheManager.get.mockResolvedValue(cachedTransaction);

    await useCase.execute('tx1', TransactionStatus.APPROVED);

    expect(cacheManager.get).toHaveBeenCalledWith('transaction:tx1');
    expect(cacheManager.set).toHaveBeenCalledWith(
      'transaction:tx1',
      { ...cachedTransaction, status: TransactionStatus.APPROVED },
      3600,
    );
  });
});
