import { Test, TestingModule } from '@nestjs/testing';
import { TransactionResolver } from './transaction.resolver';
import { TransactionService } from '../../transactions/services/transaction.service';
import { KafkaProducerService } from '../../kafka/services/kafka-producer.service';
import { TransactionDto } from '../../common/dto/transaction.dto';
import { CreateTransactionInput } from '../../common/dto/transaction.input';

const mockTransactionService = {
  getAllTransactions: jest.fn(),
  storeTransaction: jest.fn(),
};

const mockKafkaProducerService = {
  sendTransactionToTopic: jest.fn(),
};

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionResolver,
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
        {
          provide: KafkaProducerService,
          useValue: mockKafkaProducerService,
        },
      ],
    }).compile();

    resolver = module.get<TransactionResolver>(TransactionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getAllTransactions', () => {
    it('should return all transactions', async () => {
      const mockTransactions: TransactionDto[] = [
          {
            "transactionExternalId": "52b8e182-cb03-4f67-bba8-0345cece8c9f",
            "accountExternalIdDebit": "a5e7be8d-12a5-4a3e-abfa-03ea7bc520a1",
            "accountExternalIdCredit": "9cdef21b-b973-4860-adc5-7eda63e0e1b1",
            "value": 1000,
            "transactionType": {
              "id": 1,
              "name": "Interbancaria"
            },
            "transactionStatus": {
              "id": 3,
              "name": "approved"
            },
            "createdAt": new Date("2024-02-11T05:38:49.084Z"),
            "updatedAt": new Date("2024-02-11T05:38:49.084Z")
        },
        {
            "transactionExternalId": "ed8b36b4-4679-4403-a4d9-3fcd00b3becf",
            "accountExternalIdDebit": "a5e7be8d-12a5-4a3e-abfa-03ea7bc520b1",
            "accountExternalIdCredit": "9cdef21b-b973-4860-adc5-7eda63e0e1c1",
            "value": 5000,
            "transactionType": {
              "id": 1,
              "name": "Interbancaria"
            },
            "transactionStatus": {
              "id": 2,
              "name": "rejected"
            },
            "createdAt": new Date("2024-02-11T15:02:16.941Z"),
            "updatedAt": new Date("2024-02-11T15:02:16.941Z")
        },
      ];
      mockTransactionService.getAllTransactions.mockReturnValueOnce(mockTransactions);

      const result = await resolver.getAllTransactions();

      expect(result).toEqual(mockTransactions);
      expect(mockTransactionService.getAllTransactions).toHaveBeenCalled();
    });
  });

  describe('createTransaction', () => {
    it('should create a new transaction and send it to Kafka', async () => {
      const mockInput: CreateTransactionInput = {
        "accountExternalIdDebit": "a5e7be8d-12a5-4a3e-abfa-03ea7bc520a1",
        "accountExternalIdCredit": "9cdef21b-b973-4860-adc5-7eda63e0e1b1",
        "transferTypeId": 1,
        "value": 800,
      };
      const mockTransaction: TransactionDto = {
        "transactionExternalId": "ed8b36b4-4679-4403-a4d9-3fcd00b3becf",
        "accountExternalIdDebit": "a5e7be8d-12a5-4a3e-abfa-03ea7bc520b1",
        "accountExternalIdCredit": "9cdef21b-b973-4860-adc5-7eda63e0e1c1",
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
      }
      mockTransactionService.storeTransaction.mockReturnValueOnce(mockTransaction);

      const result = await resolver.createTransaction(mockInput);

      expect(result).toEqual(mockTransaction);
      expect(mockTransactionService.storeTransaction).toHaveBeenCalledWith(expect.objectContaining(mockInput));
      expect(mockKafkaProducerService.sendTransactionToTopic).toHaveBeenCalledWith(mockTransaction);
    });
  });
});
