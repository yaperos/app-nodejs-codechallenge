import { ConflictError } from 'src/modules/shared/domain/errors';
import { Uuid } from 'src/modules/shared/domain/value-object/uuid';
import { TransactionRejectedHandler } from 'src/modules/transaction/application/use-cases/transaction-rejected-handler.use-case';
import { TransactionCriteria } from 'src/modules/transaction/domain/transaction-criteria';
import { ValidationStatus } from 'src/modules/transaction/domain/transaction-validation-status';

import { UuidMother } from '../../shared/domain/mothers';
// import { MockEventBrokerService } from '../../shared/domain/services/mock-event-broker.service';
import { MockTransactionRepository } from '../domain/mock-transaction.repository';
import { TransactionRejectedEventMother } from '../domain/mothers/events/transaction-rejected-event.mother';
// import { TransactionUpdatedEventMother } from '../domain/mothers/events/transaction-updated-event.Mother';
import { TransactionMother } from '../domain/mothers/transaction.Mother';
import { MockTransactionCacheService } from '../domain/services/mock-transaction-cache.service';

describe('TransactionRejectedHandler UseCase', () => {
  const transactionRepository = new MockTransactionRepository();
  // const mockEventBrokerService = new MockEventBrokerService();
  const mockTransactionCacheService = new MockTransactionCacheService();
  const transactionRejectedHandler = new TransactionRejectedHandler(
    transactionRepository,
    // mockEventBrokerService,
    mockTransactionCacheService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update the transaction', async () => {
    const transaction = TransactionMother.create({
      validationStatus: ValidationStatus.PENDING,
    });
    transactionRepository.returnOnFindOneTransactionBy(transaction);

    const date = new Date();
    jest.spyOn(global, 'Date').mockImplementation(() => date);
    const uuid = UuidMother.random();
    jest.spyOn(Uuid, 'random').mockReturnValue(new Uuid(uuid));

    const transactionRejectedEvent = TransactionRejectedEventMother.create({
      aggregateId: transaction.getId(),
    });
    await transactionRejectedHandler.run(transactionRejectedEvent);

    expect(transaction.getValidationStatus()).toEqual(
      ValidationStatus.REJECTED,
    );
    transactionRepository.assertFindOneTransactionByHasBeenCalledWith(
      TransactionCriteria.createById(transaction.getId()),
    );
    transactionRepository.assertUpdateTransactionHasBeenCalledWith(transaction);

    // const transactionUpdatedEvent = TransactionUpdatedEventMother.create({
    //   id: uuid,
    //   aggregateId: transaction.getId(),
    //   occurredOn: date,
    // });
    // mockEventBrokerService.assertPublishHasBeenCalledWith([
    //   transactionUpdatedEvent,
    // ]);
    mockTransactionCacheService.assertSetHasBeenCalledWith(transaction);
  });

  it('should throw a conflict error', async () => {
    const transaction = TransactionMother.create({
      validationStatus: ValidationStatus.REJECTED,
    });
    transactionRepository.returnOnFindOneTransactionBy(transaction);

    const date = new Date();
    jest.spyOn(global, 'Date').mockImplementation(() => date);
    const uuid = UuidMother.random();
    jest.spyOn(Uuid, 'random').mockReturnValue(new Uuid(uuid));

    const transactionRejectedEvent = TransactionRejectedEventMother.create({
      aggregateId: transaction.getId(),
    });

    await expect(
      transactionRejectedHandler.run(transactionRejectedEvent),
    ).rejects.toThrow(ConflictError);

    expect(transaction.getValidationStatus()).toEqual(
      ValidationStatus.REJECTED,
    );
    transactionRepository.assertFindOneTransactionByHasBeenCalledWith(
      TransactionCriteria.createById(transaction.getId()),
    );
    transactionRepository.assertNotUpdateTransactionCalled();
    // mockEventBrokerService.assertNotPublishCalled();
    mockTransactionCacheService.assertNotSetCalled();
  });
});
