import { Uuid } from 'src/modules/shared/domain/value-object/uuid';
import { TransactionCreator } from 'src/modules/transaction/application/use-cases/transaction-creator.use-case';
import { ValidationStatus } from 'src/modules/transaction/domain/transaction-validation-status';

import { UuidMother } from '../../shared/domain/mothers';
import { MockEventBrokerService } from '../../shared/domain/services/mock-event-broker.service';
import { MockTransactionRepository } from '../domain/mock-transaction.repository';
import { TransactionCreatedEventMother } from '../domain/mothers/events/transaction-created-event.mother';
import { TransactionMother } from '../domain/mothers/transaction.Mother';
import { MockTransactionCacheService } from '../domain/services/mock-transaction-cache.service';

describe('TransactionCreator UseCase', () => {
  const transactionRepository = new MockTransactionRepository();
  const mockEventBrokerService = new MockEventBrokerService();
  const mockTransactionCacheService = new MockTransactionCacheService();
  const transactionCreator = new TransactionCreator(
    transactionRepository,
    mockEventBrokerService,
    mockTransactionCacheService,
  );

  it('should save the transaction', async () => {
    const date = new Date();
    jest.spyOn(global, 'Date').mockImplementation(() => date);
    const uuid = UuidMother.random();
    jest.spyOn(Uuid, 'random').mockReturnValue(new Uuid(uuid));

    const transaction = TransactionMother.create({
      validationStatus: ValidationStatus.PENDING,
    });

    const transactionCreatedEvent = TransactionCreatedEventMother.create({
      id: uuid,
      aggregateId: transaction.getId(),
      amount: transaction.getAmount(),
    });

    const transactionCreated = await transactionCreator.run(
      transaction.getId(),
      transaction.getCreditAccountExternalId(),
      transaction.getDebitAccountExternalId(),
      transaction.getAmount(),
      transaction.getTransferType(),
    );

    expect(transactionCreated).toEqual(transaction);
    transactionRepository.assertCreateTransactionHasBeenCalledWith(transaction);
    mockEventBrokerService.assertPublishHasBeenCalledWith([
      transactionCreatedEvent,
    ]);
    mockTransactionCacheService.assertSetHasBeenCalledWith(transaction);
  });
});
