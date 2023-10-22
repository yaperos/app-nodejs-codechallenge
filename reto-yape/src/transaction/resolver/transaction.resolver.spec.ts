import { ClientProxy } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestTransaction } from '../dto/request-transaction.args';
import { TransactionStatusEntity } from '../entity/transaction-status.entity';
import { TransactionTypeEntity } from '../entity/transaction-type.entity';
import { TransactionEntity } from '../entity/transaction.entity';
import { TransactionService } from '../service/transaction.service';
import { TransactionResolver } from './transaction.resolver';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;
  let transactionService: TransactionService;
  let kafkaClient: ClientProxy;

  const customerRepositoryMock: MockType<Repository<TransactionEntity>> = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionResolver,
        TransactionService,
        {
          provide: 'TRANSACTION_SERVICE',
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(TransactionEntity),
          useValue: customerRepositoryMock,
        },
        {
          provide: getRepositoryToken(TransactionStatusEntity),
          useValue: customerRepositoryMock,
        },
        {
          provide: getRepositoryToken(TransactionTypeEntity),
          useValue: customerRepositoryMock,
        },
      ],
    }).compile();

    resolver = module.get<TransactionResolver>(TransactionResolver);
    transactionService = module.get<TransactionService>(TransactionService);
    kafkaClient = module.get<ClientProxy>('TRANSACTION_SERVICE');
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return an array of transactions', async () => {
    const mockTransactions = [{} as any];
    jest.spyOn(transactionService, 'findAll').mockResolvedValue(mockTransactions);

    const result = await resolver.transaction();

    expect(result).toEqual(mockTransactions);
  });

  it('should return a single transaction by external ID', async () => {
    const mockTransaction = {} as any;
    jest.spyOn(transactionService, 'findById').mockResolvedValue(mockTransaction);

    const result = await resolver.transactionById('mockExternalId');

    expect(result).toEqual(mockTransaction);
  });

  it('should save a transaction and emit a Kafka event', async () => {
    const mockReqTransaction: RequestTransaction = {} as any;
    const mockSavedTransaction = {} as any;
    jest.spyOn(transactionService, 'save').mockResolvedValue(mockSavedTransaction);

    const result = await resolver.saveTransaction(mockReqTransaction);

    expect(result).toEqual(mockSavedTransaction);
    expect(kafkaClient.emit).toHaveBeenCalledWith('transaction_created', { message: mockSavedTransaction });
  });
});
