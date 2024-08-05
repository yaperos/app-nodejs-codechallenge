import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { TransactionValidatedHandler } from '../transaction-validated.handler';
import { TransactionValidatedEvent } from '@app/common/events/transaction-validated.event';
import { StatusType, StatusTypeLabels } from '@app/common';
import { TransactionStatusUpdatedSagaEvent } from '../../saga/transaction-status-updated-saga.event';

describe('TransactionValidatedHandler', () => {
  let handler: TransactionValidatedHandler;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionValidatedHandler,
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<TransactionValidatedHandler>(
      TransactionValidatedHandler,
    );
    eventBus = module.get<EventBus>(EventBus);
  });

  it('should handle TransactionValidatedEvent and publish', async () => {
    const transactionValidatedEvent = new TransactionValidatedEvent({
      id: 'transaction-id',
      value: 3800,
    });

    const expectedSagaEvent = new TransactionStatusUpdatedSagaEvent({
      id: 'transaction-id',
      transactionStatusId: StatusType.rejected,
      transactionStatusName: StatusTypeLabels[StatusType.rejected],
    });

    await handler.handle(transactionValidatedEvent);

    expect(eventBus.publish).toHaveBeenCalledWith(expectedSagaEvent);
  });

  it('should determine status as approved for value <= 1000', async () => {
    const transactionValidatedEvent = new TransactionValidatedEvent({
      id: 'transaction-id',
      value: 500,
    });

    const expectedSagaEvent = new TransactionStatusUpdatedSagaEvent({
      id: 'transaction-id',
      transactionStatusId: StatusType.approved,
      transactionStatusName: StatusTypeLabels[StatusType.approved],
    });

    await handler.handle(transactionValidatedEvent);

    expect(eventBus.publish).toHaveBeenCalledWith(expectedSagaEvent);
  });
});
