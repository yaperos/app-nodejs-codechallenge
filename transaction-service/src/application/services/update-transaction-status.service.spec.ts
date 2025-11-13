import { UpdateTransactionStatusService } from './update-transaction-status.service';
import { TransactionRepository } from '@ports/out/transaction-repository';
import { TransactionStatusChangedEvent } from '@domain/transaction';

describe('UpdateTransactionStatusService', () => {
  let repository: jest.Mocked<TransactionRepository>;
  let service: UpdateTransactionStatusService;

  beforeEach(() => {
    repository = {
      createWithOutbox: jest.fn(),
      findByExternalId: jest.fn(),
      updateStatus: jest.fn(),
    } as unknown as jest.Mocked<TransactionRepository>;

    service = new UpdateTransactionStatusService(repository);
  });

  it('delegates status update to repository', async () => {
    const event: TransactionStatusChangedEvent = {
      transactionExternalId: 'ext-123',
      status: 'approved',
      evaluatedAt: new Date(),
      reason: null,
    };

    await service.handle(event);

    expect(repository.updateStatus).toHaveBeenCalledWith('ext-123', 'approved');
  });
});
