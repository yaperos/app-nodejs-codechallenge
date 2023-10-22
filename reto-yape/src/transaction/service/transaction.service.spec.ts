import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { TransactionStatusEntity } from '../entity/transaction-status.entity';
import { TransactionTypeEntity } from '../entity/transaction-type.entity';
import { TransactionEntity } from '../entity/transaction.entity';
import { TransactionService } from './transaction.service';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

describe('TransactionService', () => {
  let service: TransactionService;
  let transactionRepository: Repository<TransactionEntity>;
  let transactionStatusRepository: Repository<TransactionStatusEntity>;
  let transactionTypeRepository: Repository<TransactionTypeEntity>;
  const customerRepositoryMock: MockType<Repository<TransactionEntity>> = {
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
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

    service = module.get<TransactionService>(TransactionService);
    transactionRepository = module.get<Repository<TransactionEntity>>(
      getRepositoryToken(TransactionEntity),
    );
    transactionStatusRepository = module.get<Repository<TransactionStatusEntity>>(
      getRepositoryToken(TransactionStatusEntity),
    );
    transactionTypeRepository = module.get<Repository<TransactionTypeEntity>>(
      getRepositoryToken(TransactionTypeEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of transactions', async () => {
    const mockTransactions: TransactionEntity[] = [{} as any];
    jest.spyOn(transactionRepository, 'find').mockResolvedValue(mockTransactions);

    const result = await service.findAll();

    expect(result).toEqual(mockTransactions);
  });

  it('should update the transaction status', async () => {
    const mockUpdateResult: UpdateResult = {} as any;
    const mockStatus = {} as any;
    jest.spyOn(transactionStatusRepository, 'findOne').mockResolvedValue(mockStatus);
    jest.spyOn(transactionRepository, 'update').mockResolvedValue(mockUpdateResult);

    const result = await service.updated('mockTransactionExternalId', 1);

    expect(result).toEqual(mockUpdateResult);
    expect(transactionStatusRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(transactionRepository.update).toHaveBeenCalledWith('mockTransactionExternalId', {
      transactionStatus: mockStatus,
    });
  });
});
