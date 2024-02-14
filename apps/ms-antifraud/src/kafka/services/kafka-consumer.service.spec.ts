import { Test, TestingModule } from '@nestjs/testing';
import { KafkaConsumerService } from './kafka-consumer.service';
import { Kafka, EachMessagePayload } from 'kafkajs';
import { TransactionService } from '../../transactions/services/transaction.service';

jest.mock('kafkajs', () => ({
  Kafka: jest.fn(),
  Consumer: jest.fn(),
}));

const mockConnect = jest.fn();
const mockSubscribe = jest.fn();
const mockRun = jest.fn();

(Kafka as jest.Mock).mockImplementation(() => ({
  consumer: jest.fn(() => ({
    connect: mockConnect,
    subscribe: mockSubscribe,
    run: mockRun,
  })),
}));

const mockTransactionService = {
  updateTransaction: jest.fn(),
};

describe('KafkaConsumerService', () => {
  let service: KafkaConsumerService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaConsumerService,
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    service = module.get<KafkaConsumerService>(KafkaConsumerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('connect', () => {
    it('should connect to Kafka consumer', async () => {
      await service.connect();

      expect(mockConnect).toHaveBeenCalled();
    });
  });

  describe('subscribeToTopic', () => {
    it('should subscribe to Kafka topic', async () => {
      await service.subscribeToTopic();

      const expectedTopic = process.env.KAFKA_TRANSACTIONS_TOPIC;
      const expectedSubscribeOptions = { topic: expectedTopic, fromBeginning: true };

      expect(mockSubscribe).toHaveBeenCalledWith(expectedSubscribeOptions);
    });
  });

  describe('run', () => {
    it('should run Kafka consumer and update transaction status', async () => {
      const mockPayload: EachMessagePayload = {
        topic: 'test-topic',
        partition: 0,
        message: {
          key: null,
          value: Buffer.from(JSON.stringify({
            "transactionExternalId": "ed8b36b4-4679-4403-a4d9-3fcd00b3becf",
            "accountExternalIdDebit": "a5e7be8d-12a5-4a3e-abfa-03ea7bc520b1",
            "accountExternalIdCredit": "9cdef21b-b973-4860-adc5-7eda63e0e1c1",
            "transferTypeId": 1,
            "transferStatusId": 1,
            "value": 5000,
            "transactionType": {
                "id": 1,
                "name": "Interbancaria"
            },
            "transactionStatus": {
                "id": 1,
                "name": "pending"
            },
            "createdAt": new Date("2024-02-11T15:02:16.941Z"),
            "updatedAt": new Date("2024-02-11T15:02:16.941Z"),
          })),
          timestamp: '2024-02-11T12:00:00Z',
          attributes: 0,
          offset: '123',
          headers: null,
        },
        heartbeat: jest.fn(),
        pausets: jest.fn(),
      } as any;
  
      mockRun.mockImplementationOnce(async ({ eachMessage }) => {
        await eachMessage(mockPayload);
      });
  
      await service.run();
  
      const mockTransactionData = JSON.parse(mockPayload.message.value.toString());
      const isFraudulent = mockTransactionData.value > parseInt(process.env.FRAUD_THRESHOLD_AMOUNT);
      const expectedTransactionStatus = isFraudulent ? 'rejected' : 'approved';
  
      expect(mockRun).toHaveBeenCalled();
      expect(mockTransactionService.updateTransaction).toHaveBeenCalledWith(
        mockTransactionData,
        expectedTransactionStatus,
      );
    });
  });  
});
