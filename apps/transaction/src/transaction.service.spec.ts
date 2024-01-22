import { Transaction } from '@app/database/entities/transaction';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionDto } from './dto/get-transaction.dto';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: 'ANTI-FRAUD-SERVICE',
          useValue: {
            send: jest.fn(() => {
              return { subscribe: jest.fn() };
            }),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an instance of Transaction', () => {
    const dto = new CreateTransactionDto();
    jest.spyOn(repository, 'save').mockResolvedValue(new Transaction());
    return service.createTransaction(dto).then((response) => {
      expect(response).toBeInstanceOf(GetTransactionDto);
    });
  });
});
