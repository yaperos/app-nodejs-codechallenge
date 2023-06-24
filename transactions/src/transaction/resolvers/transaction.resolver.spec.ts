import { Test, TestingModule } from '@nestjs/testing';

import { TransactionResolver } from './transaction.resolver';
import { TransactionService } from '../services/transaction.service';

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionResolver,
        {
          provide: TransactionService,
          useValue: {
            findOneById: jest.fn(),
            createTransaction: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<TransactionResolver>(TransactionResolver);
    service = module.get<TransactionService>(TransactionService);
  });

  it('transactionById should call the findOneById service method', async () => {
    const id = 'trx-id';
    await resolver.transactionById(id);

    expect(service.findOneById).toBeCalledWith(id);
  });

  it('createTransaction should call the createTransaction service method', async () => {
    const newTransaction = { value: 5000 } as any;
    await resolver.createTransaction(newTransaction);

    expect(service.createTransaction).toBeCalledWith(newTransaction);
  });
});
