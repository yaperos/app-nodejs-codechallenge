import { ConflictError } from 'src/modules/shared/domain/errors';
import { Uuid } from 'src/modules/shared/domain/value-object/uuid';
import { TransactionApprovedHandler } from 'src/modules/transaction/application/use-cases/transaction-approved-handler.use-case';
import { TransactionCriteria } from 'src/modules/transaction/domain/transaction-criteria';
import { ValidationStatus } from 'src/modules/transaction/domain/transaction-validation-status';

import { UuidMother } from '../../shared/domain/mothers';
// import { MockEventBrokerService } from '../../shared/domain/services/mock-event-broker.service';
import { MockTransactionRepository } from '../domain/mock-transaction.repository';
import { TransactionApprovedEventMother } from '../domain/mothers/events/transaction-approved-event.mother';
// import { TransactionUpdatedEventMother } from '../domain/mothers/events/transaction-updated-event.mother';
import { TransactionMother } from '../domain/mothers/transaction.mother';
import { MockTransactionCacheService } from '../domain/services/mock-transaction-cache.service';

describe('TransactionApprovedHandler UseCase', () => {
  const transactionRepository = new MockTransactionRepository();
  // const mockEventBrokerService = new MockEventBrokerService();
  const mockTransactionCacheService = new MockTransactionCacheService();
  const transactionApprovedHandler = new TransactionApprovedHandler(
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

    const transactionApprovedEvent = TransactionApprovedEventMother.create({
      aggregateId: transaction.getId(),
    });
    await transactionApprovedHandler.run(transactionApprovedEvent);

    expect(transaction.getValidationStatus()).toEqual(
      ValidationStatus.APPROVED,
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
      validationStatus: ValidationStatus.APPROVED,
    });
    transactionRepository.returnOnFindOneTransactionBy(transaction);

    const date = new Date();
    jest.spyOn(global, 'Date').mockImplementation(() => date);
    const uuid = UuidMother.random();
    jest.spyOn(Uuid, 'random').mockReturnValue(new Uuid(uuid));

    const transactionApprovedEvent = TransactionApprovedEventMother.create({
      aggregateId: transaction.getId(),
    });

    await expect(
      transactionApprovedHandler.run(transactionApprovedEvent),
    ).rejects.toThrow(ConflictError);

    expect(transaction.getValidationStatus()).toEqual(
      ValidationStatus.APPROVED,
    );
    transactionRepository.assertFindOneTransactionByHasBeenCalledWith(
      TransactionCriteria.createById(transaction.getId()),
    );
    transactionRepository.assertNotUpdateTransactionCalled();
    // mockEventBrokerService.assertNotPublishCalled();
    mockTransactionCacheService.assertNotSetCalled();
  });
});
