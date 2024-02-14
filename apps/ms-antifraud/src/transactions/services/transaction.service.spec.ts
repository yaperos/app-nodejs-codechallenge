import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../common/entities/transaction.entity';
import { TransactionService } from './transaction.service';
import { CreateTransactionInput } from '../../common/dto/transaction.input';
import { TransactionStatuses } from '../../common/enums/transaction-statuses.enum';
import { TransactionDto } from 'src/common/dto/transaction.dto';

const mockTransactionRepository = {
  find: jest.fn(),
  update: jest.fn(),
  insert: jest.fn(),
  findOne: jest.fn(),
};

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all transactions', async () => {
    const mockTransactions: Transaction[] = [
      {
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
            "name": "rejected"
        },
        "createdAt": new Date("2024-02-11T15:02:16.941Z"),
        "updatedAt": new Date("2024-02-11T15:02:16.941Z"),
      },
      {
        "transactionExternalId": "ed8b36b4-4679-4403-a4d9-3fcd00b3becg",
        "accountExternalIdDebit": "a5e7be8d-12a5-4a3e-abfa-03ea7bc520b2",
        "accountExternalIdCredit": "9cdef21b-b973-4860-adc5-7eda63e0e1c2",
        "transferTypeId": 1,
        "transferStatusId": 1,
        "value": 500,
        "transactionType": {
            "id": 1,
            "name": "Interbancaria"
        },
        "transactionStatus": {
            "id": 1,
            "name": "approved"
        },
        "createdAt": new Date("2024-02-11T15:02:16.941Z"),
        "updatedAt": new Date("2024-02-11T15:02:16.941Z"),
      }
    ];

    mockTransactionRepository.find.mockReturnValueOnce(mockTransactions);

    const result = await service.getAllTransactions();

    expect(result).toEqual(mockTransactions);
    expect(mockTransactionRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should update transaction status', async () => {
    const mockTransactionData: TransactionDto = {
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
    const mockTransactionStatus = 'approved';

    await service.updateTransaction(mockTransactionData, mockTransactionStatus);

    expect(mockTransactionRepository.update).toHaveBeenCalledWith(
      { transactionExternalId: mockTransactionData.transactionExternalId },
      { transferStatusId: TransactionStatuses[mockTransactionStatus] },
    );
  });

  it('should store a new transaction', async () => {
    const mockTransactionData: CreateTransactionInput = {
      "accountExternalIdDebit": "a5e7be8d-12a5-4a3e-abfa-03ea7bc520a1",
      "accountExternalIdCredit": "9cdef21b-b973-4860-adc5-7eda63e0e1b1",
      "transferTypeId": 1,
      "value": 800,
    };
    const mockInsertResult = { identifiers: [{ transactionExternalId: 'mockId' }] };
    const mockTransaction: Transaction = {
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
    };

    mockTransactionRepository.insert.mockReturnValueOnce(mockInsertResult);
    mockTransactionRepository.findOne.mockReturnValueOnce(mockTransaction);

    const result = await service.storeTransaction(mockTransactionData);

    expect(mockTransactionRepository.insert).toHaveBeenCalledWith(expect.objectContaining(mockTransactionData));
    expect(mockTransactionRepository.findOne).toHaveBeenCalledWith(
      { where: { transactionExternalId: 'mockId' }, relations: ['transactionType', 'transactionStatus'] },
    );
    expect(result).toEqual(mockTransaction);
  });
});
