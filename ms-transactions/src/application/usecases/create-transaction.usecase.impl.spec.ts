import { CreateTransactionUseCaseImpl } from './create-transaction.usecase.impl';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { OutboxEventRepository } from '../../domain/repositories/outbox-event.repository';
import { DataSource } from 'typeorm';
import { Transaction } from '../../domain/entities/transaction';
import {
  TransactionStatus,
  TransactionType,
} from '../../domain/enums/transaction.enums';
import { CreateTransactionDto } from '../../domain/dto/create-transaction.dto';
import { Cache } from 'cache-manager';
import Decimal from 'decimal.js';

describe('CreateTransactionUseCaseImpl', () => {
  let useCase: CreateTransactionUseCaseImpl;
  let transactionRepository: jest.Mocked<TransactionRepository>;
  let outboxEventRepository: jest.Mocked<OutboxEventRepository>;
  let dataSource: jest.Mocked<DataSource>;
  let cacheManager: jest.Mocked<Pick<Cache, 'get' | 'set' | 'del'>>;
  let mockManager: Record<string, unknown>;
  let transactionSpy: jest.SpyInstance;
  let createTransactionSpy: jest.SpyInstance;
  let createOutboxSpy: jest.SpyInstance;

  beforeEach(() => {
    transactionRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    } as jest.Mocked<TransactionRepository>;

    outboxEventRepository = {
      create: jest.fn(),
      findUnprocessed: jest.fn(),
      markAsProcessed: jest.fn(),
    } as jest.Mocked<OutboxEventRepository>;

    cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    } as jest.Mocked<Pick<Cache, 'get' | 'set' | 'del'>>;

    mockManager = {};
    dataSource = {
      transaction: jest.fn(),
    } as unknown as jest.Mocked<DataSource>;

    transactionSpy = jest.spyOn(dataSource, 'transaction');
    createTransactionSpy = jest.spyOn(transactionRepository, 'create');
    createOutboxSpy = jest.spyOn(outboxEventRepository, 'create');

    transactionSpy.mockImplementation(
      (callback: (manager: Record<string, unknown>) => Promise<Transaction>) =>
        callback(mockManager),
    );

    useCase = new CreateTransactionUseCaseImpl(
      transactionRepository,
      outboxEventRepository,
      dataSource,
      cacheManager as unknown as Cache,
    );
  });

  it('should create transaction and outbox event successfully', async () => {
    expect.hasAssertions();
    const dto: CreateTransactionDto = {
      accountExternalIdDebit: '550e8400-e29b-41d4-a716-446655440000',
      accountExternalIdCredit: '550e8400-e29b-41d4-a716-446655440001',
      tranferTypeId: 1,
      value: 100,
    };

    const savedTransaction: Transaction = {
      id: 'tx-123',
      accountDebit: dto.accountExternalIdDebit,
      accountCredit: dto.accountExternalIdCredit,
      transferType: TransactionType.TRANSFER,
      status: TransactionStatus.PENDING,
      value: new Decimal(dto.value),
      createdAt: new Date(),
    };

    createTransactionSpy.mockResolvedValue(savedTransaction);
    createOutboxSpy.mockResolvedValue({
      id: 'outbox-123',
      eventType: 'TRANSACTION_CREATED',
      payload: {},
      aggregateId: savedTransaction.id,
      processed: false,
    });

    const result = await useCase.execute(dto);

    expect(transactionSpy).toHaveBeenCalledWith(expect.any(Function));
    expect(createTransactionSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        accountDebit: dto.accountExternalIdDebit,
        accountCredit: dto.accountExternalIdCredit,
        transferType: TransactionType.TRANSFER,
        status: TransactionStatus.PENDING,
      }),
      { transactionManager: mockManager },
    );
    expect(createOutboxSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'TRANSACTION_CREATED',
        aggregateId: savedTransaction.id,
        processed: false,
      }),
      { transactionManager: mockManager },
    );
    expect(cacheManager.set).toHaveBeenCalledWith(
      `transaction:${savedTransaction.id}`,
      expect.objectContaining({
        id: savedTransaction.id,
        value: '100',
      }),
      3600,
    );
    expect(result).toBe(savedTransaction);
  });
});
