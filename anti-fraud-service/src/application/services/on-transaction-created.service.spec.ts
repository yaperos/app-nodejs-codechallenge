import { OnTransactionCreatedService } from './on-transaction-created.service';
import { EventPublisher } from '@ports/out/event-publisher';
import { TransactionCreatedEvent } from '@domain/events';

describe('OnTransactionCreatedService', () => {
  let publisher: jest.Mocked<EventPublisher>;
  let service: OnTransactionCreatedService;

  beforeEach(() => {
    publisher = {
      publishStatusChanged: jest.fn(),
    } as unknown as jest.Mocked<EventPublisher>;

    service = new OnTransactionCreatedService(publisher);
  });

  it('approves transactions at or below the threshold', async () => {
    const event: TransactionCreatedEvent = {
      transactionExternalId: 'tx-1',
      accountExternalIdDebit: 'deb-1',
      accountExternalIdCredit: 'cred-1',
      transferTypeId: 1,
      value: 500,
      createdAt: new Date('2025-01-01T00:00:00Z'),
    };

    await service.handle(event);

    expect(publisher.publishStatusChanged).toHaveBeenCalledWith(
      expect.objectContaining({
        transactionExternalId: 'tx-1',
        status: 'approved',
        reason: null,
      }),
    );
  });

  it('rejects transactions above the threshold', async () => {
    const event: TransactionCreatedEvent = {
      transactionExternalId: 'tx-2',
      accountExternalIdDebit: 'deb-1',
      accountExternalIdCredit: 'cred-1',
      transferTypeId: 1,
      value: 1500,
      createdAt: new Date('2025-01-01T00:00:00Z'),
    };

    await service.handle(event);

    expect(publisher.publishStatusChanged).toHaveBeenCalledWith(
      expect.objectContaining({
        transactionExternalId: 'tx-2',
        status: 'rejected',
        reason: 'Value exceeds threshold of 1000',
      }),
    );
  });
});
