import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;

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
          provide: 'ANTI-FRAUD-MICROSERVICE',
          useValue: {
            send: jest.fn(() => {
              return { subscribe: jest.fn() };
            }),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an instance of Transaction', () => {
    const dto = new CreateTransactionDto();
    return service.create(dto).then((response) => {
      expect(response).toBeInstanceOf(Transaction);
    });
  });
});
