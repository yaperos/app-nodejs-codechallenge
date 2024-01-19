import { AmountService } from 'src/modules/shared/domain/services/amount.service';
import { Uuid } from 'src/modules/shared/domain/value-object/uuid';
import { TransactionCreatedHandler } from 'src/modules/transaction/application/use-cases/transaction-created-handler.use-case';
import { UuidMother } from 'tests/unit/modules/shared/domain/mothers';
import { FloatMother } from 'tests/unit/modules/shared/domain/mothers/float.mother';
import { MockEventBrokerService } from 'tests/unit/modules/shared/domain/services/mock-event-broker.service';
import { TransactionApprovedEventMother } from 'tests/unit/modules/transaction/domain/mothers/transaction-approved-event.mother';
import { TransactionCreatedEventMother } from 'tests/unit/modules/transaction/domain/mothers/transaction-created-event.mother';
import { TransactionRejectedEventMother } from 'tests/unit/modules/transaction/domain/mothers/transaction-rejected-event.mother';

describe('TransactionCreatedHandler UseCase', () => {
  const mockEventBrokerService = new MockEventBrokerService();
  const amountService = new AmountService();
  const transactionCreatedHandler = new TransactionCreatedHandler(
    amountService,
    mockEventBrokerService,
  );

  it('should handle the event and approve', async () => {
    const date = new Date();
    jest.spyOn(global, 'Date').mockImplementation(() => date);
    const uuid = UuidMother.random();
    jest.spyOn(Uuid, 'random').mockReturnValue(new Uuid(uuid));

    const transactionCreatedEvent = TransactionCreatedEventMother.create({
      amount: FloatMother.random({
        min: 1,
        max: AmountService.MAX_VALID_VALUE,
      }),
    });
    const transactionApprovedEvent = TransactionApprovedEventMother.create({
      id: uuid,
      occurredOn: date,
      aggregateId: transactionCreatedEvent.aggregateId,
    });

    await transactionCreatedHandler.run(transactionCreatedEvent);
    mockEventBrokerService.assertPublishHasBeenCalledWith([
      transactionApprovedEvent,
    ]);
  });

  it('should handle the event and reject', async () => {
    const date = new Date();
    jest.spyOn(global, 'Date').mockImplementation(() => date);
    const uuid = UuidMother.random();
    jest.spyOn(Uuid, 'random').mockReturnValue(new Uuid(uuid));

    const transactionCreatedEvent = TransactionCreatedEventMother.create({
      amount: FloatMother.random({
        min: AmountService.MAX_VALID_VALUE + 1,
      }),
    });
    const transactionRejectedEvent = TransactionRejectedEventMother.create({
      id: uuid,
      occurredOn: date,
      aggregateId: transactionCreatedEvent.aggregateId,
    });

    await transactionCreatedHandler.run(transactionCreatedEvent);
    mockEventBrokerService.assertPublishHasBeenCalledWith([
      transactionRejectedEvent,
    ]);
  });
});
