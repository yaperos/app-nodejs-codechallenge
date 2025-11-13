import { CreateTransactionService } from './create-transaction.service';
import { TransactionRepository } from '@ports/out/transaction-repository';
import { TRANSACTIONS_CREATED_TOPIC } from '@adapters/messaging/constants';
import { CreateTransactionCommand } from '@application/commands/create-transaction.command';
import { Transaction, createPendingTransaction } from '@domain/transaction';

describe('CreateTransactionService', () => {
  let repository: jest.Mocked<TransactionRepository>;
  let service: CreateTransactionService;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-01T00:00:00Z'));

    repository = {
      createWithOutbox: jest.fn(),
      findByExternalId: jest.fn(),
      updateStatus: jest.fn(),
    } as unknown as jest.Mocked<TransactionRepository>;

    service = new CreateTransactionService(repository);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('persists transaction and writes outbox message', async () => {
    const command: CreateTransactionCommand = {
      transactionExternalId: 'ext-1',
      accountExternalIdDebit: 'deb-1',
      accountExternalIdCredit: 'cred-1',
      transferTypeId: 2,
      value: 250,
    };

    const persistedTransaction: Transaction = createPendingTransaction({
      transactionExternalId: 'ext-1',
      accountExternalIdDebit: 'deb-1',
      accountExternalIdCredit: 'cred-1',
      transferTypeId: 2,
      value: 250,
      createdAt: new Date('2025-01-01T00:00:00Z'),
    });

    repository.createWithOutbox.mockResolvedValue(persistedTransaction);

    const result = await service.execute(command);

    expect(result).toEqual(persistedTransaction);
    expect(repository.createWithOutbox).toHaveBeenCalledTimes(1);

    const [transactionArg, outboxArg] = repository.createWithOutbox.mock.calls[0];
    expect(transactionArg).toMatchObject({
      transactionExternalId: 'ext-1',
      status: 'pending',
      createdAt: new Date('2025-01-01T00:00:00Z'),
    });

    expect(outboxArg).toEqual({
      topic: TRANSACTIONS_CREATED_TOPIC,
      key: 'ext-1',
      payload: {
        transactionExternalId: 'ext-1',
        accountExternalIdDebit: 'deb-1',
        accountExternalIdCredit: 'cred-1',
        transferTypeId: 2,
        value: 250,
        createdAt: new Date('2025-01-01T00:00:00Z').getTime(),
      },
      nextAttemptAt: new Date('2025-01-01T00:00:00Z'),
    });
  });

  it('generates external id when not provided', async () => {
    repository.createWithOutbox.mockImplementation(async (transaction) => transaction);

    const result = await service.execute({
      accountExternalIdDebit: 'deb-1',
      accountExternalIdCredit: 'cred-1',
      transferTypeId: 2,
      value: 250,
    });

    expect(result.transactionExternalId).toBeDefined();
    expect(repository.createWithOutbox).toHaveBeenCalledTimes(1);
  });
});
