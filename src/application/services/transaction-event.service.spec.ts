import { Test, TestingModule } from '@nestjs/testing';
import { TransactionEventService } from './transaction-event.service';
import { ClientKafka } from '@nestjs/microservices';

describe('TransactionEventService', () => {
  let service: TransactionEventService;
  let mockKafkaClient: jest.Mocked<ClientKafka>;

  beforeEach(async () => {
    mockKafkaClient = {
      emit: jest.fn().mockReturnValue({ toPromise: () => Promise.resolve() }),
      send: jest.fn(),
      subscribeToResponseOf: jest.fn(),
      close: jest.fn(),
      connect: jest.fn(),
    } as unknown as jest.Mocked<ClientKafka>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionEventService,
        {
          provide: 'KAFKA_SERVICE',
          useValue: mockKafkaClient,
        },
      ],
    }).compile();

    service = module.get<TransactionEventService>(TransactionEventService);
  });

  describe('getAggregateType', () => {
    it('should return Transaction as aggregate type', () => {
      const result = service['getAggregateType']();
      expect(result).toBe('Transaction');
    });
  });

  describe('publishTransactionCreated', () => {
    it('should publish transaction created event with correct data', async () => {
      const publishEventSpy = jest.spyOn(service, 'publishEvent');

      await service.publishTransactionCreated(
        'txn-123',
        'ext-456',
        'P2P',
        100,
        'PEN',
        'src-acc',
        'tgt-acc',
        { key: 'value' }
      );

      expect(publishEventSpy).toHaveBeenCalledWith(
        'TransactionCreated',
        'txn-123',
        {
          externalId: 'ext-456',
          type: 'P2P',
          amount: 100,
          currency: 'PEN',
          sourceAccountId: 'src-acc',
          targetAccountId: 'tgt-acc',
          metadata: { key: 'value' },
        },
        {
          correlationId: 'ext-456',
        }
      );
    });
  });

  describe('publishTransactionProcessing', () => {
    it('should publish transaction processing event', async () => {
      const publishEventSpy = jest.spyOn(service, 'publishEvent');

      await service.publishTransactionProcessing('txn-123');

      expect(publishEventSpy).toHaveBeenCalledWith(
        'TransactionProcessing',
        'txn-123',
        { transactionId: 'txn-123' }
      );
    });
  });

  describe('publishTransactionCompleted', () => {
    it('should publish transaction completed event with timestamp', async () => {
      const publishEventSpy = jest.spyOn(service, 'publishEvent');
      const completedAt = new Date();

      await service.publishTransactionCompleted('txn-123', completedAt);

      expect(publishEventSpy).toHaveBeenCalledWith(
        'TransactionCompleted',
        'txn-123',
        { completedAt }
      );
    });
  });

  describe('publishTransactionFailed', () => {
    it('should publish transaction failed event with reason', async () => {
      const publishEventSpy = jest.spyOn(service, 'publishEvent');

      await service.publishTransactionFailed('txn-123', 'Network timeout');

      expect(publishEventSpy).toHaveBeenCalledWith(
        'TransactionFailed',
        'txn-123',
        { reason: 'Network timeout' }
      );
    });
  });
});
