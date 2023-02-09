import { Test, TestingModule } from '@nestjs/testing';
import { ClientKafka } from '@nestjs/microservices';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionsService } from './transactions.service';
import { Transaction } from '../entities/transaction.entity';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: Repository<Transaction>;
  let client: ClientKafka;  
  const mockTransaction = {
    id: "b6fbf1d1-a35a-4952-bf64-f8dee9238c0e",
    tranferTypeId: 3,
    status: "pending",
    value: 789,
    createdAt: "2023-02-08T19:51:45.027Z"
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(mockTransaction),
            save: jest.fn().mockResolvedValue(mockTransaction),
          }
        },
        {
          provide: 'ANTIFRAUD_SERVICE',
          useValue: {
            send: jest.fn().mockReturnThis(),
            subscribe: jest.fn().mockReturnThis(),
          },
        }
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  it('should get findOne', async () => {
    const expectResult = {
      transactionExternalId: 'b6fbf1d1-a35a-4952-bf64-f8dee9238c0e',
      transactionType: { name: 3 },
      transactionStatus: { name: 'pending' },
      value: 789,
      createdAt: '2023-02-08T19:51:45.027Z'
    };

    jest.spyOn(repository, 'findOneBy');
    const transaction = await service.findOne('b6fbf1d1-a35a-4952-bf64-f8dee9238c0e');
    expect(transaction).toEqual(expectResult);
    expect(repository.findOneBy).toBeCalledTimes(1);
  });

  it('should create transaction',async () => {
    const expectResult = {
      transactionExternalId: 'b6fbf1d1-a35a-4952-bf64-f8dee9238c0e',
      transactionType: { name: 3 },
      transactionStatus: { name: 'pending' },
      value: 789,
      createdAt: '2023-02-08T19:51:45.027Z'
    };

    jest.spyOn(repository, 'save');
    const transaction = await service.create({
      accountExternalIdDebit: "07261b14-7db4-444d-9373-898a7abb1f08",
      accountExternalIdCredit: "a7eefd9a-36b9-4393-b967-e7999a923b3e",
      tranferTypeId: 3,
      value: 789
    });
    expect(transaction).toEqual(expectResult);
    expect(repository.save).toBeCalledTimes(1);
  });

});
