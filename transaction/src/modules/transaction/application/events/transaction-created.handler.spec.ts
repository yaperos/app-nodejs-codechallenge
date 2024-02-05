import { Test, TestingModule } from '@nestjs/testing';

import { TransactionCreatedEvent } from '../../domain/events/transaction-created.event';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionDoc } from '../../infrastructure/entities/transaction-doc.entity';
import { TransactionKafkaService } from '../../infrastructure/services/transaction-kafka.service';
import { TransactionInfrastructure } from '../../infrastructure/transaction.infrastructure';
import { TransactionCreatedHandler } from './transaction-created.handler';

describe('TransactionCreatedHandler', () => {
  let handler: TransactionCreatedHandler;
  let repository: jest.Mocked<TransactionRepository>;
  let kafkaService: jest.Mocked<TransactionKafkaService>;

  beforeEach(async () => {
    const repositoryMock = {
      save_doc: jest.fn(),
    };
    const kafkaServiceMock = {
      sentTransaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionCreatedHandler,
        { provide: TransactionInfrastructure, useValue: repositoryMock },
        { provide: TransactionKafkaService, useValue: kafkaServiceMock },
      ],
    }).compile();

    handler = module.get<TransactionCreatedHandler>(TransactionCreatedHandler);
    repository = module.get(TransactionInfrastructure);
    kafkaService = module.get(TransactionKafkaService);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should handle a transaction created event', async () => {
    const transactionId = '8e6d77ca-ca6e-40f7-88a5-c5a0728c0420';
    const status = 'APPROVED';
    const transferTypeName = 'TRANSFER';
    const value = 100;
    const createdAt = new Date();

    const event = new TransactionCreatedEvent(
      transactionId,
      status,
      transferTypeName,
      value,
      createdAt,
    );

    const doc = new TransactionDoc();
    doc.transactionId = event.transactionId;
    doc.transactionStatus = { name: event.status };
    doc.transactionType = { name: event.transferTypeName };
    doc.value = event.value;
    doc.createdAt = event.createdAt;

    await handler.handle(event);

    expect(repository.save_doc).toHaveBeenCalledWith(doc);
    expect(kafkaService.sentTransaction).toHaveBeenCalledWith(
      event.transactionId,
      event.value,
    );
  });
});
