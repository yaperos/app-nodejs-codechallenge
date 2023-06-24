import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudService } from './anti-fraud.service';
import { TransactionCreatedEvent } from './event/transaction-created-event';
import { randomUUID } from 'crypto';

describe('AntiFraudService', () => {
  let service: AntiFraudService;
  let transactionsClientMock;

  beforeEach(async () => {
    transactionsClientMock = {
      emit: jest.fn((pattern: string, data: any): void => {
        console.log(`Emitted event: ${pattern} with data: ${data}`);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AntiFraudService,
        {
          provide: 'TRANSACTIONS_MICROSERVICE',
          useValue: transactionsClientMock,
        },
      ],
    }).compile();

    service = module.get(AntiFraudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should handle a created transaction event', () => {
    const event: TransactionCreatedEvent = new TransactionCreatedEvent(
      randomUUID(),
      800,
    );

    service.handleTransactionCreated(event);
    expect(transactionsClientMock.emit).toHaveBeenCalledTimes(1);
  });
});
