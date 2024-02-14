import { Test, TestingModule } from '@nestjs/testing';
import { KafkaProducerService } from './kafka-producer.service';
import { Kafka, ProducerRecord } from 'kafkajs';

jest.mock('kafkajs', () => ({
  Kafka: jest.fn(),
  Producer: jest.fn(),
}));

const mockConnect = jest.fn();
const mockDisconnect = jest.fn();
const mockSend = jest.fn();

(Kafka as jest.Mock).mockImplementation(() => ({
  producer: jest.fn(() => ({
    connect: mockConnect,
    disconnect: mockDisconnect,
    send: mockSend,
  })),
}));

describe('KafkaProducerService', () => {
  let service: KafkaProducerService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [KafkaProducerService],
    }).compile();

    service = module.get<KafkaProducerService>(KafkaProducerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('connect', () => {
    it('should connect to Kafka producer', async () => {
      await service.connect();

      expect(mockConnect).toHaveBeenCalled();
    });
  });

  describe('disconnect', () => {
    it('should disconnect from Kafka producer', async () => {
      await service.disconnect();

      expect(mockDisconnect).toHaveBeenCalled();
    });
  });

  describe('sendTransactionToTopic', () => {
    it('should send transaction data to Kafka topic', async () => {
      const mockTransactionData = {
        "value": 5000,
        "createdAt": new Date("2024-02-11T15:02:16.941Z"),
        "updatedAt": new Date("2024-02-11T15:02:16.941Z"),
        "transferTypeId": 1,
        "transferStatusId": 1,
        "transactionType": {
            "id": 1,
            "name": "Interbancaria"
        },
        "transactionStatus": {
            "id": 1,
            "name": "pending"
        },
        "transactionExternalId": "ed8b36b4-4679-4403-a4d9-3fcd00b3becf",
        "accountExternalIdDebit": "a5e7be8d-12a5-4a3e-abfa-03ea7bc520b1",
        "accountExternalIdCredit": "9cdef21b-b973-4860-adc5-7eda63e0e1c1"
      };

      await service.sendTransactionToTopic(mockTransactionData);

      const expectedTopic = process.env.KAFKA_TRANSACTIONS_TOPIC;
      const expectedMessage: ProducerRecord = {
        topic: expectedTopic,
        messages: [{ value: JSON.stringify(mockTransactionData) }],
      };

      expect(mockConnect).toHaveBeenCalled();
      expect(mockSend).toHaveBeenCalledWith(expectedMessage);
    });
  });
});
